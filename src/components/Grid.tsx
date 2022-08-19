import { LABEL_INTERVAL, SCENE_SCALE } from 'consts';
import React, { useRef } from 'react';
import { BufferGeometry, Vector3 } from 'three';
import { Direction, GridAxisProps } from 'types';
import { createLineGeometry } from 'utils';
import { Axis } from './Axis';

/* 
  Refactor and use <Line/> from drei package. Check Axis.tsx for example
  Three.line does not support line width in WebGL, but drei's implementation does.
  So I used a thicker line for axis and left the grid with the old implementation.
*/
export const Grid = (props: GridAxisProps) => {
  const ref = useRef<any>(null);

  const createGeometry = () => {
    let lineGeometries: BufferGeometry[] = [];

    for (let i = 0; i < SCENE_SCALE; i = i + LABEL_INTERVAL) {
      switch (props.direction) {
        case Direction.Up:
          lineGeometries.push(createLineGeometry(new Vector3(i, 0, 0), new Vector3(i, SCENE_SCALE, 0)));
          lineGeometries.push(createLineGeometry(new Vector3(0, i, 0), new Vector3(SCENE_SCALE, i, 0)));
          break;
        case Direction.Right:
          lineGeometries.push(createLineGeometry(new Vector3(0, 0, i), new Vector3(SCENE_SCALE, 0, i)));
          lineGeometries.push(createLineGeometry(new Vector3(i, 0, 0), new Vector3(i, 0, SCENE_SCALE)));
          break;
        case Direction.Forward:
          lineGeometries.push(createLineGeometry(new Vector3(0, i, 0), new Vector3(0, i, SCENE_SCALE)));
          lineGeometries.push(createLineGeometry(new Vector3(0, 0, i), new Vector3(0, SCENE_SCALE, i)));
          break;
      }
    }

    return lineGeometries;
  };

  const geometry = createGeometry();
  const color = "#808080";

  return (
    <>
      <group>
        {geometry.map((lineGeo, index) => {
          return (
            <line_ ref={ref} geometry={lineGeo} key={index}>
              <lineBasicMaterial attach="material" color={color} />
            </line_>
          );
        })}
        <Axis
          direction={props.direction}
          intervalLabels={props.intervalLabels}
        />
      </group>
    </>
  );
};
