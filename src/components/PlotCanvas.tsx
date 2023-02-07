import { Html, useProgress } from '@react-three/drei';
import React, { createRef, useEffect, useState, RefObject, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DataFrame } from '@grafana/data';

import { Camera } from 'components/Camera';
import { getIntervalLabels, prepData } from 'utils';
import { WHITE } from 'consts';
import { XYZChartOptions } from 'models.gen';
import { OptionsProvider } from 'optionsContext';
import { PointCloud } from './PointCloud';
import { GridVolume } from './GridVolume';
interface Props {
  frames: DataFrame[];
  options: XYZChartOptions;
}

const PlotCanvas: React.FC<Props> = ({ frames, options }) => {
  let ambLightRef: RefObject<ReactNode> = createRef();
  let pntLightRef: RefObject<ReactNode> = createRef();
  const [pointData, setPointData] = useState(prepData(frames, options.pointColor ?? '#ff0000'));
  const [intervalLabels, setIntervalLabels] = useState(getIntervalLabels(frames));

  useEffect(() => {
    const newLabels = getIntervalLabels(frames);

    setIntervalLabels(newLabels);
    setPointData(prepData(frames, options.pointColor ?? '#ff0000'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }

  return (
    <>
      <Canvas mode="concurrent" raycaster={{ params: { Points: { threshold: 2 } } }} linear flat>
        {/* 
          Context does not work outside of Canvas. Seems Canvas is outside parent component in DOM 
          https://github.com/facebook/react/issues/17126
        */}
        <Suspense fallback={<Loader />}>
          <OptionsProvider value={options}>
            <Camera />
            <ambientLight ref={ambLightRef} intensity={0.8} color={WHITE} />
            <pointLight ref={pntLightRef} intensity={1.0} position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <PointCloud frames={frames} points={pointData} lights={[ambLightRef, pntLightRef]} />
            </Suspense>
            <GridVolume intervalLabels={intervalLabels} />
          </OptionsProvider>
        </Suspense>
      </Canvas>
    </>
  );
};

export default PlotCanvas;
