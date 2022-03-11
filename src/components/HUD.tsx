import React, { useContext } from 'react';
import OptionsContext from 'optionsContext';
import { Vector3, DoubleSide } from 'three';
import { Label } from 'components/Label';
import { Direction, ScatterPlotOptions } from 'types';
import { DataFrame } from '@grafana/data';

interface HUDProps {
    frames: DataFrame[];
    activeIdx: number | null;
    position: [number, number, number];
    size: [number, number];
};

export const HUD: React.FC<HUDProps> = ({ frames, activeIdx, position, size }) => {
  
  const options: ScatterPlotOptions = useContext(OptionsContext);

  let hudData = [];
  if (activeIdx !== null) {
    for (let field of frames[0].fields) {
        hudData.push(`${field.name}: ${field.values.get(activeIdx)}`);
    }
  }

  return (
    
    <mesh position={ position }>
        <planeGeometry args={size} />
        <meshBasicMaterial
                color={options.hudBgColor} 
                side={ DoubleSide } 
                opacity={0.6} />

        {hudData.map((text, i) => {
            const labelPos = new Vector3(1.4, 0.35 * i * 1, 0.001);
            return <Label key={ i } text={ text } position={labelPos} labelSize={0.2} direction={Direction.Right} />
        })}
        
    </mesh>
  );
};