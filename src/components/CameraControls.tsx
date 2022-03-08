import React from 'react';
import { ToolbarButtonRow, ToolbarButton } from '@grafana/ui';

interface Props {}

export const CameraControls: React.FC<Props> = ({}) => {
  return (
    <ToolbarButtonRow>
      <ToolbarButton>Orbit</ToolbarButton>
      <ToolbarButton>Overview</ToolbarButton>
      <ToolbarButton>X</ToolbarButton>
      <ToolbarButton>Y</ToolbarButton>
      <ToolbarButton>Z</ToolbarButton>
    </ToolbarButtonRow>
  );
};
