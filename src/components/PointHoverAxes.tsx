import { useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import OptionsContext from "optionsContext";
import React, { useContext, RefObject, ReactNode } from "react";
import { Color, Vector3 } from "three";
import { HoveredPoint, ScatterPlotOptions } from "types";
// import { SCENE_SCALE } from "consts";

interface PointHoverAxesProps {
  hoveredPoint: HoveredPoint;
  hudRef: RefObject<ReactNode>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export const PointHoverAxes: React.FC<PointHoverAxesProps> = ({ hoveredPoint, hudRef, canvasRef }) => {
  const { camera } = useThree();
  const { position } = hoveredPoint;
  const { current: hudEl } = hudRef;
  const { current: canvasEl } = canvasRef;

  const options: ScatterPlotOptions = useContext(OptionsContext);

  const upPlanePos: Vector3 = new Vector3(position.x, position.y, 0);
  const forwardPlanePos: Vector3 = new Vector3(0, position.y, position.z);
  const rightPlanePos: Vector3 = new Vector3(position.x, 0, position.z);

  const grafYellow = new Color("#FBC55A");
  const grafOrange = new Color("#FB755A");

  // Retrieve position of the bounding box
  // of the HUD element
  // @ts-ignore - 
  const rect = hudEl.getBoundingClientRect();
  // @ts-ignore
  const canvasRect = canvasEl.getBoundingClientRect();

  // Convert canvas coordinates in 3D coords
  let canvasPos = new Vector3(
    ((rect.x - canvasRect.x) / canvasRect.width),
    -(((rect.y - canvasRect.y) / canvasRect.height)),
    -1
  );
  canvasPos.unproject(camera);

  return (
    <>
      <Line 
        points={[position, canvasPos]}
        color={options.themeColor}
        // @ts-ignore
        vertexColors={[grafYellow, grafOrange]}
      />
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