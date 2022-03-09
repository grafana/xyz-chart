import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Euler, Line, Vector3 } from 'three';

type SeriesSize = 'sm' | 'md' | 'lg';

// <line /> is being reserved by dom, so we need to alias it
extend({ Line_: Line });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>;
    }
  }
}

export interface ScatterPlotOptions {
  xAxisColor: string;
  yAxisColor: string;
  zAxisColor: string;
  labelColor: string;
  dataPointColor: string;
  sceneScale: number;
  labelInterval: number;
  labelDateFormat: string;
}

export interface LabelProps {
  position: Vector3;
  text: string;
  rotation?: Euler;
  direction: Direction;
  color?: string;
}

export interface AxisProps {
  direction: Direction;
  color?: string;
  size: number;
  gridInterval: number;
  intervalLabels: any[];
}

export interface GridProps {
  color?: string;
  direction: Direction;
  size: number;
  gridInterval: number;
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
