import { PanelPlugin } from '@grafana/data';
import { defualtXyzChartConfig, XYZChartOptions } from './models.gen';
import { XYZChart } from './XYZChart';
import { XYZDimsEditor } from 'XYZDimsEditor';

export const plugin = new PanelPlugin<XYZChartOptions>(XYZChart).setPanelOptions((builder) => {
  builder
    .addRadio({
      path: 'seriesMapping',
      name: 'Series mapping',
      defaultValue: defualtXyzChartConfig.seriesMapping,
      settings: {
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'manual', label: 'Manual' },
        ],
      },
    })
    .addCustomEditor({
      id: 'xyPlotConfig',
      path: 'dims',
      name: 'Data',
      editor: XYZDimsEditor,
      showIf: (cfg) => cfg.seriesMapping === 'auto',
    })
    .addFieldNamePicker({
      path: 'series.x',
      name: 'X Field',
      showIf: (cfg) => cfg.seriesMapping === 'manual',
    })
    .addFieldNamePicker({
      path: 'series.y',
      name: 'Y Field',
      showIf: (cfg) => cfg.seriesMapping === 'manual',
    })
    .addFieldNamePicker({
      path: 'series.z',
      name: 'Z Field',
      showIf: (cfg) => cfg.seriesMapping === 'manual',
    })
    .addColorPicker({
      path: 'pointColor',
      name: 'Point color',
      settings: {},
      defaultValue: defualtXyzChartConfig.pointColor,
    })
    .addNumberInput({
      path: 'pointSize',
      name: 'Point size',
      settings: {},
      defaultValue: defualtXyzChartConfig.pointSize,
    });
});
