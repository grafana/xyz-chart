import { Line } from '@react-three/drei';
import { INTERVAL_INDEX_LENGTH, LABEL_DISTANCE_FROM_GRID, LABEL_INTERVAL, SCENE_SCALE, WHITE } from 'consts';
import { ScatterPlotOptions } from 'models.gen';
import OptionsContext from 'optionsContext';
import React, { useContext } from 'react';
import { Euler, Vector3 } from 'three';
import { Direction, GridAxisProps, AxisData } from 'types';
import { Label } from './Label';

export const Axis = (props: GridAxisProps) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  const getAxisData = (): AxisData => {
    let startVec: [number, number, number], endVec: [number, number, number];
    const intervalGeometries = [];
    const intervalLabelPos = [];
    const labelRotation = new Euler();
    const color = options.themeColor ?? WHITE;

    switch (props.direction) {
      case Direction.Up:
        startVec = [SCENE_SCALE, 0, 0];
        endVec = [SCENE_SCALE, SCENE_SCALE, 0];

        for (let i = 0; i < SCENE_SCALE + LABEL_INTERVAL; i = i + LABEL_INTERVAL) {
          intervalGeometries.push([
            [SCENE_SCALE, i, 0],
            [SCENE_SCALE + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10, i, 0],
          ]);

          if (i === 0) {
            intervalLabelPos.push(new Vector3(SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, i + 0.5, -1));
          } else {
            intervalLabelPos.push(new Vector3(SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, i, 0));
          }

          labelRotation.set(0, 0, 0);
        }

        break;
      case Direction.Forward:
        startVec = [SCENE_SCALE, 0, 0];
        endVec = [SCENE_SCALE, 0, SCENE_SCALE];

        for (let i = 0; i < SCENE_SCALE + LABEL_INTERVAL; i = i + LABEL_INTERVAL) {
          intervalGeometries.push([
            [SCENE_SCALE, 0, i],
            [SCENE_SCALE + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10, 0, i],
          ]);

          if (i === 0) {
            intervalLabelPos.push(new Vector3(SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, -0.5, i + 1));
          } else {
            intervalLabelPos.push(new Vector3(SCENE_SCALE + LABEL_DISTANCE_FROM_GRID, 0, i));
          }

          labelRotation.set(-Math.PI / 2, 0, 0);
        }

        break;
      case Direction.Right:
        startVec = [0, 0, SCENE_SCALE];
        endVec = [SCENE_SCALE, 0, SCENE_SCALE];

        for (let i = 0; i < SCENE_SCALE + LABEL_INTERVAL; i = i + LABEL_INTERVAL) {
          intervalGeometries.push([
            [i, 0, SCENE_SCALE],
            [i, 0, SCENE_SCALE + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10],
          ]);
          intervalLabelPos.push(new Vector3(i, 0, SCENE_SCALE + LABEL_DISTANCE_FROM_GRID));
          labelRotation.set(-Math.PI / 2, 0, Math.PI / 2);
        }

        break;
    }

    const axisPoints = [startVec, endVec];

    return { axisPoints, intervalGeometries, intervalLabelPos, labelRotation, color };
  };

  const { axisPoints, intervalGeometries, intervalLabelPos, labelRotation, color } = getAxisData();

  return (
    <group key={'axis_' + props.direction}>
      <Line points={axisPoints} color={color} lineWidth={2.5} dashed={false} />
      {intervalGeometries.map((points, index) => {
        return (
          <group key={index}>
            <Line points={points as [number, number, number][]} color={color} lineWidth={2.5} dashed={false} />
            <Label
              direction={props.direction}
              position={intervalLabelPos[index]}
              text={props.intervalLabels[index]}
              rotation={labelRotation}
            />
          </group>
        );
      })}
    </group>
  );
};
