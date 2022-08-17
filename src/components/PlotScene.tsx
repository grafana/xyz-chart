import { DataFrame } from '@grafana/data';
import React, { useContext, useEffect, useState, RefObject, ReactNode, Suspense } from 'react';
import { Direction, ScatterPlotOptions } from 'types';
import { getIntervalLabels, prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import OptionsContext from 'optionsContext';
import { LABEL_INT, SCENE_SCALE } from 'consts';

interface Props {
  frames: DataFrame[];
  lights: RefObject<ReactNode>[];
  onPointerOver?: Function;
  onPointerOut?: Function;
}

export const PlotScene: React.FC<Props> = ({ frames, lights, onPointerOut, onPointerOver }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  //TODO refactor scene size, label intervals, grids will be fixed like XY Chart
  const size = SCENE_SCALE;
  const gridInterval = LABEL_INT;
  const dateFormat = options.labelDateFormat;
  const dataPointColor = options.dataPointColor;

  const [pointData, setPointData] = useState(prepData(frames, size, dataPointColor));
  const [intervalLabels, setIntervalLabels] = useState(
    getIntervalLabels(frames, size, gridInterval, options.labelDateFormat)
  );

  useEffect(() => {
    const newLabels = getIntervalLabels(frames, size, gridInterval, dateFormat);

    setIntervalLabels(newLabels);
    setPointData(prepData(frames, size, dataPointColor));
  }, [size, gridInterval, frames]);

  useEffect(() => {
    setIntervalLabels(getIntervalLabels(frames, size, gridInterval, dateFormat));
  }, [dateFormat]);

  return (
    <>
      <Suspense fallback={null}>
        <PointCloud onPointerOver={onPointerOver} onPointerOut={onPointerOut} points={pointData} lights={lights} />
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
