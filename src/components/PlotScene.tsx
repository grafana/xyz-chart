import { DataFrame } from '@grafana/data';
import React, { useContext, useEffect, useState, RefObject, ReactNode, Suspense } from 'react';
import { Direction, ScatterPlotOptions } from 'types';
import { getIntervalLabels, prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import OptionsContext from 'optionsContext';

interface Props {
  frames: DataFrame[];
  lights: RefObject<ReactNode>[];
  onPointerOver?: Function;
  onPointerOut?: Function;
}

export const PlotScene: React.FC<Props> = ({ frames, lights, onPointerOut, onPointerOver }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  const size = options.sceneScale;
  const gridInterval = options.labelInterval;
  const dateFormat = options.labelDateFormat;
  const dataPointColor = options.dataPointColor;

  const [pointData, setPointData] = useState(prepData(frames, size, dataPointColor));
  const [oldPointData, setOldPointData] = useState(null as any);
  const [intervalLabels, setIntervalLabels] = useState(
    getIntervalLabels(frames, size, gridInterval, options.labelDateFormat)
  );

  useEffect(() => {
    setPointData(prepData(frames, size, dataPointColor));
    setIntervalLabels(getIntervalLabels(frames, size, gridInterval, dateFormat));
  }, [size, gridInterval]);

  useEffect(() => {
    setIntervalLabels(getIntervalLabels(frames, size, gridInterval, dateFormat));
  }, [dateFormat]);

  useEffect(() => {
    setOldPointData(pointData);
    setPointData(prepData(frames, size, dataPointColor));
  }, [frames]);

  return (
    <>
      <Suspense fallback={null}>
        <PointCloud 
          onPointerOver={ onPointerOver }
          onPointerOut={ onPointerOut }
          currentPoints={ pointData } 
          oldPoints={ oldPointData } 
          lights={ lights } />
      </Suspense>
      <group>
        <Grid
          direction={Direction.Up}
          size={size}
          gridInterval={gridInterval}
          intervalLabels={intervalLabels.yLabels}
        />
        <Grid
          direction={Direction.Right}
          size={size}
          gridInterval={gridInterval}
          intervalLabels={intervalLabels.xLabels}
        />
        <Grid
          direction={Direction.Forward}
          size={size}
          gridInterval={gridInterval}
          intervalLabels={intervalLabels.zLabels}
        />
      </group>
    </>
  );
};
