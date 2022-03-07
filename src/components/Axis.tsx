import React, { useRef } from "react";
import { Vector3 } from "three";
import { Direction, AxisProps } from "types";
import { createLineGeometry } from "utils";

export const Axis = (props: AxisProps) => {
  const ref = useRef<any>(null);
  let startVec, endVec;

  switch (props.direction) {
    case Direction.Up:
      startVec = new Vector3(props.size, 0, 0);
      endVec = new Vector3(props.size, props.size, 0);
      break;
    case Direction.Right:
      startVec = new Vector3(0, 0, props.size);
      endVec = new Vector3(props.size, 0, props.size);
      break;
    case Direction.Forward:
      startVec = new Vector3(props.size, 0, 0);
      endVec = new Vector3(props.size, 0, props.size);
      break;
  }

  const lineGeometry = createLineGeometry(startVec, endVec);
  const color = props.color ?? 'white';

  return (
    <>
      <group>
        <line_ ref={ref} geometry={lineGeometry}>
          <lineBasicMaterial attach="material" color={color}/>
        </line_>
      </group>
    </>
  );
};