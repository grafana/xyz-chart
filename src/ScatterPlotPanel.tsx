import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ScatterPlotOptions } from 'models.gen';
import { PlotCanvas } from 'components/PlotCanvas';
import { preparePlotByDims, preparePlotByExplicitSeries } from 'utils';

interface Props extends PanelProps<ScatterPlotOptions> {}

export const ScatterPlotPanel: React.FC<Props> = (props) => {
  const theme = useTheme2();
  const frames = useMemo(() => {
    if (props.options.mode === 'explicit') {
      return preparePlotByExplicitSeries(props.data.series, props.options.series);
    } else {
      return preparePlotByDims(props.data.series, props.options.dims);
    }
  }, [props.data, props.options]);

  const options: ScatterPlotOptions = props.options as ScatterPlotOptions;
  options.themeColor = theme.isDark ? '#ffffff' : '#000000';
  options.hudBgColor = theme.colors.background.secondary;

  return (
    <PlotCanvas frames={frames} options={options}/>
  );
};