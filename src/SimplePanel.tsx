import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { SimpleOptions } from 'types';
import { prepare3DScatterPlotDisplayValues } from 'utils';
import { CameraControls } from 'components/CameraControls';
import { PlotCanvas } from 'components/PlotCanvas';


interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme2();
  const frames = useMemo(() => prepare3DScatterPlotDisplayValues(data?.series, theme), [data, theme]);

  // const styles = getStyles();
  return (
    <>
      <CameraControls />
      <PlotCanvas frames={ frames } />
    </>
  );
};

// const getStyles = stylesFactory(() => {
//   return {
//     wrapper: css`
//       position: relative;
//     `,
//     svg: css`
//       position: absolute;
//       top: 0;
//       left: 0;
//     `,
//     textBox: css`
//       position: absolute;
//       bottom: 0;
//       left: 0;
//       padding: 10px;
//     `,
//   };
// });
