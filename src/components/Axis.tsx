import { Line } from '@react-three/drei';
import { INTERVAL_INDEX_LENGTH, LABEL_DISTANCE_FROM_GRID, LABEL_INTERVAL, SCENE_SCALE, WHITE } from 'consts';
import { ScatterPlotOptions } from 'models.gen';
import OptionsContext from 'optionsContext';
import React, { useContext, useMemo } from 'react';
import { Euler } from '@react-three/fiber';
import { Direction, GridPlaneProps, AxisData, PointGeometry, LineGeometry } from 'types';
import { Label } from './Label';

export const Axis: React.FC<GridPlaneProps> = ({ direction, intervalLabels }) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  const getAxisData = (direction: Direction): AxisData => {
    let startVec: PointGeometry, endVec: PointGeometry;
    let labelRotation: Euler = [0, 0, 0];
    const intervalGeometries: Array<LineGeometry> = [];
    const intervalLabelPos: Array<PointGeometry> = [];
    const color = options.themeColor ?? WHITE;

    // Set start and end vectors
    switch (direction) {
      case Direction.Up:
        startVec = [SCENE_SCALE, 0, 0];
        endVec = [SCENE_SCALE, SCENE_SCALE, 0];
        break;
      case Direction.Forward:
        startVec = [SCENE_SCALE, 0, 0];
        endVec = [SCENE_SCALE, 0, SCENE_SCALE];
        break;
      case Direction.Right:
        startVec = [0, 0, SCENE_SCALE];
        endVec = [SCENE_SCALE, 0, SCENE_SCALE];
        break;
    }

    for (let i = 0; i < SCENE_SCALE + LABEL_INTERVAL; i = i + LABEL_INTERVAL) {
      switch (direction) {
        case Direction.Up:
          intervalGeometries.push([
            [SCENE_SCALE, i, 0],
            [SCENE_SCALE + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10, i, 0],
          ]);

          if (i === 0) {
            intervalLabelPos.push([SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, i + 0.5, -1]);
          } else {
            intervalLabelPos.push([SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, i, 0]);
          }

          // Don't need to rotate the label in this case
          break;
        case Direction.Forward:
          intervalGeometries.push([
            [SCENE_SCALE, 0, i],
            [SCENE_SCALE + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10, 0, i],
          ]);

          if (i === 0) {
            intervalLabelPos.push([SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, -0.5, i + 1]);
          } else {
            intervalLabelPos.push([SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, 0, i]);
          }

          labelRotation = [-Math.PI / 2, 0, 0];
          break;
        case Direction.Right:
          intervalGeometries.push([
            [i, 0, SCENE_SCALE],
            [i, 0, SCENE_SCALE + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10],
          ]);
          intervalLabelPos.push([i, 0, SCENE_SCALE + LABEL_DISTANCE_FROM_GRID]);
          labelRotation = [-Math.PI / 2, 0, Math.PI / 2];
          break;
      }        
    }

    const axisPoints = [startVec, endVec];

    return { axisPoints, intervalGeometries, intervalLabelPos, labelRotation, color };
  };

  const { 
    axisPoints, 
    intervalGeometries, 
    intervalLabelPos, 
    labelRotation, 
    color 
  } = useMemo(() => getAxisData(direction), [direction]);

  return (
    <group key={'axis_' + direction}>
      <Line points={axisPoints} color={color} lineWidth={2.5} dashed={false} />
      {intervalGeometries.map((points, index) => {
        return (
          <group key={index}>
            <Line points={points as Array<[number, number, number]>} color={color} lineWidth={2.5} dashed={false} />
            <Label
              direction={ direction }
              position={ intervalLabelPos[index] }
              text={ intervalLabels[index] }
              rotation={ labelRotation }
            />
          </group>
        );
      })}
    </group>
  );
};
