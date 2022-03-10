import React from 'react';
import { Vector3, DoubleSide } from 'three';
// import Roboto from '../fonts/Roboto.json';
// import { TextGeometry } from 'three-stdlib';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// // import { Direction, LabelProps, ScatterPlotOptions } from 'types';
import { createLineGeometry } from 'utils';


// import OptionsContext from 'optionsContext';

interface HUDProps {

};

export const HUD: React.FC<HUDProps> = (props) => {
  
//   const lineGeom = createLineGeometry(new Vector3(-2, -2, -4), new Vector3(0, 0, -4));

  return (
    <mesh position={[-2.25, -2.5, -4]}>
        {/* <line_ geometry={lineGeom}> 
            <lineBasicMaterial attach="material" />
        </line_> */}

        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial
                color={0x000000} 
                side={ DoubleSide } 
                opacity={0.6} />
    </mesh>
  );
};