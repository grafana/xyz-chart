import React, { useContext, useRef } from 'react';
import OptionsContext from 'optionsContext';
import { HoveredPoint, ScatterPlotOptions } from 'types';
import { Line, Html } from '@react-three/drei';
import { css } from '@emotion/css';
import { Color, Vector3 } from 'three';
import { useTheme2 } from '@grafana/ui';

interface HUDProps {
  hoveredPoint: HoveredPoint;
};

export const HUD: React.FC<HUDProps> = ({ hoveredPoint }) => {
  const hudRef = useRef<any>(null);
  const options: ScatterPlotOptions = useContext(OptionsContext);
  const styles = getStyles(options);
  // const theme = useTheme2();

  const hudPos = new Vector3(105, 85, 30);
  
  const grafYellow = new Color("#FBC55A");
  const grafOrange = new Color("#FB755A");

  return (
    <>
    <Line
      points={[hoveredPoint.position, hudPos]}
      // @ts-ignore
      vertexColors={ [grafYellow, grafOrange] } 
      color="#FFF"                   // Default
      lineWidth={ 1 }      // In pixels (default)
      dashed={ false } 
    />
    <Html
      ref={ hudRef }
      position={ hudPos }
      style={{
        // transform: 'translate3d(-50%, -120%, 0)'
      }}
    >
      <div className={styles.tooltipWrapper}>
        <div className={styles.tooltip}>
          <ul>
            <li>{ hoveredPoint.data[0] }</li>
            <li>{ hoveredPoint.data[1] }</li>
            <li>{ hoveredPoint.data[2] }</li>
          </ul>
        </div>
      </div>
    </Html>
    </>
    );
};

const getStyles = (options: ScatterPlotOptions) => {
  const theme = useTheme2();

  return {
    tooltip: css`
      box-shadow: ${theme.shadows.z1};
      padding: 10px;
      background-color: ${options.hudBgColor};
      text-align: left;
      color: white;
      ul {
        list-style: none;
        display: inline-block;
        li {
          white-space: nowrap;
        }
      }
    `,
    tooltipWrapper: css`
      padding: 1px;
      background-image: ${theme.colors.gradients.brandVertical};
    `,
  };
}