import React, { createRef, RefObject, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera } from 'components/Camera';
import { PlotScene } from 'components/PlotScene';
import { DataFrame } from '@grafana/data';
import { WHITE } from 'consts';
import { ScatterPlotOptions } from 'types';
import { OptionsProvider } from 'optionsContext';
import { SkyBox } from './SkyBox';
interface Props {
  frames: DataFrame[];
  options: ScatterPlotOptions;
}

export const PlotCanvas: React.FC<Props> = ({ frames, options }) => {
  let ambLightRef: RefObject<ReactNode> = createRef();
  let pntLightRef: RefObject<ReactNode> = createRef();

  return (
    <>
      {/* TODO: raycaster threshold depends on particle size. is threshold too small, hover won't work, if threshold too large, will hover when outside point */}
      <Canvas mode="concurrent" raycaster={{ params: { Points: { threshold: 3 } } }} linear flat>
        {/* 
          Context does not work outside of Canvas. Seems Canvas is outside parent component in DOM 
          https://github.com/facebook/react/issues/17126
        */}
        <OptionsProvider value={options}>
          <SkyBox />
          <Camera />
          <ambientLight ref={ambLightRef} intensity={0.8} color={WHITE} />
          <pointLight ref={pntLightRef} intensity={1.0} position={[10, 10, 10]} />
          <PlotScene 
            frames={ frames } 
            lights={ [ambLightRef, pntLightRef] } 
            />
        </OptionsProvider>  
      </Canvas>
    </>
  );
};
