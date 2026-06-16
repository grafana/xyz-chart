import React from 'react';
import { XYZChartOptions } from 'models.gen';

const opts: XYZChartOptions = {
  pointColor: '',
  pointSize: 0,
  seriesMapping: 'auto',
};

const OptionsContext = React.createContext(opts);

export const OptionsProvider = OptionsContext.Provider;

export default OptionsContext;
