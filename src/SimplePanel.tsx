import React, { useMemo, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  // const theme = useTheme();
  // const styles = getStyles();
  return (
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} color="#FFFFFF" />
        <pointLight intensity={1.0} position={[10, 10, 10]} />
        <Box position={[-2, 1, 0]} rotation={[3, 1, 0]} color="hotpink" boxSpeed={0.02} />
        <Box position={[2, 1, 0]} rotation={[1, 1, 0]} color="cyan" boxSpeed={0.01} />
        <Box position={[0, -1, 0]} size={[1, 2, 2]} boxSpeed={0.005} />
      </Canvas>
  );
};

type BoxProps = {
  size?: [number, number, number];
  color?: string;
  boxSpeed?: number;
} & MeshProps;

export const Box = ({ size = [1, 1, 1], color = '#FFFFFF', boxSpeed = 0.01, ...meshProps }: BoxProps) => {
  const boxRef = useRef<MeshProps | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // It is react-three-fiber way to trigger animation
  // each frame we are changing x, y, z rotation of our box
  useFrame(() => {
    if (!boxRef.current) {
      return;
    }
    boxRef.current.rotateX!(boxSpeed);
    boxRef.current.rotateY!(boxSpeed);
  });
  // it is color memo which indicates state of an item
  const calculatedColor = useMemo(() => {
    if (isSelected && isHovered) {
      return 'orange';
    }
    if (isSelected) {
      return 'yellow';
    }
    if (isHovered && !isSelected) {
      return 'red';
    }
    return color;
  }, [color, isHovered, isSelected]);

  return (
    <mesh
      {...meshProps}
      ref={boxRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={() => setIsSelected((prev) => !prev)}
      scale={isSelected ? [1.2, 1.2, 1.2] : [1, 1, 1]}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={calculatedColor} />
    </mesh>
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
