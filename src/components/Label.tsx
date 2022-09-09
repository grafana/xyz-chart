import React, { useContext } from 'react';
import Roboto from '../fonts/Roboto.json';
import { TextGeometry } from 'three-stdlib';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { Direction, LabelProps } from 'types';
import { SCENE_SCALE, WHITE } from 'consts';
import OptionsContext from 'optionsContext';
import { ScatterPlotOptions } from 'models.gen';

export const Label = (props: LabelProps) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);

  const font = new FontLoader().parse(Roboto);
  const labelSize = props.labelSize ? props.labelSize : (SCENE_SCALE * 0.2) / 10;

  const calculateLabelOffset = () => {
    textGeometry.computeBoundingBox();

    switch (props.direction) {
      case Direction.Up:
        textGeometry.translate(textGeometry.boundingBox!.max.x, 0, 0);
        break;
      case Direction.Forward:
        textGeometry.translate(textGeometry.boundingBox!.max.x, 0, 0);
        break;
      case Direction.Right:
        textGeometry.translate(textGeometry.boundingBox!.min.x, 0, 0);
        break;
    }
  };

  const textOptions: any = {
    font,
    size: labelSize,
    height: 0,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 0,
    bevelSize: 8,
    bevelOffset: 0,
  };

  let text = props.text;

  const textGeometry = new TextGeometry(text, textOptions).center();
  calculateLabelOffset();

  let color = options.themeColor ?? WHITE;

  return (
    <mesh position={props.position} rotation={props.rotation ?? undefined} geometry={textGeometry}>
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};
