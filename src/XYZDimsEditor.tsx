import React, { useEffect, useMemo } from 'react';

import { SelectableValue, getFrameDisplayName, StandardEditorProps, getFieldDisplayName } from '@grafana/data';
import { Label, Select } from '@grafana/ui';

import { getXYZDimensions } from './dims';
import { XYZDimensionConfig, XYZChartOptions } from './models.gen';

interface XYZInfo {
  validFields: Array<SelectableValue<string>>;
  xField: SelectableValue<string>;
}

export const XYZDimsEditor = ({
  value,
  onChange,
  context,
}: StandardEditorProps<XYZDimensionConfig, null, XYZChartOptions>) => {
  const frameNames = useMemo(() => {
    if (context?.data?.length) {
      return context.data.map((f, idx) => ({
        value: idx,
        label: getFrameDisplayName(f, idx),
      }));
    }
    return [{ value: 0, label: 'First result' }];
  }, [context.data]);

  // Resets value.x to undefined whenever
  // the frame index or data change.
  //
  // onChange is only called on select interaction
  // so we need to call it manually here when data changes
  useEffect(() => {
    if (value?.x !== undefined) {
      onChange({
        ...value,
        x: undefined
      })
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [context.data, value?.frame]);

  const dims = useMemo(() => getXYZDimensions(value, context.data), [context.data, value]);

  const info = useMemo(() => {
    const notFoundField = {
      label: `Not found`,
      value: undefined
    };

    const errorInfo: XYZInfo = {
      validFields: [notFoundField],
      xField: notFoundField
    }

    if (context.data.length === 0 || !dims.frame) {
      return errorInfo;
    }

    let fieldsInfo: XYZInfo = {
      validFields: [],
      xField: {}
    };
    const frame = context.data ? context.data[value?.frame ?? 0] : undefined;

    if (frame?.fields) {
      const firstNumericValField = frame.fields.find((f) => f.type === 'number');
      if (firstNumericValField) {
        const firstNumericValFieldName = getFieldDisplayName(firstNumericValField, frame, context.data);

        fieldsInfo.xField = {
          label: `${firstNumericValFieldName} (First)`,
          value: firstNumericValFieldName,
        };
      }
    }

    for (let field of dims.frame.fields) {
      const name = getFieldDisplayName(field, frame, context.data);
      const sel = {
        label: name,
        value: name,
      };
      fieldsInfo.validFields.push(sel);
      if (value?.x && name === value.x) {
        fieldsInfo.xField = sel;
      }
    }

    return fieldsInfo;
  }, [context.data, dims.frame, value]);

  return (
    <div>
      <Select
        options={frameNames}
        value={frameNames.find((v) => v.value === value?.frame) ?? frameNames[0]}
        onChange={(v) => {
          onChange({
            ...value,
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
            ...value,
            x: v.value,
          });
        }}
      />
      <br />
      <br />
    </div>
  );
};
