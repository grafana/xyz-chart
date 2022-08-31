import React, { createRef, RefObject, ReactNode, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera } from 'components/Camera';
import { PlotScene } from 'components/PlotScene';
import { DataFrame } from '@grafana/data';
import { WHITE } from 'consts';
import { ScatterPlotOptions, HoveredPoint } from 'types';
import { OptionsProvider } from 'optionsContext';
import { SkyBox } from './SkyBox';
import { HUD } from './HUD';

interface Props {
  frames: DataFrame[];
  options: ScatterPlotOptions;
}

export const PlotCanvas: React.FC<Props> = ({ frames, options }) => {
  let ambLightRef: RefObject<ReactNode> = createRef();
  let pntLightRef: RefObject<ReactNode> = createRef();
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);


  return (
    <>
      { hoveredPoint !== null && <HUD hoveredPoint={ hoveredPoint } /> }
      <Canvas mode="concurrent" raycaster={{ params: { Points: { threshold: 2 } } }} linear flat style={{position: 'relative', border: '1px solid red'}}>
        {/* 
          Context does not work outside of Canvas because it will cross rendering boundary from
          ReactDOM to R3F. See: https://github.com/facebook/react/issues/17126
        */}
        <OptionsProvider value={options}>
          <SkyBox />
          <scene>
            <Camera hoveredPoint={ hoveredPoint } />
          </scene>
          <ambientLight ref={ambLightRef} intensity={0.8} color={WHITE} />
          <pointLight ref={pntLightRef} intensity={1.0} position={[10, 10, 10]} />
          <PlotScene 
            frames={ frames } 
            lights={ [ambLightRef, pntLightRef] } 
            hoveredPoint={ hoveredPoint }
            setHoveredPoint={ setHoveredPoint }
            />
        </OptionsProvider>  
      </Canvas>
    </>
  );
};
