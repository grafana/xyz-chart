import React, { useMemo, lazy, useState, useEffect, Suspense } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { XYZChartOptions as XYZChartOptions } from 'models.gen';
import { preparePlotByDims, preparePlotByExplicitSeries } from 'utils';

interface Props extends PanelProps<XYZChartOptions> { }

export const XYZChart: React.FC<Props> = (props) => {
  const theme = useTheme2();
  const frames = useMemo(() => {
    if (props.options.seriesMapping === 'manual') {
      return preparePlotByExplicitSeries(props.data.series, props.options.series!);
    } else {
      return preparePlotByDims(props.data.series, props.options.dims!);
    }
  }, [props.data.series, props.options.series, props.options.dims, props.options.seriesMapping]);

  const options: XYZChartOptions = props.options;
  const [isMounted, setIsMounted] = useState(false);
  options.themeColor = theme.isDark ? '#ffffff' : '#000000';
  options.hudBgColor = theme.colors.background.secondary;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let error = false;
  for (const frame of frames) {
    if (frame.fields.length < 3) {
      error = true;
      break;
    }
  }

  const Canvas = lazy(() => import('components/PlotCanvas'));

  if (error || frames.length === 0) {
    return (
      <div className="panel-empty">
        <p>Incorrect data</p>
      </div>
    );
  }


  return (
    <>
      {!isMounted ? <div className="panel-empty" /> : (<Suspense fallback={null}><div style={{ cursor: 'grab', width: '100%', height: '100%' }}><Canvas frames={frames} options={options} /></div></Suspense>)}
    </>
  );
};
