import React from 'react';
import { ToolbarButtonRow, ToolbarButton } from '@grafana/ui';
import { CameraOptions } from 'types';

interface Props {
  cameraOpts: CameraOptions;
  updateCameraOpts: Function;
}

export const CameraControls: React.FC<Props> = ({cameraOpts, updateCameraOpts}) => {
  const { type, viewPlane } = cameraOpts;

  const style: any = {
    position: 'absolute',
    zIndex: 1,
  };
      
  return (
    <ToolbarButtonRow style={style}>
      <ToolbarButton 
        variant={type == 'perspective' ? 'active' : 'default'} 
        onClick={() => updateCameraOpts({type: "perspective"})}>
          3D
      </ToolbarButton>
      <ToolbarButton 
        variant={type == 'orthographic' && viewPlane == 'x' ? 'active' : 'default'}
        onClick={() => updateCameraOpts({type: "orthographic", viewPlane: "x"})}>
          X
      </ToolbarButton>
      <ToolbarButton
        variant={type == 'orthographic' && viewPlane == 'y' ? 'active' : 'default'}
        onClick={() => updateCameraOpts({type: "orthographic", viewPlane: "y"})}>
        Y
        </ToolbarButton>
      <ToolbarButton 
        variant={type == 'orthographic' && viewPlane == 'z' ? 'active' : 'default'}
        onClick={() => updateCameraOpts({type: "orthographic", viewPlane: "z"})}>
          Z
      </ToolbarButton>
    </ToolbarButtonRow>
  );
};
