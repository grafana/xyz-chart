import {
  OptionsWithTooltip,
  OptionsWithLegend,
  VisibilityMode,
  HideableFieldConfig,
  AxisConfig,
  AxisPlacement,
} from '@grafana/schema';

export enum ScatterLineMode {
  None = 'none',
  Linear = 'linear',
  // Smooth
  // r2, etc
}

export interface ScatterFieldConfig extends HideableFieldConfig, AxisConfig {
  point?: VisibilityMode;
  // pointSize?: ScaleDimensionConfig; // only 'fixed' is exposed in the UI
  // pointColor?: ColorDimensionConfig;
  // pointSymbol?: DimensionSupplier<string>;
}

export const defaultScatterConfig: ScatterFieldConfig = {
  point: VisibilityMode.Auto,
  axisPlacement: AxisPlacement.Auto,
};

/** Old config saved with 8.0+ */
export interface XYZDimensionConfig {
  frame: number;
  x?: string; // name | first
}

export interface ScatterPlotOptions extends OptionsWithLegend, OptionsWithTooltip{
  pointColor: string;
  pointSize: number;
  themeColor: string;
  hudBgColor: string;
 
  mode: 'xyz' | 'explicit' | undefined;
  dims: XYZDimensionConfig;
}
