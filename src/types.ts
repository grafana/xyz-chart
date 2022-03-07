import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Line, Vector3 } from 'three';

type SeriesSize = 'sm' | 'md' | 'lg';

// <line /> is being reserved by dom, so we need to alias it
extend({ Line_: Line })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface LabelProps {
  position: Vector3;
  text: string;
}

export interface AxisProps {
  direction: Direction;
  color?: string;
  size: number;
}

export interface GridProps {
  direction: Direction;
  size: number;
  gridInterval: number;
}

export enum Direction {
  Up = 1,
  Right,
  Forward
}