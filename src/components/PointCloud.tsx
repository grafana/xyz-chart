/**
 * @file
 * Wraps R3F <points> element and supplies
 * sane default for materials, geometries, etc.
 */

import React from 'react';

interface Props {
  points: [];
  colors?: [];
  onPointerOver?: Function;
  onPointerOut?: Function;
}

export const PointCloud: React.FC<Props> = ({ points }) => {
  let positions = [], colors = [];

    for (let i = 0; i < 100; i++) {
        positions.push(Math.random() * 10);
        positions.push(Math.random() * 10);
        positions.push(Math.random() * 10);
        colors.push(1);
        colors.push(0.5);
        colors.push(0.5);
    }

    let f32positions = new Float32Array(positions);
    let f32colors = new Float32Array(colors);

    return (
        <points>
            <bufferGeometry attach="geometry">
            <bufferAttribute
                attachObject={['attributes', 'position']}
                count={positions.length / 3}
                array={f32positions}
                itemSize={ 1 }
            />
            <bufferAttribute
                attachObject={['attributes', 'color']}
                count={colors.length / 3}
                array={f32colors}
                itemSize={ 1 }
            />
            </bufferGeometry>
        </points>
    );
};
