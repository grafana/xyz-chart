import { Vector3 } from 'three';

type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface LabelProps {
  position: Vector3;
  text: string;
}
