import React from 'react';
import { ToolbarButtonRow, ToolbarButton } from '@grafana/ui';

interface Props {}

export const CameraControls: React.FC<Props> = ({}) => {
  const style: any = {
    position: 'absolute',
    zIndex: 1,
  };
      
  return (
    <ToolbarButtonRow style={style}>
      <ToolbarButton>Orbit</ToolbarButton>
      <ToolbarButton>Overview</ToolbarButton>
      <ToolbarButton>X</ToolbarButton>
      <ToolbarButton>Y</ToolbarButton>
      <ToolbarButton>Z</ToolbarButton>
    </ToolbarButtonRow>
  );
};
