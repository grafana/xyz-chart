import { css } from '@emotion/css';
import React, { FC, useMemo } from 'react';

import {
  SelectableValue,
  getFrameDisplayName,
  StandardEditorProps,
  getFieldDisplayName,
  GrafanaTheme2,
} from '@grafana/data';
import { Label, Select, useStyles2 } from '@grafana/ui';

import { getXYZDimensions, isGraphable } from './dims';
import { XYZDimensionConfig, ScatterPlotOptions } from './models.gen';

interface XYZInfo {
  validFields: Array<SelectableValue<string>>;
  xAxis: SelectableValue<string>;
  yField: string | undefined;
  zField: string | undefined;
}

export const XYZDimsEditor: FC<StandardEditorProps<XYZDimensionConfig, any, ScatterPlotOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const frameNames = useMemo(() => {
    if (context?.data?.length) {
      return context.data.map((f, idx) => ({
        value: idx,
        label: getFrameDisplayName(f, idx),
      }));
    }
    return [{ value: 0, label: 'First result' }];
  }, [context.data]);

  const dims = useMemo(() => getXYZDimensions(value, context.data), [context.data, value]);

  const info = useMemo(() => {
    const first = {
      label: '?',
      value: undefined, // empty
    };
    const v: XYZInfo = {
      validFields: [first],
      yField: undefined,
      zField: undefined,
      xAxis: value?.x
        ? {
            label: `${value.x} (Not found)`,
            value: value.x, // empty
          }
        : first,
    };
    const frame = context.data ? context.data[value?.frame ?? 0] : undefined;
    if (frame) {
      const xName = dims.x ? getFieldDisplayName(dims.x, dims.frame, context.data) : undefined;
      for (let field of frame.fields) {
        if (isGraphable(field)) {
          const name = getFieldDisplayName(field, frame, context.data);
          const sel = {
            label: name,
            value: name,
          };
          v.validFields.push(sel);
          if (first.label === '?') {
            first.label = `${name} (First)`;
          }
          if (value?.x && name === value.x) {
            v.xAxis = sel;
          }
          if (xName === name) {
            continue;
          }

          if (v.yField === null) {
            v.yField = name;
          }

          if (v.zField === null && v.yField !== name) {
            v.zField = name;
          }
        }
      }
    }

    return v;
  }, [dims, context.data, value]);

  const styles = useStyles2(getStyles);

  if (!context.data) {
    return <div>No data...</div>;
  }

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
        value={info.xAxis}
        onChange={(v) => {
          onChange({
            ...value,
            x: v.value,
          });
        }}
      />
      <br />
      <Label>Y Field</Label>
      <div>
        <div className={styles.row}>
          {info.yField}
        </div>
      </div>
      <br />
      <Label>Z Field</Label>
      <div>
        <div className={styles.row}>
          {info.zField}
        </div>
      </div>
      <br /><br />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  sorter: css`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
  `,

  row: css`
    padding: ${theme.spacing(0.5, 1)};
    border-radius: ${theme.shape.borderRadius(1)};
    background: ${theme.colors.background.secondary};
    min-height: ${theme.spacing(4)};
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 3px;
    border: 1px solid ${theme.components.input.borderColor};
  `,
});
