import React from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from 'three-stdlib';
import { Camera } from 'components/Camera';
import { PlotScene } from 'components/PlotScene';

extend({ OrbitControls });


interface Props {}

export const PlotCanvas: React.FC<Props> = ({}) => {


    return (
        <Canvas>
            {/* @ts-ignore */}
            <Camera />
            <ambientLight intensity={0.3} color="#FFFFFF" />
            <pointLight intensity={1.0} position={[10, 10, 10]} />
            <PlotScene />
        </Canvas>
    )
}
