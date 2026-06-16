import { AXIS_COLOR, LABEL_INTERVAL, SCENE_SCALE } from 'consts';
import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Direction, GridPlaneProps, LineGeometry } from 'types';
import { Axis } from './Axis';

export const GridPlane: React.FC<GridPlaneProps> = ({ direction, intervalLabels }) => {
  const createGeometry = (direction: Direction): LineGeometry[] => {
    let lineGeometries: LineGeometry[] = [];

    for (let i = 0; i < SCENE_SCALE; i = i + LABEL_INTERVAL) {
      switch (direction) {
        case Direction.Up:
          lineGeometries.push([
            [i, 0, 0],
            [i, SCENE_SCALE, 0],
          ]);
          lineGeometries.push([
            [0, i, 0],
            [SCENE_SCALE, i, 0],
          ]);
          break;
        case Direction.Right:
          lineGeometries.push([
            [0, 0, i],
            [SCENE_SCALE, 0, i],
          ]);
          lineGeometries.push([
            [i, 0, 0],
            [i, 0, SCENE_SCALE],
          ]);
          break;
        case Direction.Forward:
          lineGeometries.push([
            [0, i, 0],
            [0, i, SCENE_SCALE],
          ]);
          lineGeometries.push([
            [0, 0, i],
            [0, SCENE_SCALE, i],
          ]);
          break;
      }
    }

    return lineGeometries;
  };
  const lines = useMemo(() => createGeometry(direction), [direction]);

  return (
    <group>
      {lines.map((lineGeo, index) => {
        return <Line points={lineGeo} color={AXIS_COLOR} key={index} lineWidth={0.5} />;
      })}
      <Axis direction={direction} intervalLabels={intervalLabels} />
    </group>
  );
};
