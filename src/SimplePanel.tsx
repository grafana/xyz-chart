import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { Canvas, extend } from '@react-three/fiber';
import { Label } from 'components/Label';
import { Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { Camera } from 'components/Camera';

extend({ OrbitControls });

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  // const theme = useTheme();
  // const styles = getStyles();
  return (
    <Canvas>
      {/* @ts-ignore */}
      <Camera />
      <ambientLight intensity={0.3} color="#FFFFFF" />
      <pointLight intensity={1.0} position={[10, 10, 10]} />
      <Label position={new Vector3(-3, 0, 0)} text={'test'} />
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
