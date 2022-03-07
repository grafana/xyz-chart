import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2, PanelChrome } from '@grafana/ui';
import { SimpleOptions } from 'types';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from 'three-stdlib';
import { Camera } from 'components/Camera';
import { PlotScene } from 'components/PlotScene';
import { prepare3DScatterPlotDisplayValues } from 'utils';

extend({ OrbitControls });

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme2();
  const values = useMemo(() => prepare3DScatterPlotDisplayValues(data?.series, theme), [data, theme]);

  // const styles = getStyles();
  return (
    <Canvas>
      {/* @ts-ignore */}
      <Camera />
      <ambientLight intensity={0.3} color="#FFFFFF" />
      <pointLight intensity={1.0} position={[10, 10, 10]} />
      <PlotScene />
    </Canvas>
  );
};

// const getStyles = stylesFactory(() => {
//   return {
//     wrapper: css`
//       position: relative;
//     `,
//     svg: css`
//       position: absolute;
//       top: 0;
//       left: 0;
//     `,
//     textBox: css`
//       position: absolute;
//       bottom: 0;
//       left: 0;
//       padding: 10px;
//     `,
//   };
// });
