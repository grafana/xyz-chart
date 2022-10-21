import { DataFrame } from '@grafana/data';
import React, { useContext, useEffect, useState } from 'react';
import { Direction, ScatterPlotOptions } from 'types';
import { getIntervalLabels } from 'utils';
import { Grid } from './Grid';
import OptionsContext from 'optionsContext';
import { LABEL_INT, SCENE_SCALE } from 'consts';

interface Props {
  frames: DataFrame[];
}

export const GridCube: React.FC<Props> = ({ frames }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  //TODO refactor scene size, label intervals, grids will be fixed like XY Chart
  const size = SCENE_SCALE;
  const gridInterval = LABEL_INT;
  const dateFormat = options.labelDateFormat;

  
  const [intervalLabels, setIntervalLabels] = useState(
    getIntervalLabels(frames, size, gridInterval, options.labelDateFormat)
  );

  useEffect(() => {
    const newLabels = getIntervalLabels(frames, size, gridInterval, dateFormat);

    setIntervalLabels(newLabels);
  }, [size, gridInterval, frames]);

  useEffect(() => {
    setIntervalLabels(getIntervalLabels(frames, size, gridInterval, dateFormat));
  }, [dateFormat]);

  return (
    <>
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
    </>
  );
};
