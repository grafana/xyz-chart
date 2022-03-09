/**
 * @file
 * Wraps R3F <points> element and supplies
 * sane default for materials, geometries, etc.
 */

import { hexToRgb } from '../utils';
import OptionsContext from 'optionsContext';
import React, { useRef, useContext, useEffect, useState } from 'react';
import { PointData, RGBColor } from 'types';
import { PointsMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';

interface Props {
  currentPoints: PointData;
  oldPoints: PointData;
  onPointerOver?: Function;
  onPointerOut?: Function;
}

export const PointCloud: React.FC<Props> = ({ currentPoints, oldPoints }) => {
  const colorAttrRef: any = useRef(null);
  const materialRef = useRef({} as PointsMaterial);
  const dataPointColor: string = useContext(OptionsContext).dataPointColor;
  const [points, setPoints] = useState(null as any);
  let showPoints = true;

  useEffect(() => {
    if (colorAttrRef.current) {
      const color: RGBColor = hexToRgb(dataPointColor);
      for (let i = 0; i < colorAttrRef.current.array.length; i++) {
        colorAttrRef.current.setXYZ(i, color.r, color.g, color.b);
        colorAttrRef.current.needsUpdate = true;
      }
    }
  }, [dataPointColor]);

  /*
    I assume there's a better way to do this (one that doesn't double the datapoints set)
  but I couldn't find it and went with this solution to fade out old data and fade in the new
  */
  useEffect(() => {
    if (oldPoints) {
      setPoints(oldPoints);
    }

    showPoints = false;

    setTimeout(() => {
      setPoints(currentPoints);
      showPoints = true;
    }, 500);
  }, [currentPoints]);

  useFrame(
    (state, delta) => (materialRef.current.opacity = lerp(materialRef.current.opacity, showPoints ? 1 : 0, 0.1))
  );

  return (
    <>
    {points && <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={points.points.length / 3}
          array={points.points}
          itemSize={3}
        />
        <bufferAttribute
          ref={colorAttrRef}
          attachObject={['attributes', 'color']}
          count={points.colors.length / 3}
          array={points.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        attach="material"
        opacity={0}
        transparent
        vertexColors
        size={0.9}
        sizeAttenuation={true}
      />
    </points>}
    </>
  );
};
