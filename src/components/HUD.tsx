import React from 'react';
import { Vector3, DoubleSide } from 'three';
import { Label } from 'components/Label';
// import Roboto from '../fonts/Roboto.json';
// import { TextGeometry } from 'three-stdlib';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// // import { Direction, LabelProps, ScatterPlotOptions } from 'types';
import { createLineGeometry } from 'utils';
import { Direction } from 'types';


// import OptionsContext from 'optionsContext';

interface HUDProps {

};

export const HUD: React.FC<HUDProps> = (props) => {
  

  const labelPos = new Vector3(-0.65, 0.35, 0.001);

  return (
    
    <mesh position={[-2.25, -2.5, -5]}>
        {/* <line_ geometry={lineGeom}> 
            <lineBasicMaterial attach="material" />
        </line_> */}

        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial
                color={0x000000} 
                side={ DoubleSide } 
                opacity={0.6} />

        <Label text="Test" position={labelPos} labelSize={0.1} direction={Direction.Right} />
    </mesh>
  );
};