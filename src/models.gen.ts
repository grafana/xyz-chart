import { HideableFieldConfig, AxisConfig } from '@grafana/schema';

export interface XYZSeriesConfig extends HideableFieldConfig, AxisConfig {
  x?: string;
  y?: string;
  z?: string;
  pointColor?: string;
  pointSize?: number;
}

export interface XYZDimensionConfig {
  frame: number;
  x?: string; // name | first
  pointColor?: string;
  pointSize?: number;
}

export interface XYZChartOptions {
  pointColor: string;
  pointSize: number;
  themeColor?: string;
  hudBgColor?: string;

  seriesMapping: 'auto' | 'manual' | undefined;
  dims?: XYZDimensionConfig[];
  series?: XYZSeriesConfig[];
}

export const defualtXyzChartConfig: XYZChartOptions = {
  pointColor: 'red',
  pointSize: 5,
  seriesMapping: 'auto',
};
