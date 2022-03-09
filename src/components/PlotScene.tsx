import { DataFrame } from '@grafana/data';
import React from 'react';
import { Direction } from 'types';
import { getIntervalLabels, prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import { LABEL_INTERVAL, SCENE_SCALE } from 'consts';
import { config } from '@grafana/runtime';

interface Props {
  frames: DataFrame[];
}

export const PlotScene: React.FC<Props> = ({ frames }) => {
  const size = SCENE_SCALE;
  const gridInterval = LABEL_INTERVAL;
  const pointData = prepData(frames);
  const intervalLabels = getIntervalLabels(frames);
  const color = config.theme2.isDark ? '#ffffff' : '#000000';

  return (
    <>
      <PointCloud points={pointData} />
      <group>
        <Grid direction={Direction.Up} size={size} color={color} gridInterval={gridInterval} intervalLabels={intervalLabels.yLabels}/>
        <Grid direction={Direction.Right} size={size} color={color} gridInterval={gridInterval} intervalLabels={intervalLabels.xLabels}/>
        <Grid direction={Direction.Forward} size={size} color={color} gridInterval={gridInterval} intervalLabels={intervalLabels.zLabels}/>
      </group>
    </>
  );
};
