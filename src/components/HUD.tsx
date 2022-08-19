import React, { useContext, useRef } from 'react';
import OptionsContext from 'optionsContext';
import { ScatterPlotOptions } from 'types';
import { Html, Line } from '@react-three/drei';
import { css } from '@emotion/css';
import { Color, Vector3 } from 'three';
import { useTheme2 } from '@grafana/ui';

interface HUDProps {
  pointPos: THREE.Vector3;
  xValue: string;
  yValue: string;
  zValue: string;
};

export const HUD: React.FC<HUDProps> = ({ pointPos, xValue, yValue, zValue }) => {
  const hudRef = useRef<any>(null);
  const options: ScatterPlotOptions = useContext(OptionsContext);
  const styles = getStyles(options);
  const theme = useTheme2();

  const hudPos = new Vector3(
    pointPos.x + 10,
    pointPos.y + 10,
    pointPos.z
  );

  const grafYellow = new Color("#FBC55A");
  const grafOrange = new Color("#FB755A");

  return (
    <>
    <Line
      points={[pointPos, hudPos]}
      // @ts-ignore
      vertexColors={[grafYellow, grafOrange]} 
      color="#FFF"                   // Default
      lineWidth={1}                   // In pixels (default)
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
            <li>{xValue}</li>
            <li>{yValue}</li>
            <li>{zValue}</li>
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