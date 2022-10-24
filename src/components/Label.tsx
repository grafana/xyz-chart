import React, { useContext } from 'react';
import { Text }  from '@react-three/drei';
import { LabelProps } from 'types';
import { SCENE_SCALE, WHITE } from 'consts';
import OptionsContext from 'optionsContext';
import { ScatterPlotOptions } from 'models.gen';

export const Label = ({direction, labelSize, position, rotation, text}: LabelProps) => {
  const options: ScatterPlotOptions = useContext(OptionsContext);
  const fontSize = labelSize ? labelSize : (SCENE_SCALE * 0.2) / 10;
  const color = options.themeColor ?? WHITE;

  return (
    <Text 
      color={ color } 
      font="/public/plugins/grafana-labs-grafana-3-d-scatter-panel/fonts/Roboto-Regular.ttf"
      textAlign="left"
      fontSize={ fontSize }
      position={ position }
      rotation={ rotation }> 
      { text }  
    </Text>
  );
};
