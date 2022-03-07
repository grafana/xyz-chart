import React from 'react';
import Roboto from '../fonts/Roboto.json';
import { TextGeometry } from 'three-stdlib';
import { extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { LabelProps } from 'types';

extend({ TextGeometry });

export const Label = (props: LabelProps) => {
  // parse JSON file with Three
  const font = new FontLoader().parse(Roboto);

  // configure font geometry
  const textOptions = {
    font,
    size: 1,
    height: 0,
    curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 0,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
  };

  return (
    <mesh position={props.position}>
      {/* @ts-ignore */}
      <textGeometry attach="geometry" args={[props.text, textOptions]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
};
