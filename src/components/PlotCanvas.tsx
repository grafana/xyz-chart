import { Html, useProgress } from '@react-three/drei';
import React, { createRef, useEffect, useState, RefObject, ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DataFrame } from '@grafana/data';

import { Camera } from 'components/Camera';
import { getIntervalLabels, prepData } from 'utils';
import { WHITE } from 'consts';
import { XYZChartOptions } from 'models.gen';
import { PointCloud } from './PointCloud';
import { GridVolume } from './GridVolume';
import { LegendDisplayMode, VizLayout, VizLegend } from '@grafana/ui';

interface Props {
  frames: DataFrame[];
  frameOptions: Array<{ pointColor: string; pointSize: number }>;
  options: XYZChartOptions;
}

const PlotCanvas: React.FC<Props> = ({ frames, options, frameOptions }) => {
  let ambLightRef: RefObject<ReactNode> = createRef();
  let pntLightRef: RefObject<ReactNode> = createRef();
  const [pointData, setPointData] = useState(prepData(frames, frameOptions));
  const [intervalLabels, setIntervalLabels] = useState(getIntervalLabels(frames));

  useEffect(() => {
    const newLabels = getIntervalLabels(frames);

    setIntervalLabels(newLabels);
    setPointData(prepData(frames, frameOptions));
  }, [frames, frameOptions]);

  function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }

  const legend = frames.map((frame, idx) => {
    return {
      label: frame.refId!,
      yAxis: 1,
      color: frameOptions[idx].pointColor,
    };
  });

  return (
    <>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Canvas mode="concurrent" raycaster={{ params: { Points: { threshold: 2 } } }} linear flat>
          {/* 
            Context does not work outside of Canvas. Seems Canvas is outside parent component in DOM 
            https://github.com/facebook/react/issues/17126
          */}
          <Suspense fallback={<Loader />}>
              <Camera />
              <ambientLight ref={ambLightRef} intensity={0.8} color={WHITE} />
              <pointLight ref={pntLightRef} intensity={1.0} position={[10, 10, 10]} />
              <Suspense fallback={null}>
                {frames && frameOptions && frames.map((frame, idx) => {
                    return <PointCloud key={idx} frame={frame} options={frameOptions[idx]} points={pointData[idx]} lights={[ambLightRef, pntLightRef]} />
                  })
                }
              </Suspense>
              <GridVolume intervalLabels={intervalLabels} />
          </Suspense>
        </Canvas>
        <VizLayout.Legend placement={'bottom'}>
          <VizLegend
            placement={'bottom'}
            items={legend}
            displayMode={LegendDisplayMode.List}
            // sortBy={vizLayoutLegendProps.sortBy}
            // sortDesc={vizLayoutLegendProps.sortDesc}
            // isSortable={true}
          />
        </VizLayout.Legend>
      </div>
    </>
  );
};

export default PlotCanvas;
