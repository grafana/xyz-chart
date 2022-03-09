import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ScatterPlotOptions } from 'types';
import { prepare3DScatterPlotDisplayValues } from 'utils';
import { CameraControls } from 'components/CameraControls';
import { PlotCanvas } from 'components/PlotCanvas';

interface Props extends PanelProps<ScatterPlotOptions> {}

export const ScatterPlotPanel: React.FC<Props> = (props) => {
  const theme = useTheme2();
  const frames = useMemo(() => prepare3DScatterPlotDisplayValues(props.data?.series, theme), [props.data, theme]);

  console.log(props.options);

  return (
    <>
      <CameraControls />
      <PlotCanvas frames={frames} />
    </>
  );
};