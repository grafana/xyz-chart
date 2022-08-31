import React, { RefObject, ReactNode, useState, useRef } from 'react';
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
  let ambLightRef: RefObject<ReactNode> = useRef(null);
  let pntLightRef: RefObject<ReactNode> = useRef(null);
  let hudRef: RefObject<ReactNode> = useRef(null);
  let canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);

  return (
    <>
      <OptionsProvider value={options}>
        <HUD hoveredPoint={ hoveredPoint } hudRef={ hudRef } />
      </OptionsProvider>
      <Canvas mode="concurrent" ref={ canvasRef } raycaster={{ params: { Points: { threshold: 2 } } }} linear flat>
        {/* 
          Context does not work outside of Canvas because it will cross rendering boundary from
          ReactDOM to R3F. See: https://github.com/facebook/react/issues/17126
        */}
        <OptionsProvider value={options}>
          <SkyBox />
          <Camera hoveredPoint={ hoveredPoint } />
          <ambientLight ref={ambLightRef} intensity={0.8} color={WHITE} />
          <pointLight ref={pntLightRef} intensity={1.0} position={[10, 10, 10]} />
          <PlotScene
            hudRef={ hudRef }
            canvasRef={ canvasRef }
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
