/**
 * @file
 * Wraps R3F <points> element and supplies
 * sane default for materials, geometries, etc.
 */

import { hexToRgb } from '../utils';
import OptionsContext from 'optionsContext';
import React, {
  useRef,
  // useState,
  useContext,
  useEffect,
  useCallback,
  RefObject,
  ReactNode,
} from 'react';
import { HoveredPoint, PointData, RGBColor } from 'types';
import { BufferAttribute, PointsMaterial, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { lerp } from 'three/src/math/MathUtils';
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing';
import { PointHoverAxes } from './PointHoverAxes';
// import { HUD } from './HUD';
import { DataFrame } from '@grafana/data';

interface Props {
  points: PointData;
  lights: Array<RefObject<ReactNode>>;
  frames: DataFrame[];
  hoveredPoint: HoveredPoint | null;
  setHoveredPoint: Function;
  hudRef: RefObject<ReactNode>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export const PointCloud: React.FC<Props> = ({
  points,
  lights,
  frames,
  hoveredPoint,
  setHoveredPoint,
  hudRef,
  canvasRef,
}) => {
  const colorAttrRef: any = useRef(null);
  const pointsRef: any = useRef(null);
  const posRef: any = useRef(null);
  const materialRef = useRef({} as PointsMaterial);
  const options: any = useContext(OptionsContext);
  const circleTexture = useTexture('/public/plugins/grafana-labs-grafana-3-d-scatter-panel/img/dot.png');
  // const [hoveredPointPos, setHoveredStatePos] = useState<Vector3 | null>(null);
  // const [hoveredPointData, setHoveredPointData] = useState<string[]>([]);
  let showPoints = true;

  useEffect(() => {
    const color: RGBColor = hexToRgb(options.dataPointColor);
    const colorAttr = pointsRef.current.geometry.getAttribute('color');
    for (let i = 0; i < colorAttr.array.length; i++) {
      colorAttr.setXYZ(i, color.r, color.g, color.b);
      colorAttr.needsUpdate = true;
    }
  }, [options.dataPointColor]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.size = options.particleSize;
      materialRef.current.needsUpdate = true;
    }
  }, [options.particleSize]);

  useEffect(() => {
    showPoints = false;

    setTimeout(() => {
      if (pointsRef.current) {
        const posAttr = new BufferAttribute(points.points, 3);
        const colorAttr = new BufferAttribute(points.colors, 3);
        pointsRef.current.geometry.setAttribute('position', posAttr);
        pointsRef.current.geometry.setAttribute('color', colorAttr);
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      showPoints = true;
    }, 500);
  }, [points]);

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
    );
  }

  const hover = useCallback(
    (e) => {
      e.stopPropagation();

      // Retrieve color and position attributes from the point cloud
      const colorAttr = pointsRef.current.geometry.getAttribute('color');
      const posAttr = pointsRef.current.geometry.getAttribute('position');

      // Set the color of the current point
      colorAttr.array[e.index * 3] = 0.98;
      colorAttr.array[e.index * 3 + 1] = 0.77;
      colorAttr.array[e.index * 3 + 2] = 0.35;
      colorAttr.needsUpdate = true;
      pointsRef.current.geometry.setAttribute('color', colorAttr);

      // Retrieve HUD data and point position
      let hudData = [];
      for (let field of frames[0].fields) {
        hudData.push(`${field.name}: ${field.values.get(e.index)}`);
      }
      const pointPos = new Vector3(posAttr.getX(e.index), posAttr.getY(e.index), posAttr.getZ(e.index));

      // Update hovered point info
      setHoveredPoint({
        position: pointPos,
        data: hudData,
      });

      // setHoveredStatePos(pointPos);
    },
    [frames]
  );

  const unhover = useCallback(
    (e) => {
      e.stopPropagation();

      const color: RGBColor = hexToRgb(options.dataPointColor);
      const colorAttr = pointsRef.current.geometry.getAttribute('color');
      colorAttr.array[e.index * 3] = color.r;
      colorAttr.array[e.index * 3 + 1] = color.g;
      colorAttr.array[e.index * 3 + 2] = color.b;
      colorAttr.needsUpdate = true;
      pointsRef.current.geometry.setAttribute('color', colorAttr);

      setHoveredPoint(null);
    },
    [frames]
  );

  return (
    <scene>
      <points ref={pointsRef} onPointerOver={hover} onPointerOut={unhover}>
        <bufferGeometry>
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
          opacity={0}
          transparent
          vertexColors
          size={options.particleSize}
          sizeAttenuation={true}
          map={circleTexture}
        />
      </points>
      {hoveredPoint !== null && <PointHoverAxes canvasRef={canvasRef} hudRef={hudRef} hoveredPoint={hoveredPoint} />}
      {bloom}
    </scene>
  );
};
