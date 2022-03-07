/**
 * @file
 * Wraps R3F <points> element and supplies
 * sane default for materials, geometries, etc.
 */

import React from 'react';
import { PointData } from 'types';

interface Props {
  points: PointData;
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

    return (
        <points>
            <bufferGeometry attach="geometry">
            <bufferAttribute
                attachObject={['attributes', 'position']}
                count={points.points.length / 3}
                array={points.points}
                itemSize={ 1 }
            />
            <bufferAttribute
                attachObject={['attributes', 'color']}
                count={points.colors.length / 3}
                array={points.colors}
                itemSize={ 1 }
            />
            </bufferGeometry>
        </points>
    );
};
