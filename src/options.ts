import { PanelOptionsEditorBuilder } from "@grafana/data";
import { LABEL_INTERVAL_DEFAULT, OPTION_COLORS, SCENE_MAX, SCENE_MIN, SCENE_SCALE_DEFAULT, WHITE } from "consts";
import { ScatterPlotOptions } from "types";

export const optionsBuilder = (builder: PanelOptionsEditorBuilder<ScatterPlotOptions>) => {
  return builder
    .addSliderInput({
      path: 'sceneScale',
      name: 'Grid Scale',
      category: gridCategory,
      defaultValue: SCENE_SCALE_DEFAULT,
      settings: {
        min: SCENE_MIN,
        max: SCENE_MAX,
        step: 1,
        ariaLabelForHandle: 'Grid Scale',
      },
    })
    .addSliderInput({
      path: 'labelInterval',
      name: 'Label Interval',
      category: gridCategory,
      defaultValue: LABEL_INTERVAL_DEFAULT,
      settings: {
        min: 1,
        max: Math.floor(SCENE_MAX / 3),
        step: 1,
        ariaLabelForHandle: 'Label Interval',
      },
    })
    .addBooleanSwitch({
      category: gridCategory,
      path: 'showColorSettings',
      name: 'Show Color Settings',
      defaultValue: false,
    })
    .addSelect({
      category: gridCategory,
      path: 'xAxisColor',
      name: 'X Axis Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addSelect({
      category: gridCategory,
      path: 'yAxisColor',
      name: 'Y Axis Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addSelect({
      category: gridCategory,
      path: 'zAxisColor',
      name: 'Z Axis Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addTextInput({
      category: labelCategory,
      path: 'labelDateFormat',
      name: 'Label Date Format',
      settings: {
        placeholder: 'Enter date format',
      },
      defaultValue: 'YYYY-MM-DD',
    })
    .addSelect({
      category: labelCategory,
      path: 'labelColor',
      name: 'Label Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
    })
    .addNumberInput({
      category: particleCategory,
      path: 'particleSize',
      name: 'Particle Size',
      defaultValue: 2,
    })
    .addColorPicker({
      category: particleCategory,
      path: 'dataPointColor',
      name: 'Particle Color',
      // settings: {
      //   options: OPTION_COLORS,
      // },
      defaultValue: '#ff0000',
    })
    .addNumberInput({
      category: cameraCategory,
      path: 'cameraFov',
      name: 'Camera Field of View',
      defaultValue: 75
    })
    .addNumberInput({
      category: cameraCategory,
      path: 'cameraX',
      name: 'Camera X Position',
      defaultValue: 0,
    })
    .addNumberInput({
      category: cameraCategory,
      path: 'cameraY',
      name: 'Camera Y Position',
      defaultValue: 0,
    })
    .addNumberInput({
      category: cameraCategory,
      path: 'cameraZ',
      name: 'Camera Z Position',
      defaultValue: 0,
    })
}

const gridCategory = ['Grid Options'];
const labelCategory = ['Label Options'];
const categoryStyles = ['Scatter panel styles'];
const particleCategory = ['Particle Options'];
const cameraCategory = ['Camera Options'];