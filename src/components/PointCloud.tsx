import { hexToRgb } from '../utils';
import OptionsContext from 'optionsContext';
import React, { useRef, useState, useContext, useEffect, useCallback, RefObject, ReactNode } from 'react';
import { PointData, RGBColor } from 'types';
import { BufferAttribute, PointsMaterial, Vector3, BufferGeometry } from 'three';
import { useTexture } from '@react-three/drei';
import { PointHoverAxes } from './PointHoverAxes';
import { HUD } from './HUD';
import { DataFrame } from '@grafana/data';
import { XYZChartOptions } from 'models.gen';

interface Props {
  points: PointData;
  lights: Array<RefObject<ReactNode>>;
  frames: DataFrame[];
}

export const PointCloud: React.FC<Props> = ({ points, lights, frames }) => {
  const pts: { geometry: BufferGeometry } = { geometry: new BufferGeometry() };
  const ptsMat: PointsMaterial = new PointsMaterial();
  const pointsRef = useRef(pts);
  const materialRef = useRef(ptsMat);
  const options: XYZChartOptions = useContext(OptionsContext);
  const circleTexture = useTexture('/public/plugins/grafana-xyzchart-panel/img/dot.png');
  const [hoveredPointPos, setHoveredStatePos] = useState<Vector3 | null>(null);
  const [hoveredPointData, setHoveredPointData] = useState<string[]>([]);
  const [hoveredPointColor, setHoveredPointColor] = useState<RGBColor>({r: 255, g: 255, b: 255});

  useEffect(() => {
    if (!options.useFieldsAsColor) {
      const color: RGBColor = hexToRgb(options.pointColor ?? '#ff0000');
      const colorAttr = pointsRef.current.geometry.getAttribute('color');
      for (let i = 0; i < colorAttr.array.length; i++) {
        colorAttr.setXYZ(i, color.r, color.g, color.b);
        colorAttr.needsUpdate = true;
      }
    }
  }, [options.pointColor, options.useFieldsAsColor]);

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

      if (options.useFieldsAsColor) {
        //save current color value of hovered point
        const r = colorAttr.getX(e.index);
        const g = colorAttr.getY(e.index);
        const b = colorAttr.getZ(e.index);
        setHoveredPointColor({r: r, g: g, b: b});
      }

      colorAttr.setXYZ(e.index, 1, 1, 1);
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
    [frames, options.useFieldsAsColor]
  );

  const unhover = useCallback(
    (e) => {
      e.stopPropagation();
      let color: RGBColor = {r: 255, g: 255, b: 255}

      if (!options.useFieldsAsColor) {
        color = hexToRgb(options.pointColor ?? '#ff0000');
      }
      else {
        color = hoveredPointColor;
      }

      // When moving the cursor too fast, the color of the points does not get updated correctly.
      // This behavior also exists in the unmodified version of the plugin.
      const colorAttr = pointsRef.current.geometry.getAttribute('color');
      colorAttr.setXYZ(e.index, color.r, color.g, color.b);
      colorAttr.needsUpdate = true;
      pointsRef.current.geometry.setAttribute('color', colorAttr);
      

      setHoveredPointData([]);
      setHoveredStatePos(null);
    },
    [options.pointColor, options.useFieldsAsColor, hoveredPointColor]
  );

  return (
    <>
      <points ref={pointsRef} onPointerOver={hover} onPointerOut={unhover}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={points.points.length / 3}
            array={points.points}
            itemSize={3}
          />
          <bufferAttribute
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
