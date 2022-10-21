import { Line } from '@react-three/drei';
import { INTERVAL_INDEX_LENGTH, LABEL_DISTANCE_FROM_GRID, WHITE } from 'consts';
import OptionsContext from 'optionsContext';
import React, { useContext, useMemo } from 'react';
import { Euler } from 'three';
import { Direction, AxisProps, AxisData, ScatterPlotOptions } from 'types';
import { convertTextColorToHex } from 'utils';
import { Label } from './Label';

export const Axis = ({ direction, size, gridInterval, intervalLabels}: AxisProps) => {
 
 
  const getAxisData = (direction: Direction, size: number, gridInterval: number): AxisData => {
    let startVec: [number, number, number], endVec: [number, number, number], color: string;
    const intervalGeometries = [];
    const intervalLabelPos: Array<[number, number, number]> = [];
    const labelRotation = new Euler();
    const options: ScatterPlotOptions = useContext(OptionsContext);

    // Set start and end vectors
    switch (direction) {
      case Direction.Up:
        startVec = [size, 0, 0];
        endVec = [size, size, 0];
        break;
      case Direction.Forward:
        startVec = [size, 0, 0];
        endVec = [size, 0, size];
        break;
      case Direction.Right:
        startVec = [0, 0, size];
        endVec = [size, 0, size];
        break;
    }


    switch (direction) {
      case Direction.Up:
        for (let i = 0; i < size + gridInterval; i = i + gridInterval) {
          intervalGeometries.push([
            [size, i, 0],
            [size + (INTERVAL_INDEX_LENGTH * options.sceneScale) / 10, i, 0],
          ]);

          if (i === 0) {
            intervalLabelPos.push([size + LABEL_DISTANCE_FROM_GRID, i + 0.5, -1]);
          } else {
            intervalLabelPos.push([size + LABEL_DISTANCE_FROM_GRID, i, 0]);
          }

          labelRotation.set(0, 0, 0);
        }

        color = options.showColorSettings ? convertTextColorToHex(options.yAxisColor) : options.themeColor ?? WHITE;

        break;
      case Direction.Forward:
        

        for (let i = 0; i < size + gridInterval; i = i + gridInterval) {
          intervalGeometries.push([
            [size, 0, i],
            [size + (INTERVAL_INDEX_LENGTH * options.sceneScale) / 10, 0, i],
          ]);

          if (i === 0) {
            intervalLabelPos.push([size + LABEL_DISTANCE_FROM_GRID, -0.5, i + 1]);
          } else {
            intervalLabelPos.push([size + LABEL_DISTANCE_FROM_GRID, 0, i]);
          }

          labelRotation.set(-Math.PI / 2, 0, 0);
        }

        color = options.showColorSettings ? convertTextColorToHex(options.zAxisColor) : options.themeColor ?? WHITE;

        break;
      case Direction.Right:
        for (let i = 0; i < size + gridInterval; i = i + gridInterval) {
          intervalGeometries.push([
            [i, 0, size],
            [i, 0, size + (INTERVAL_INDEX_LENGTH * options.sceneScale) / 10],
          ]);
          intervalLabelPos.push([i, 0, size + LABEL_DISTANCE_FROM_GRID]);
          labelRotation.set(-Math.PI / 2, 0, Math.PI / 2);
        }

        color = options.showColorSettings ? convertTextColorToHex(options.xAxisColor) : options.themeColor ?? WHITE;

        break;
    }

    const axisPoints = [startVec, endVec];



    return { axisPoints, intervalGeometries, intervalLabelPos, labelRotation, color };
  };

  const { axisPoints, intervalGeometries, intervalLabelPos, labelRotation, color } = useMemo(
    () => getAxisData(direction, size, gridInterval), 
    [direction, size, gridInterval]
  );

  return (
    <group key={'axis_' + direction}>
      <Line points={axisPoints} color={color} lineWidth={2.5} dashed={false} />
      {intervalGeometries.map((points, index) => {
        return (
          <group key={index}>
            <Line points={points as Array<[number, number, number]>} color={color} lineWidth={2.5} dashed={false} />
            <Label
              direction={direction}
              //@ts-ignore
              position={intervalLabelPos[index]}
              text={intervalLabels[index]}
              rotation={labelRotation}
            />
          </group>
        );
      })}
    </group>
  );
};
