import { PanelPlugin } from '@grafana/data';
import { ScatterPlotOptions } from './models.gen';
import { ScatterPlotPanel } from './ScatterPlotPanel';
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
    .addFieldNamePicker({
      path: 'series.x',
      name: 'X Field',
      showIf: (cfg) => cfg.mode === 'explicit',
    })
    .addFieldNamePicker({
      path: 'series.y',
      name: 'Y Field',
      showIf: (cfg) => cfg.mode === 'explicit',
    })
    .addFieldNamePicker({
      path: 'series.z',
      name: 'Z Field',
      showIf: (cfg) => cfg.mode === 'explicit',
    })
    .addTextInput({
      path: 'pointColor',
      name: 'Point color',
      settings: {},
    })
    .addTextInput({
      path: 'pointSize',
      name: 'Point size',
      settings: {},
    })
    //TODO use app/feature/dimension/editors when moving under public/plugins/panel
    // .addCustomEditor({
    //   id: 'pointColor',
    //   path: 'pointColor',
    //   name: 'Point color',
    //   editor: ColorDimensionEditor,
    //   settings: {},
    //   defaultValue: {},
    // })
    // .addCustomEditor({
    //   id: 'seriesZerox.pointSize',
    //   path: 'pointSize',
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
    // });
});

