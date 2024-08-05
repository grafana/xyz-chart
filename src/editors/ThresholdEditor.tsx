import { StandardEditorProps } from '@grafana/data';
import { Button, ColorPicker, Input, Select } from '@grafana/ui';
import React from 'react';

enum Dimension {
  X,
  Y,
  Z,
}

interface XYZThreshold {
  value: number;
  dimension: Dimension;
}

interface XYZThresholdOptions {
  thresholds: XYZThreshold[];
}

type Props = StandardEditorProps<string[], unknown, XYZThresholdOptions>;

export const ThresholdEditor = ({ value, onChange }: Props) => {
  const OPTS = [
    { label: 'X', value: Dimension.X },
    { label: 'Y', value: Dimension.Y },
    { label: 'Z', value: Dimension.Z },
  ];

  let pickers = [];
  for (let i = 0; i < 3; i++) {
    pickers.push(
      <>
        <ColorPicker color="#000" onChange={() => {}} />
        <Select options={OPTS} onChange={() => {}} />
        <Input />
      </>
    );
  }

  return (
    <>
      <Button>Add</Button>
      {pickers}
    </>
  );
};
