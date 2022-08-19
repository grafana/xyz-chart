import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Euler, Line, Vector3 } from 'three';

// <line /> is being reserved by dom, so we need to alias it
extend({ Line_: Line });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>;
    }
  }
}

export interface LabelProps {
  position: Vector3;
  text: string;
  rotation?: Euler;
  direction: Direction;
  labelSize?: number;
}

export interface GridAxisProps {
  direction: Direction;
  intervalLabels: any[];
}

export enum Direction {
  Up = 1,
  Right,
  Forward,
}

export interface AxisData {
  axisPoints: [number, number, number][];
  intervalGeometries: number[][][];
  intervalLabelPos: Vector3[];
  labelRotation: Euler;
  color: string;
}

export interface PointData {
  points: Float32Array;
  colors: Float32Array;
}

export interface IntervalLabels {
  xLabels: string[];
  yLabels: string[];
  zLabels: string[];
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}