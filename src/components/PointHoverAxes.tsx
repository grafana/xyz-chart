import { Line } from '@react-three/drei';
import OptionsContext from 'optionsContext';
import React, { useContext } from 'react';
import { Vector3 } from 'three';
import { XYZChartOptions } from 'models.gen';

interface PointHoverAxesProps {
  pointVector: Vector3;
}

export const PointHoverAxes = (props: PointHoverAxesProps) => {
  const { pointVector } = props;

  const options: XYZChartOptions = useContext(OptionsContext);

  const upPlanePos: Vector3 = new Vector3(pointVector.x, pointVector.y, 0);
  const forwardPlanePos: Vector3 = new Vector3(0, pointVector.y, pointVector.z);
  const rightPlanePos: Vector3 = new Vector3(pointVector.x, 0, pointVector.z);

  return (
    <>
      <Line points={[pointVector, upPlanePos]} color={options.themeColor} dashed={true} />
      <Line points={[pointVector, forwardPlanePos]} color={options.themeColor} dashed={true} />
      <Line points={[pointVector, rightPlanePos]} color={options.themeColor} dashed={true} />
    </>
  );
};
