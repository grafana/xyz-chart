import { DataFrame } from '@grafana/data';
import React, { useContext, useEffect, useState } from 'react';
import { Direction, ScatterPlotOptions } from 'types';
import { getIntervalLabels, prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import OptionsContext from 'optionsContext';

interface Props {
  frames: DataFrame[];
}

export const PlotScene: React.FC<Props> = ({ frames }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  const size = options.sceneScale;
  const gridInterval = options.labelInterval;

  const [pointData, setPointData] = useState(prepData(frames, size));
  const [intervalLabels, setIntervalLabels] = useState(getIntervalLabels(frames, size, gridInterval));

  useEffect(() => {
    setPointData(prepData(frames, size));
    setIntervalLabels(getIntervalLabels(frames, size, gridInterval));
  }, [size, gridInterval]);

  return (
    <>
      <PointCloud points={pointData} />
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
