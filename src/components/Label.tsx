import React from 'react';
import Roboto from '../fonts/Roboto.json';
import { TextGeometry } from 'three-stdlib';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { LabelProps } from 'types';
import { SCENE_SCALE } from 'consts';

export const Label = (props: LabelProps) => {
  const font = new FontLoader().parse(Roboto);
  const labelSize = SCENE_SCALE * 0.3 / 10;

  const textOptions: any = {
    font,
    size: labelSize,
    height: 0,
    curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 0,
		bevelSize: 8,
		bevelOffset: 0
  };

  const textGeometry = new TextGeometry(props.text, textOptions).center();

  return (
    <mesh position={props.position} rotation={props.rotation ?? undefined} geometry={textGeometry}>
      <meshStandardMaterial attach="material" />
    </mesh>
  );
};
