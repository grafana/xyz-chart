import { DataFrame } from '@grafana/data';
import React, { useContext, useEffect, useState, RefObject, ReactNode, Suspense } from 'react';
import { Direction, HoveredPoint, ScatterPlotOptions } from 'types';
import { getIntervalLabels, prepData } from 'utils';
import { Grid } from './Grid';
import { PointCloud } from './PointCloud';
import OptionsContext from 'optionsContext';
import { LABEL_INT, SCENE_SCALE } from 'consts';

interface Props {
  frames: DataFrame[];
  lights: Array<RefObject<ReactNode>>;
  hoveredPoint: HoveredPoint | null;
  setHoveredPoint: Function;
  canvasRef: RefObject<HTMLCanvasElement>;
  hudRef: any;
}

export const PlotScene: React.FC<Props> = ({ frames, lights, hoveredPoint, setHoveredPoint, canvasRef, hudRef }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  //TODO refactor scene size, label intervals, grids will be fixed like XY Chart
  const size = SCENE_SCALE;
  const gridInterval = LABEL_INT;
  const dataPointColor = options.dataPointColor;

  const [pointData, setPointData] = useState(prepData(frames, size, dataPointColor));
  

  useEffect(() => {
    // const newLabels = getIntervalLabels(frames, size, gridInterval, dateFormat);

    // // setHoveredPoint

    // setIntervalLabels(newLabels);
    setPointData(prepData(frames, size, dataPointColor));
  }, [size, frames, dataPointColor]);


  return (
    <>
      <Suspense fallback={null}>
        <PointCloud
          canvasRef={canvasRef}
          hudRef={hudRef}
          frames={frames}
          points={pointData}
          lights={lights}
          hoveredPoint={hoveredPoint}
          setHoveredPoint={setHoveredPoint}
        />
      </Suspense>
      {/* <group>
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
      </group> */}
    </>
  );
};
