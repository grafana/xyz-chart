import { PanelPlugin } from '@grafana/data';
import { ScatterPlotOptions } from './types';
import { ScatterPlotPanel } from './ScatterPlotPanel';
import { optionsBuilder } from 'options';

export const plugin = new PanelPlugin<ScatterPlotOptions>(ScatterPlotPanel).setPanelOptions(optionsBuilder);
