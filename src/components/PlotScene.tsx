import { DataFrame } from '@grafana/data';
import React from 'react';
import { Direction } from 'types';
import { prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';

interface Props {
  frames: DataFrame[];
}

export const PlotScene : React.FC<Props> = ({ frames }) => {
  // const theme = useTheme();
  // const styles = getStyles();

  const size = 10;
  const gridInterval = 1;
  const pointData = prepData(frames);

  return (
    <group>
      <Grid direction={Direction.Up} size={size} gridInterval={gridInterval} />
      <Grid direction={Direction.Right} size={size} gridInterval={gridInterval} />
      <Grid direction={Direction.Forward} size={size} gridInterval={gridInterval} />
      <PointCloud points={ pointData } />
    </group>
  );
};
