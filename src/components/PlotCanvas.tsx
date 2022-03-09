import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera } from 'components/Camera';
import { PlotScene } from 'components/PlotScene';
import { DataFrame } from '@grafana/data';
import { WHITE } from 'consts';
import { ScatterPlotOptions } from 'types';
import { OptionsProvider } from 'optionsContext';

interface Props {
  frames: DataFrame[];
  options: ScatterPlotOptions;
}

export const PlotCanvas: React.FC<Props> = ({ frames, options }) => {
  return (
    <Canvas>
      {/* 
        Context does not work outside of Canvas. Seems Canvas is outside parent component in DOM 
        https://github.com/facebook/react/issues/17126
      */}
      <OptionsProvider value={options}>
        <Camera />
        <ambientLight intensity={0.3} color={WHITE} />
        <pointLight intensity={1.0} position={[10, 10, 10]} />
        <PlotScene frames={frames} />
      </OptionsProvider>
    </Canvas>
  );
};
