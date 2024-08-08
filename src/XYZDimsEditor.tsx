import React from 'react';

import { StandardEditorProps } from '@grafana/data';
import { Button } from '@grafana/ui';

import { XYZDimensionConfig, XYZChartOptions } from './models.gen';
import { XYZDimensionEditor } from 'XYZDimensionEditor';

export const XYZDimsEditor = ({
  value,
  onChange,
  context,
}: StandardEditorProps<XYZDimensionConfig[], null, XYZChartOptions>) => {
  
  const onConfigChange = (dimConfig: XYZDimensionConfig, id: number) => {
    onChange(value.map((dim, idx) => idx === id ? dimConfig : dim));
  }

  const onAddSeries = () => {
    if (!value) {
      onChange([{ frame: 0 }]);
    } else {
      onChange([...value, { frame: 0 }]);
    }
  }

  return (
    <>
      <Button onClick={onAddSeries} variant='secondary' >Add Series</Button>
      {value && value.length && value.map((dim, idx) => 
        <div key={idx}>
          <h3>Series {idx}</h3>
          <XYZDimensionEditor dimConfig={dim} onChange={(dimConfig) => onConfigChange(dimConfig, idx)} data={context.data} />
        </div>
      )}
    </>
  )
};
