import { Line } from "@react-three/drei";
import OptionsContext from "optionsContext";
import React, { useContext } from "react";
import { Color, Vector3 } from "three";
import { HoveredPoint, ScatterPlotOptions } from "types";

interface PointHoverAxesProps {
  hoveredPoint: HoveredPoint;
}

export const PointHoverAxes: React.FC<PointHoverAxesProps> = ({ hoveredPoint }) => {
  const { position } = hoveredPoint;

  const options: ScatterPlotOptions = useContext(OptionsContext);

  const upPlanePos: Vector3 = new Vector3(position.x, position.y, 0);
  const forwardPlanePos: Vector3 = new Vector3(0, position.y, position.z);
  const rightPlanePos: Vector3 = new Vector3(position.x, 0, position.z);

  const grafYellow = new Color("#FBC55A");
  const grafOrange = new Color("#FB755A");

  return (
    <>
      <Line 
        points={[position, upPlanePos]} 
        color={options.themeColor}
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
        dashed={true} 
        />
      <Line 
        points={[position, forwardPlanePos]} 
        color={options.themeColor} 
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
        dashed={true} />
      <Line 
        points={[position, rightPlanePos]} 
        color={options.themeColor}
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
        dashed={true} />
    </>
  )
}