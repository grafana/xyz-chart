import React from 'react';
import { Direction } from 'types';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';

export const PlotScene = () => {
  // const theme = useTheme();
  // const styles = getStyles();

  const size = 10;
  const gridInterval = 1;

  return (
    <group>
      <Grid direction={Direction.Up} size={size} gridInterval={gridInterval} />
      <Grid direction={Direction.Right} size={size} gridInterval={gridInterval} />
      <Grid direction={Direction.Forward} size={size} gridInterval={gridInterval} />
      <PointCloud points={[]} />
    </group>
  );
};
