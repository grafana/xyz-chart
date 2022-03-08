import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera } from 'components/Camera';
import { PlotScene } from 'components/PlotScene';
import { DataFrame } from '@grafana/data';

interface Props {
  frames: DataFrame[];
}

export const PlotCanvas: React.FC<Props> = ({ frames }) => {
  return (
    <Canvas>
      {/* @ts-ignore */}
      <Camera />
      <ambientLight intensity={0.3} color="#FFFFFF" />
      <pointLight intensity={1.0} position={[10, 10, 10]} />
      <PlotScene frames={frames} />
    </Canvas>
  );
};
