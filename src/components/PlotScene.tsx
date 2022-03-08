import { DataFrame } from '@grafana/data';
import React from 'react';
import { Direction } from 'types';
import { prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import { LABEL_INTERVAL, SCENE_SCALE } from 'consts';

interface Props {
  frames: DataFrame[];
}

export const PlotScene: React.FC<Props> = ({ frames }) => {
  // const theme = useTheme();
  // const styles = getStyles();

  const size = SCENE_SCALE;
  const gridInterval = LABEL_INTERVAL;
  const pointData = prepData(frames);

  return (
    <>
      <PointCloud points={pointData} />
      <group>
        <Grid direction={Direction.Up} size={size} gridInterval={gridInterval} />
        <Grid direction={Direction.Right} size={size} gridInterval={gridInterval} />
        <Grid direction={Direction.Forward} size={size} gridInterval={gridInterval} />
      </group>
    </>
  );
};
