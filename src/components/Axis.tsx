import React, { useRef } from "react";
import { Vector3 } from "three";
import { Direction, AxisProps, AxisData } from "types";
import { createLineGeometry } from "utils";
import { Label } from "./Label";

export const Axis = (props: AxisProps) => {
  const ref = useRef<any>(null);

  const getAxisData = (): AxisData => {
    let startVec, endVec;
    const intervalGeometries = [];
    const intervalLabelPos = [];
    const intervalLabelText = [];
    let intervalStartVec, intervalEndVec;
      
    switch (props.direction) {
      case Direction.Up:
        startVec = new Vector3(props.size, 0, 0);
        endVec = new Vector3(props.size, props.size, 0);

        intervalStartVec = new Vector3(props.size, 0, 0);
        intervalEndVec = new Vector3(props.size + 0.2, 0, 0);

        for (let i = 0; i < props.size; i = i + props.gridInterval) {
          intervalStartVec.y = i;
          intervalEndVec.y = i;

          intervalGeometries.push(createLineGeometry(intervalStartVec, intervalEndVec));
          intervalLabelPos.push(new Vector3(intervalEndVec.x + 0.3, intervalEndVec.y, intervalEndVec.z));
          intervalLabelText.push("TEST");
        }

        break;
      case Direction.Right:
        startVec = new Vector3(0, 0, props.size);
        endVec = new Vector3(props.size, 0, props.size);

        intervalStartVec = new Vector3(0, 0, props.size);
        intervalEndVec = new Vector3(props.size, 0, props.size + 0.2);

        for (let i = 0; i < props.size; i = i + props.gridInterval) {
          intervalStartVec.x = i;
          intervalEndVec.x = i;

          intervalGeometries.push(createLineGeometry(intervalStartVec, intervalEndVec));
          intervalLabelPos.push(new Vector3(intervalEndVec.x + 0.3, intervalEndVec.y, intervalEndVec.z));
          intervalLabelText.push("TEST");
        }
        break;
      case Direction.Forward:
        startVec = new Vector3(props.size, 0, 0);
        endVec = new Vector3(props.size, 0, props.size);
        break;
    }
  
    const axisGeometry = createLineGeometry(startVec, endVec);

    return { axisGeometry, intervalGeometries, intervalLabelPos, intervalLabelText } as AxisData;
  }

  const { axisGeometry, intervalGeometries, intervalLabelPos, intervalLabelText } = getAxisData();
  const color = props.color ?? 'white';

  return (
    <group key={"axis_" + props.direction}>
      <line_ ref={ref} geometry={axisGeometry}>
        <lineBasicMaterial attach="material" color={color}/>
      </line_>
      {
        intervalGeometries.map((geometry, index) => {
          return (
            <group key={index}>
              <line_ ref={ref} geometry={geometry}>
                <lineBasicMaterial attach="material" color={color} />
              </line_><Label position={intervalLabelPos[index]} text={intervalLabelText[index]} />
            </group>
          );
        })
      }
    </group>
  );
}