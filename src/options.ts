import { PanelOptionsEditorBuilder } from "@grafana/data";
import { LABEL_INTERVAL_DEFAULT, OPTION_COLORS, SCENE_MAX, SCENE_MIN, SCENE_SCALE_DEFAULT, WHITE } from "consts";
import { ScatterPlotOptions } from "types";

export const optionsBuilder = (builder: PanelOptionsEditorBuilder<ScatterPlotOptions>) => {
  return builder
    .addSliderInput({
      path: 'sceneScale',
      name: 'Grid Scale',
      category: categoryStyles,
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
      category: categoryStyles,
      defaultValue: LABEL_INTERVAL_DEFAULT,
      settings: {
        min: 1,
        max: Math.floor(SCENE_MAX / 3),
        step: 1,
        ariaLabelForHandle: 'Label Interval',
      },
    })
    .addTextInput({
      category: categoryStyles,
      path: 'labelDateFormat',
      name: 'Label Date Format',
      settings: {
        placeholder: 'Enter date format',
      },
      defaultValue: 'YYYY-MM-DD',
    })
    .addBooleanSwitch({
      category: categoryStyles,
      path: 'showColorSettings',
      name: 'Show Color Settings',
      defaultValue: false,
    })
    .addSelect({
      category: categoryStyles,
      path: 'xAxisColor',
      name: 'X Axis Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addSelect({
      category: categoryStyles,
      path: 'yAxisColor',
      name: 'Y Axis Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addSelect({
      category: categoryStyles,
      path: 'zAxisColor',
      name: 'Z Axis Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addSelect({
      category: categoryStyles,
      path: 'labelColor',
      name: 'Label Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: WHITE,
      showIf: config => config.showColorSettings,
    })
    .addSelect({
      category: categoryStyles,
      path: 'dataPointColor',
      name: 'Datapoint Color',
      settings: {
        options: OPTION_COLORS,
      },
      defaultValue: '#ff0000',
    })
}

const categoryStyles = ['Scatter panel styles'];