import { Line } from '@react-three/drei';
import { INTERVAL_INDEX_LENGTH, LABEL_DISTANCE_FROM_GRID, SCENE_SCALE, WHITE } from 'consts';
import React from 'react';
import { Euler, Vector3 } from 'three';
import { Direction, AxisProps, AxisData } from 'types';
import { Label } from './Label';

export const Axis = (props: AxisProps) => {
  const getAxisData = (): AxisData => {
    let startVec: [number, number, number], endVec: [number, number, number];
    const intervalGeometries = [];
    const intervalLabelPos = [];
    const labelRotation = new Euler();

    switch (props.direction) {
      case Direction.Up:
        startVec = [props.size, 0, 0];
        endVec = [props.size, props.size, 0];

        for (let i = 0; i < props.size; i = i + props.gridInterval) {
          intervalGeometries.push([
            [props.size, i, 0],
            [props.size + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10, i, 0],
          ]);
          intervalLabelPos.push(new Vector3(props.size + LABEL_DISTANCE_FROM_GRID, i, 0));
        }

        break;
      case Direction.Forward:
        startVec = [0, 0, props.size];
        endVec = [props.size, 0, props.size];

        for (let i = props.gridInterval; i < props.size; i = i + props.gridInterval) {
          intervalGeometries.push([
            [props.size, 0, i],
            [props.size + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10, 0, i],
          ]);
          intervalLabelPos.push(new Vector3(props.size + LABEL_DISTANCE_FROM_GRID, 0, i));
          labelRotation.set(-Math.PI / 2, 0, 0);
        }

        break;
      case Direction.Right:
        startVec = [props.size, 0, 0];
        endVec = [props.size, 0, props.size];

        for (let i = 0; i < props.size; i = i + props.gridInterval) {
          intervalGeometries.push([
            [i, 0, props.size],
            [i, 0, props.size + (INTERVAL_INDEX_LENGTH * SCENE_SCALE) / 10],
          ]);
          intervalLabelPos.push(new Vector3(i, 0, props.size + LABEL_DISTANCE_FROM_GRID));
          labelRotation.set(-Math.PI / 2, 0, Math.PI / 2);
        }

        break;
    }

    const axisPoints = [startVec, endVec];

    return { axisPoints, intervalGeometries, intervalLabelPos, labelRotation };
  };

  const { axisPoints, intervalGeometries, intervalLabelPos, labelRotation } = getAxisData();
  const color = props.color ?? WHITE;

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
              color={color}
            />
          </group>
        );
      })}
    </group>
  );
};
