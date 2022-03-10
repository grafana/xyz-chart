import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ScatterPlotOptions } from 'types';
import { prepare3DScatterPlotDisplayValues } from 'utils';
import { PlotCanvas } from 'components/PlotCanvas';
import { config } from '@grafana/runtime';

interface Props extends PanelProps<ScatterPlotOptions> {}

export const ScatterPlotPanel: React.FC<Props> = (props) => {
  const theme = useTheme2();
  const frames = useMemo(() => prepare3DScatterPlotDisplayValues(props.data?.series, theme), [props.data, theme]);
  
  const options: ScatterPlotOptions = props.options as ScatterPlotOptions;
  options.themeColor = config.theme2.isDark ? '#ffffff' : '#000000';

  return (
    <PlotCanvas frames={frames} options={options}/>
  );
};