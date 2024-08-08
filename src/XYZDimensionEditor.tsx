import React, { useEffect, useMemo } from 'react';

import { SelectableValue, getFrameDisplayName, getFieldDisplayName, DataFrame } from '@grafana/data';
import { ColorPicker, Input, Label, Select } from '@grafana/ui';

import { getXYZDimensions } from './dims';
import { XYZDimensionConfig } from './models.gen';

interface XYZInfo {
  validFields: Array<SelectableValue<string>>;
  xField: SelectableValue<string>;
}

interface Props {
  dimConfig: XYZDimensionConfig;
  onChange: (value: XYZDimensionConfig) => void;
  data: DataFrame[];
}

export const XYZDimensionEditor = ({
  dimConfig,
  onChange,
  data
}: Props) => {
  const frameNames = useMemo(() => {
    if (data?.length) {
      return data.map((f, idx) => ({
        value: idx,
        label: getFrameDisplayName(f, idx),
      }));
    }
    return [{ value: 0, label: 'First result' }];
  }, [data]);

  // Resets value.x to undefined whenever
  // the frame index or data change.
  //
  // onChange is only called on select interaction
  // so we need to call it manually here when data changes
  useEffect(() => {
    if (dimConfig?.x !== undefined) {
      onChange({
        ...dimConfig,
        x: undefined
      })
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [data, dimConfig.frame]);

  const dims = useMemo(() => getXYZDimensions(dimConfig, data), [data, dimConfig]);

  const info = useMemo(() => {
    const notFoundField = {
      label: `Not found`,
      value: undefined
    };

    const errorInfo: XYZInfo = {
      validFields: [notFoundField],
      xField: notFoundField
    }

    if (data.length === 0 || !dims.frame) {
      return errorInfo;
    }

    let fieldsInfo: XYZInfo = {
      validFields: [],
      xField: {}
    };
    const frame = data ? data[dimConfig?.frame ?? 0] : undefined;

    if (frame?.fields) {
      const firstNumericValField = frame.fields.find((f) => f.type === 'number');
      if (firstNumericValField) {
        const firstNumericValFieldName = getFieldDisplayName(firstNumericValField, frame, data);

        fieldsInfo.xField = {
          label: `${firstNumericValFieldName} (First)`,
          value: firstNumericValFieldName,
        };
      }
    }

    for (let field of dims.frame.fields) {
      const name = getFieldDisplayName(field, frame, data);
      const sel = {
        label: name,
        value: name,
      };
      fieldsInfo.validFields.push(sel);
      if (dimConfig?.x && name === dimConfig.x) {
        fieldsInfo.xField = sel;
      }
    }

    return fieldsInfo;
  }, [data, dims.frame, dimConfig]);

  return (
    <div>
      <Select
        options={frameNames}
        value={frameNames.find((v) => v.value === dimConfig?.frame) ?? frameNames[0]}
        onChange={(v) => {
          onChange({
            ...dimConfig,
            frame: v.value!,
          });
        }}
      />
      <br />
      <Label>X Field</Label>
      <Select
        options={info.validFields}
        value={info.xField}
        onChange={(v) => {
          onChange({
            ...dimConfig,
            x: v.value,
          });
        }}
      />
      <br />
      <Label>Point Color</Label>
      <ColorPicker color={dimConfig.pointColor ?? 'red'} onChange={(v) => onChange({ ...dimConfig, pointColor: v })} />
      <br />
      <Label>Point Size</Label>
      <Input type="number" value={dimConfig.pointSize ?? 0} onChange={(v) => onChange({ ...dimConfig, pointSize: Number(v.currentTarget.value) })}/>
      <br />
      <br />
    </div>
  );
};
