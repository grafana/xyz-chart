import { hexToRgb } from '../utils';
import OptionsContext from 'optionsContext';
import React, { useRef, useState, useContext, useEffect, useCallback, RefObject, ReactNode } from 'react';
import { PointData, RGBColor } from 'types';
import { BufferAttribute, PointsMaterial, Vector3 } from 'three';
import { useTexture } from '@react-three/drei';
import { PointHoverAxes } from './PointHoverAxes';
import { HUD } from './HUD';
import { DataFrame } from '@grafana/data';

interface Props {
  points: PointData;
  lights: Array<RefObject<ReactNode>>;
  frames: DataFrame[];
}

export const PointCloud: React.FC<Props> = ({ points, lights, frames }) => {
  const colorAttrRef: any = useRef(null);
  const pointsRef: any = useRef(null);
  const posRef: any = useRef(null);
  const materialRef = useRef({} as PointsMaterial);
  const options: any = useContext(OptionsContext);
  const circleTexture = useTexture('/public/plugins/grafana-labs-grafana-3-d-scatter-panel/img/texture/dot.png');
  const [hoveredPointPos, setHoveredStatePos] = useState<Vector3 | null>(null);
  const [hoveredPointData, setHoveredPointData] = useState<string[]>([]);

  useEffect(() => {
    const color: RGBColor = hexToRgb(options.pointColor ?? '#ff0000');
    const colorAttr = pointsRef.current.geometry.getAttribute('color');
    for (let i = 0; i < colorAttr.array.length; i++) {
      colorAttr.setXYZ(i, color.r, color.g, color.b);
      colorAttr.needsUpdate = true;
    }
  }, [options.pointColor]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.size = options.pointSize;
      materialRef.current.needsUpdate = true;
    }
  }, [options.pointSize]);

  useEffect(() => {
    if (pointsRef.current) {
      const posAttr = new BufferAttribute(points.points, 3);
      const colorAttr = new BufferAttribute(points.colors, 3);
      pointsRef.current.geometry.setAttribute('position', posAttr);
      pointsRef.current.geometry.setAttribute('color', colorAttr);
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [points]);

  const hover = useCallback(
    (e) => {
      e.stopPropagation();
      const colorAttr = pointsRef.current.geometry.getAttribute('color');
      colorAttr.array[e.index * 3] = 1;
      colorAttr.array[e.index * 3 + 1] = 1;
      colorAttr.array[e.index * 3 + 2] = 1;
      colorAttr.needsUpdate = true;
      pointsRef.current.geometry.setAttribute('color', colorAttr);

      let hudData = [];
      for (let field of frames[0].fields) {
        hudData.push(`${field.name}: ${field.values.get(e.index)}`);
      }

      setHoveredPointData(hudData);

      const posAttr = pointsRef.current.geometry.getAttribute('position');
      const pointPos = new Vector3(posAttr.getX(e.index), posAttr.getY(e.index), posAttr.getZ(e.index));

      setHoveredStatePos(pointPos);
    },
    [frames]
  );

  const unhover = useCallback(
    (e) => {
      e.stopPropagation();

      const color: RGBColor = hexToRgb(options.pointColor ?? '#ff0000');
      const colorAttr = pointsRef.current.geometry.getAttribute('color');
      colorAttr.array[e.index * 3] = color.r;
      colorAttr.array[e.index * 3 + 1] = color.g;
      colorAttr.array[e.index * 3 + 2] = color.b;
      colorAttr.needsUpdate = true;
      pointsRef.current.geometry.setAttribute('color', colorAttr);

      setHoveredPointData([]);
      setHoveredStatePos(null);
    },
    [options.pointColor]
  );

  return (
    <>
      <points ref={pointsRef} onPointerOver={hover} onPointerOut={unhover}>
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
          opacity={1}
          transparent
          vertexColors
          size={options.pointSize}
          sizeAttenuation={true}
          map={circleTexture}
        />
      </points>
      {hoveredPointPos !== null && (
        <>
          <PointHoverAxes pointVector={hoveredPointPos} />
          <HUD
            pointPos={hoveredPointPos}
            xValue={hoveredPointData[0]}
            yValue={hoveredPointData[1]}
            zValue={hoveredPointData[2]}
          />
        </>
      )}
    </>
  );
};
