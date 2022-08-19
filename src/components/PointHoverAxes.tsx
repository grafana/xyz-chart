import { Line } from "@react-three/drei";
import OptionsContext from "optionsContext";
import React, { useContext } from "react";
import { Color, Vector3 } from "three";
import { ScatterPlotOptions } from "types";

interface PointHoverAxesProps {
  pointVector: Vector3;
}

export const PointHoverAxes = (props: PointHoverAxesProps) => {
  const { pointVector } = props;

  const options: ScatterPlotOptions = useContext(OptionsContext);

  const upPlanePos: Vector3 = new Vector3(pointVector.x, pointVector.y, 0);
  const forwardPlanePos: Vector3 = new Vector3(0, pointVector.y, pointVector.z);
  const rightPlanePos: Vector3 = new Vector3(pointVector.x, 0, pointVector.z);

  const grafYellow = new Color("#FBC55A");
  const grafOrange = new Color("#FB755A");

  return (
    <>
      <Line 
        points={[pointVector, upPlanePos]} 
        color={options.themeColor}
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
        dashed={true} 
        />
      <Line 
        points={[pointVector, forwardPlanePos]} 
        color={options.themeColor} 
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
        dashed={true} />
      <Line 
        points={[pointVector, rightPlanePos]} 
        color={options.themeColor}
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
        dashed={true} />
    </>
  )
}