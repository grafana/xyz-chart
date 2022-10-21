import React, { useContext } from 'react';
import OptionsContext from 'optionsContext';
import { HoveredPoint, ScatterPlotOptions } from 'types';
// import { Line, Html } from '@react-three/drei';
import { css } from '@emotion/css';
// import { Color, Vector3 } from 'three';
import { useTheme2 } from '@grafana/ui';

interface HUDProps {
  hoveredPoint: HoveredPoint | null;
  hudRef: any;
}

export const HUD: React.FC<HUDProps> = ({ hoveredPoint, hudRef }) => {
  // const hudEl = useRef(null);
  const options: ScatterPlotOptions = useContext(OptionsContext);
  const styles = getStyles(options);
  const displayStyles = {
    display: hoveredPoint !== null ? 'block' : 'none',
  };
  // const theme = useTheme2();

  // const grafYellow = new Color("#FBC55A");
  // const grafOrange = new Color("#FB755A");

  return (
    <div ref={hudRef} className={styles.tooltipWrapper} style={displayStyles}>
      <div className={styles.tooltip}>
        <ul>
          <li>{hoveredPoint?.data[0]}</li>
          <li>{hoveredPoint?.data[1]}</li>
          <li>{hoveredPoint?.data[2]}</li>
        </ul>
      </div>
    </div>
  );
};

const getStyles = (options: ScatterPlotOptions) => {
  const theme = useTheme2();

  return {
    tooltip: css`
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
      box-shadow: ${theme.shadows.z1};
      position: absolute;
      bottom: 15px;
      right: 15px;
      z-index: 1;
    `,
  };
};
