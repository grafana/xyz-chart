/**
 * @file
 * Wraps R3F <points> element and supplies
 * sane default for materials, geometries, etc.
 */

import { hexToRgb } from '../utils';
import OptionsContext from 'optionsContext';
import React, { useRef, useContext, useEffect } from 'react';
import { PointData, RGBColor } from 'types';
import { BufferAttribute } from 'three';

interface Props {
  points: PointData;
  onPointerOver?: Function;
  onPointerOut?: Function;
}

export const PointCloud: React.FC<Props> = ({ points }) => {
  const colorRef = useRef({} as BufferAttribute);
  const dataPointColor: string = useContext(OptionsContext).dataPointColor;

  useEffect(() => {
    if (colorRef.current) {
      const color: RGBColor = hexToRgb(dataPointColor);
      for (let i = 0; i< colorRef.current.array.length; i++) {
        colorRef.current.setXYZ(i, color.r, color.g, color.b);
        colorRef.current.needsUpdate = true;
      }
    }
  }, [dataPointColor]);

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={points.points.length / 3}
          array={points.points}
          itemSize={3}
        />
        <bufferAttribute
          ref={colorRef}
          attachObject={['attributes', 'color']}
          count={points.colors.length / 3}
          array={points.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" vertexColors size={0.9} sizeAttenuation={true}/>
    </points>
  );
};
