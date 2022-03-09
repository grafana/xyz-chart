import { WHITE } from 'consts';
import React, { useRef } from 'react';
import { BufferGeometry, Vector3 } from 'three';
import { Direction, GridProps } from 'types';
import { createLineGeometry } from 'utils';
import { Axis } from './Axis';

/* 
  Refactor and use <Line/> from drei package. Check Axis.tsx for example
  Three.line does not support line width in WebGL, but drei's implementation does.
  So I used a thicker line for axis and left the grid with the old implementation.
*/
export const Grid = (props: GridProps) => {
  const ref = useRef<any>(null);

  const createGeometry = () => {
    let lineGeometries: BufferGeometry[] = [];

    for (let i = 0; i < props.size; i = i + props.gridInterval) {
      switch (props.direction) {
        case Direction.Up:
          lineGeometries.push(createLineGeometry(new Vector3(i, 0, 0), new Vector3(i, props.size, 0)));
          lineGeometries.push(createLineGeometry(new Vector3(0, i, 0), new Vector3(props.size, i, 0)));
          break;
        case Direction.Right:
          lineGeometries.push(createLineGeometry(new Vector3(0, 0, i), new Vector3(props.size, 0, i)));
          lineGeometries.push(createLineGeometry(new Vector3(i, 0, 0), new Vector3(i, 0, props.size)));
          break;
        case Direction.Forward:
          lineGeometries.push(createLineGeometry(new Vector3(0, i, 0), new Vector3(0, i, props.size)));
          lineGeometries.push(createLineGeometry(new Vector3(0, 0, i), new Vector3(0, props.size, i)));
          break;
      }
    }

    return lineGeometries;
  };

  const geometry = createGeometry();
  const color = props.color ?? WHITE;

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
          size={props.size}
          gridInterval={props.gridInterval}
          intervalLabels={props.intervalLabels}
          color={color}
        />
      </group>
    </>
  );
};
