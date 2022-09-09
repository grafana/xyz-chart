import { PanelPlugin } from '@grafana/data';
import { defaultScatterConfig, ScatterPlotOptions } from './models.gen';
import { ScatterPlotPanel } from './ScatterPlotPanel';
import { XYZDimsEditor } from 'XYZDimsEditor';

export const plugin = new PanelPlugin<ScatterPlotOptions>(ScatterPlotPanel).setPanelOptions((builder) => {
  builder
    .addRadio({
      path: 'mappingMode',
      name: 'Mapping mode',
      defaultValue: defaultScatterConfig.mappingMode,
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
      showIf: (cfg) => cfg.mappingMode === 'auto',
    })
    .addFieldNamePicker({
      path: 'series.x',
      name: 'X Field',
      showIf: (cfg) => cfg.mappingMode === 'manual',
    })
    .addFieldNamePicker({
      path: 'series.y',
      name: 'Y Field',
      showIf: (cfg) => cfg.mappingMode === 'manual',
    })
    .addFieldNamePicker({
      path: 'series.z',
      name: 'Z Field',
      showIf: (cfg) => cfg.mappingMode === 'manual',
    })
    .addColorPicker({
      path: 'pointColor',
      name: 'Point color',
      settings: {},
      defaultValue: defaultScatterConfig.pointColor,
    })
    .addNumberInput({
      path: 'pointSize',
      name: 'Point size',
      settings: {},
      defaultValue: defaultScatterConfig.pointSize,
    });
});