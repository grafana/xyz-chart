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

  console.log(options);
  // const theme = useTheme2();

  const hudPos = new Vector3(105, 85, 30);
  
  const grafYellow = new Color("#FBC55A");
  const grafOrange = new Color("#FB755A");

  return (
    <>
      <div className={styles.tooltipWrapper}>
        <div className={styles.tooltip}>
          <ul>
            <li>{ hoveredPoint.data[0] }</li>
            <li>{ hoveredPoint.data[1] }</li>
            <li>{ hoveredPoint.data[2] }</li>
          </ul>
        </div>
      </div>
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
      position: absolute;
      top: 15px;
      left: 15px;
    `,
  };
}