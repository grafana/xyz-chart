import { PanelPlugin } from '@grafana/data';
import { ScatterPlotOptions } from './models.gen';
import { ScatterPlotPanel } from './ScatterPlotPanel';
// import { commonOptionsBuilder } from '@grafana/ui';
import { XYZDimsEditor } from 'XYZDimsEditor';

export const plugin = new PanelPlugin<ScatterPlotOptions>(ScatterPlotPanel).setPanelOptions((builder) => {
  builder
    .addRadio({
      path: 'mode',
      name: 'Mode',
      defaultValue: 'single',
      settings: {
        options: [
          { value: 'xyz', label: 'XYZ' },
          { value: 'explicit', label: 'Explicit' },
        ],
      },
    })
    .addCustomEditor({
      id: 'xyPlotConfig',
      path: 'dims',
      name: 'Data',
      editor: XYZDimsEditor,
      showIf: (cfg) => cfg.mode === 'xyz',
    })
    // .addFieldNamePicker({
    //   path: 'series[0].x',
    //   name: 'X Field',
    //   showIf: (cfg) => cfg.mode === 'explicit',
    // })
    // .addFieldNamePicker({
    //   path: 'series[0].y',
    //   name: 'Y Field',
    //   showIf: (cfg) => cfg.mode === 'explicit',
    // })
    // .addCustomEditor({
    //   id: 'seriesZerox.pointColor',
    //   path: 'series[0].pointColor',
    //   name: 'Point color',
    //   editor: ColorDimensionEditor,
    //   settings: {},
    //   defaultValue: {},
    //   showIf: (cfg) => cfg.mode === 'explicit',
    // })
    // .addCustomEditor({
    //   id: 'seriesZerox.pointSize',
    //   path: 'series[0].pointSize',
    //   name: 'Point size',
    //   editor: ScaleDimensionEditor,
    //   settings: {
    //     min: 1,
    //     max: 50,
    //   },
    //   defaultValue: {
    //     fixed: 5,
    //     min: 1,
    //     max: 50,
    //   },
    //   showIf: (cfg) => cfg.mode === 'explicit',
    // })
    ;

  // commonOptionsBuilder.addTooltipOptions(builder);
  // commonOptionsBuilder.addLegendOptions(builder);
});

