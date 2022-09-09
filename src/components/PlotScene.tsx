import { DataFrame } from '@grafana/data';
import React, { useContext, useEffect, useState, RefObject, ReactNode, Suspense } from 'react';
import { Direction } from 'types';
import { getIntervalLabels, prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import OptionsContext from 'optionsContext';
import { ScatterPlotOptions } from 'models.gen';

interface Props {
  frames: DataFrame[];
  lights: Array<RefObject<ReactNode>>;
}

export const PlotScene: React.FC<Props> = ({ frames, lights }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  const [pointData, setPointData] = useState(prepData(frames, options.pointColor ?? '#ff0000'));
  const [intervalLabels, setIntervalLabels] = useState(getIntervalLabels(frames));

  useEffect(() => {
    const newLabels = getIntervalLabels(frames);

    setIntervalLabels(newLabels);
    setPointData(prepData(frames, options.pointColor ?? '#ff0000'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  return (
    <>
      <Suspense fallback={null}>
        <PointCloud frames={frames} points={pointData} lights={lights} />
      </Suspense>
      <group>
        <Grid direction={Direction.Up} intervalLabels={intervalLabels.yLabels} />
        <Grid direction={Direction.Right} intervalLabels={intervalLabels.xLabels} />
        <Grid direction={Direction.Forward} intervalLabels={intervalLabels.zLabels} />
      </group>
    </>
  );
};
