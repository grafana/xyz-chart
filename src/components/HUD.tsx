import React, { useContext } from 'react';
import OptionsContext from 'optionsContext';
import { XYZChartOptions } from 'models.gen';
import { Html } from '@react-three/drei';
import { css } from '@emotion/css';

interface HUDProps {
  pointPos: THREE.Vector3;
  xValue: string;
  yValue: string;
  zValue: string;
}

export const HUD: React.FC<HUDProps> = ({ pointPos, xValue, yValue, zValue }) => {
  const options: XYZChartOptions = useContext(OptionsContext);
  const styles = getStyles(options);

  return (
    <Html
      position={pointPos}
      style={{
        transform: 'translate3d(-50%, -120%, 0)',
      }}
    >
      <div className={styles.tooltip}>
        <ul>
          <li>{xValue}</li>
          <li>{yValue}</li>
          <li>{zValue}</li>
        </ul>
      </div>
    </Html>
  );
};

const getStyles = (options: XYZChartOptions) => {
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
  };
};
