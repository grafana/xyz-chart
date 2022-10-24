import { AXIS_COLOR, LABEL_INTERVAL, SCENE_SCALE } from 'consts';
import React, { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { Direction, GridAxisProps, LineGeometry } from 'types';
import { Axis } from './Axis';

/* 
  Refactor and use <Line/> from drei package. Check Axis.tsx for example
  Three.line does not support line width in WebGL, but drei's implementation does.
  So I used a thicker line for axis and left the grid with the old implementation.
*/
export const Grid = (props: GridAxisProps) => {
  const ref = useRef<any>(null);


  const createGeometry = (): Array<LineGeometry> => {
    let lineGeometries: Array<LineGeometry> = [];

    for (let i = 0; i < SCENE_SCALE; i = i + LABEL_INTERVAL) {
      switch (props.direction) {
        case Direction.Up:
          lineGeometries.push([[i, 0, 0], [i, SCENE_SCALE, 0]]);
          lineGeometries.push([[0, i, 0], [SCENE_SCALE, i, 0]]);
          break;
        case Direction.Right:
          lineGeometries.push([[0, 0, i], [SCENE_SCALE, 0, i]]);
          lineGeometries.push([[i, 0, 0], [i, 0, SCENE_SCALE]]);
          break;
        case Direction.Forward:
          lineGeometries.push([[0, i, 0], [0, i, SCENE_SCALE]]);
          lineGeometries.push([[0, 0, i], [0, SCENE_SCALE, i]]);
          break;
      }
    }

    return lineGeometries;
  };
  const lines = useMemo(() => createGeometry(), []);

  return (
    <group>
      {lines.map((lineGeo, index) => {
        return (
          <Line
            ref={ ref }
            points={ lineGeo }
            color={ AXIS_COLOR }
            key={ index }
            lineWidth={ 2 }
          />
        );
      })}
      <Axis direction={props.direction} intervalLabels={props.intervalLabels} />
    </group>
  );
};
