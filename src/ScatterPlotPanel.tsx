import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ScatterPlotOptions } from 'models.gen';
import { prepare3DScatterPlotDisplayValues } from 'utils';
import { PlotCanvas } from 'components/PlotCanvas';

interface Props extends PanelProps<ScatterPlotOptions> {}

export const ScatterPlotPanel: React.FC<Props> = (props) => {
  console.log(props);

  const theme = useTheme2();
  const frames = useMemo(() => prepare3DScatterPlotDisplayValues(props.data?.series, theme), [props.data, theme]);
  const options: ScatterPlotOptions = props.options as ScatterPlotOptions;
  options.themeColor = theme.isDark ? '#ffffff' : '#000000';
  options.hudBgColor = theme.colors.background.secondary;

  return (
    <PlotCanvas frames={frames} options={options}/>
  );
};