import React from 'react';
import { ToolbarButtonRow, ToolbarButton } from '@grafana/ui';
import { CameraOptions } from 'types';

interface Props {
  cameraOpts: CameraOptions;
  updateCameraOpts: Function;
}

export const CameraControls: React.FC<Props> = ({cameraOpts, updateCameraOpts}) => {
  const style: any = {
    position: 'absolute',
    zIndex: 1,
  };
      
  return (
    <ToolbarButtonRow style={style}>
      <ToolbarButton onClick={() => updateCameraOpts({type: "perspective"})}>3D</ToolbarButton>
      <ToolbarButton onClick={() => updateCameraOpts({type: "orthographic", viewPlane: "x"})}>X</ToolbarButton>
      <ToolbarButton onClick={() => updateCameraOpts({type: "orthographic", viewPlane: "y"})}>Y</ToolbarButton>
      <ToolbarButton onClick={() => updateCameraOpts({type: "orthographic", viewPlane: "z"})}>Z</ToolbarButton>
    </ToolbarButtonRow>
  );
};
