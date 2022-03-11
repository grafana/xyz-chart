/**
 * @file
 * Wraps R3F <points> element and supplies
 * sane default for materials, geometries, etc.
 */

import { hexToRgb } from '../utils';
import OptionsContext from 'optionsContext';
import React, { 
  useRef, 
  useContext, 
  useEffect, 
  useCallback,
  useState, 
  RefObject, 
  ReactNode 
} from 'react';
import { PointData, RGBColor } from 'types';
import { PointsMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { lerp } from 'three/src/math/MathUtils';
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing';

interface Props {
  currentPoints: PointData;
  lights: RefObject<ReactNode>[];
  onPointerOver?: Function;
  onPointerOut?: Function;
}

export const PointCloud: React.FC<Props> = ({ currentPoints, lights, onPointerOut, onPointerOver }) => {
  const colorAttrRef: any = useRef(null);
  const pointsRef = useRef(null);
  const posRef: any = useRef(null);
  const materialRef = useRef({} as PointsMaterial);
  const options: any = useContext(OptionsContext);
  const [points, setPoints] = useState(null as any);
  const circleTexture = useTexture('/public/plugins/grafana-labs-grafana-3-d-scatter-panel/img/circle.png');
  let showPoints = true;

  useEffect(() => {
    if (colorAttrRef.current) {
      const color: RGBColor = hexToRgb(options.dataPointColor);
      for (let i = 0; i < colorAttrRef.current.array.length; i++) {
        colorAttrRef.current.setXYZ(i, color.r, color.g, color.b);
        colorAttrRef.current.needsUpdate = true;
      }
    }
  }, [options.dataPointColor]);

  useEffect(() => {
      if (materialRef.current) {
        materialRef.current.size = options.particleSize
        materialRef.current.needsUpdate = true;
      }
  }, [options.particleSize])

  useEffect(() => {
    showPoints = false;

    setTimeout(() => {
      setPoints(currentPoints);
      if (posRef.current) {
        for (let i = 0; i < currentPoints.points.length; i+=3) {
          posRef.current.setXYZ(i, currentPoints.points[i], currentPoints.points[i+1], currentPoints.points[i+2]);
          posRef.current.needsUpdate = true;
        }
      }
      showPoints = true;
    }, 500);
  }, [currentPoints]);

  useFrame(
    (state, delta) => (materialRef.current.opacity = lerp(materialRef.current.opacity, showPoints ? 1 : 0, 0.1))
  );

  let bloom = null;
  if (pointsRef.current !== null && lights[0].current !== null) {
    bloom = (
      <EffectComposer>
        <SelectiveBloom
          lights={lights}
          selection={pointsRef}
          kernelSize={2} 
          luminanceThreshold={0} 
          luminanceSmoothing={0.4} 
          intensity={1}
        />
      </EffectComposer>
    )
  }

  const hover = useCallback(e => {
    e.stopPropagation();
    colorAttrRef.current.array[e.index * 3] = 1
    colorAttrRef.current.array[e.index * 3 + 1] = 1
    colorAttrRef.current.array[e.index * 3 + 2] = 1
    colorAttrRef.current.needsUpdate = true;

    if (onPointerOver) {
      onPointerOver(e);
    }
  }, []);

  const unhover = useCallback(e => {
    e.stopPropagation();

    const color: RGBColor = hexToRgb(options.dataPointColor);
    colorAttrRef.current.array[e.index * 3] = color.r
    colorAttrRef.current.array[e.index * 3 + 1] = color.g
    colorAttrRef.current.array[e.index * 3 + 2] = color.b
    colorAttrRef.current.needsUpdate = true;

    if (onPointerOut) {
      onPointerOut(e);
    }
  }, [])

  return (
    <>
      {points && (
          <points ref={pointsRef} onPointerOver={ hover }  onPointerOut={ unhover }>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                ref={posRef}
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
              size={options.particleSize}
              sizeAttenuation={true}
              map={circleTexture}
            />
          </points>
      )}
      {bloom}
    </>
  );
};
