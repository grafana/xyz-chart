import { Line } from "@react-three/drei";
import { INTERVAL_INDEX_LENGTH, SCENE_SCALE } from "consts";
import React from "react";
import { Euler, Vector3 } from "three";
import { Direction, AxisProps, AxisData } from "types";
import { Label } from "./Label";

export const Axis = (props: AxisProps) => {
  const getAxisData = (): AxisData => {
    let startVec: [number, number, number], endVec: [number, number, number];
    const intervalGeometries = [];
    const intervalLabelPos = [];
    const intervalLabelText = [];
    const labelRotation = new Euler;
      
    switch (props.direction) {
      case Direction.Up:
        startVec = [props.size, 0, 0];
        endVec = [props.size, props.size, 0];

        for (let i = 0; i < props.size; i = i + props.gridInterval) {
          intervalGeometries.push([[props.size, i, 0], [props.size + (INTERVAL_INDEX_LENGTH * SCENE_SCALE / 10), i, 0]]);
          intervalLabelPos.push(new Vector3(props.size + (SCENE_SCALE / 10), i, 0));
          intervalLabelText.push("TEST");
        }

        break;
      case Direction.Right:
        startVec = [0, 0, props.size];
        endVec = [props.size, 0, props.size];

        for (let i = props.gridInterval; i < props.size + props.gridInterval; i = i + props.gridInterval) {
          intervalGeometries.push([[props.size, 0, i], [props.size + (INTERVAL_INDEX_LENGTH * SCENE_SCALE / 10), 0, i]]);
          intervalLabelPos.push(new Vector3(props.size + (SCENE_SCALE / 10), 0, i));
          intervalLabelText.push("TEST");
          labelRotation.set(-Math.PI/2, 0, 0);
        }

        break;
      case Direction.Forward:
        startVec = [props.size, 0, 0];
        endVec = [props.size, 0, props.size];

        for (let i = 0; i < props.size; i = i + props.gridInterval) {
          intervalGeometries.push([[i, 0, props.size], [i, 0, props.size + (INTERVAL_INDEX_LENGTH * SCENE_SCALE / 10)]]);
          intervalLabelPos.push(new Vector3(i, 0, props.size + (SCENE_SCALE / 10)));
          intervalLabelText.push("TEST");
          labelRotation.set(-Math.PI/2, 0, Math.PI/2);
        }

        break;
    }
  
    const axisPoints = [startVec, endVec];

    return { axisPoints, intervalGeometries, intervalLabelPos, intervalLabelText, labelRotation };
  }

  const { axisPoints, intervalGeometries, intervalLabelPos, intervalLabelText, labelRotation } = getAxisData();
  const color = props.color ?? 'white';

  return (
    <group key={"axis_" + props.direction}>
      <Line
        points={axisPoints}
        color={color}
        lineWidth={2.5}
        dashed={false}
      />
      {
        intervalGeometries.map((points, index) => {
          return (
            <group key={index}>
              <Line
                points={points as [number, number, number][]}
                color={color}
                lineWidth={2.5}
                dashed={false}
              />
              <Label 
                position={intervalLabelPos[index]} 
                text={intervalLabelText[index]} 
                rotation={labelRotation}
              />
            </group>
          );
        })
      }
    </group>
  );
}