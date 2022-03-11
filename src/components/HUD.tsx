import React, { useContext } from 'react';
import OptionsContext from 'optionsContext';
import { Vector3, DoubleSide } from 'three';
import { Label } from 'components/Label';
// import Roboto from '../fonts/Roboto.json';
// import { TextGeometry } from 'three-stdlib';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// // import { Direction, LabelProps, ScatterPlotOptions } from 'types';
// import { createLineGeometry } from 'utils';
import { Direction, ScatterPlotOptions } from 'types';
import { DataFrame } from '@grafana/data';


// import OptionsContext from 'optionsContext';

interface HUDProps {
    frames: DataFrame[];
    activeIdx: number | null;
    position: [number, number, number];
    size: [number, number];
};

export const HUD: React.FC<HUDProps> = ({ frames, activeIdx, position, size }) => {
  
  const options: ScatterPlotOptions = useContext(OptionsContext);


//   const labelPos = new Vector3(0, 0.35, 0.001);

  let hudData = [];
  if (activeIdx !== null) {
    console.log(activeIdx);
    for (let field of frames[0].fields) {
        hudData.push(`${field.name}: ${field.values.get(activeIdx)}`);
    }
  }

  return (
    
    <mesh position={ position }>
        {/* <line_ geometry={lineGeom}> 
            <lineBasicMaterial attach="material" />
        </line_> */}

        <planeGeometry args={size} />
        <meshBasicMaterial
                color={options.hudBgColor} 
                side={ DoubleSide } 
                opacity={0.6} />

        {hudData.map((text, i) => {
            const labelPos = new Vector3(0.7, 0.35 * i * 0.5, 0.001);
            return <Label key={ i } text={ text } position={labelPos} labelSize={0.1} direction={Direction.Right} />
        })}
        
    </mesh>
  );
};