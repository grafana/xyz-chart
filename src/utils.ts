import { BufferGeometry, Vector3 } from 'three';
import { DataFrame, GrafanaTheme2, Field, FieldType, ArrayVector } from '@grafana/data';
import { IntervalLabels, PointData, RGBColor } from 'types';
import moment from 'moment';

export function createLineGeometry(startVec: Vector3, endVec: Vector3): BufferGeometry {
  const points = [];

  points.push(startVec);
  points.push(endVec);

  return new BufferGeometry().setFromPoints(points);
}

/**
 * Take data frames and identify and time and value fields stripping other fields.
 */
export function prepare3DScatterPlotDisplayValues(series: DataFrame[], theme: GrafanaTheme2): DataFrame[] {
  let copy: Field;
  const frames: DataFrame[] = [];
  let hasTimeField = false,
    hasValueField = false;

  for (let frame of series) {
    const fields: Field[] = [];

    for (const field of frame.fields) {
      switch (field.type) {
        case FieldType.time:
          hasTimeField = true;
          fields.push(field);
          break;

        case FieldType.number:
          hasValueField = true;
          copy = {
            ...field,
            values: new ArrayVector(
              field.values.toArray().map((v) => {
                if (!(Number.isFinite(v) || v == null)) {
                  return null;
                }

                return v;
              })
            ),
          };

          fields.push(copy);
          break;
      }
    }

    if (hasTimeField && hasValueField) {
      frames.push({
        ...frame,
        fields,
      });
    }
  }

  return frames;
}

type ScaleFactors = {
  [n: number]: {
    min: number;
    max: number;
    factor: number;
  };
};

/**
 * Take sparse frame data and format for display with R3F.
 */
export function prepData(frames: DataFrame[], sceneScale: number, dataPointColor: string): PointData {
  const points = [],
    colors = [];
  let scaleFactors: ScaleFactors = {};

  // Create scaling factor to map data coordinates to
  // chart coords, assuming as single data frame (although that's silly)
  for (let frame of frames) {
    for (let i = 0; i < 3; i++) {
      let vals = frame.fields[i].values.toArray();
      const max = Math.max(...vals);
      const min = Math.min(...vals);

      scaleFactors[i] = {
        min: min,
        max: max,
        factor: (max - min) / sceneScale,
      };
    }
  }

  for (let frame of frames) {
    // TODO: Currently this is simply determing point location
    // by taking the first (sensible, i.e datetime or numeric) field as X, the second field as Y,
    // and the third avaiable field as Z
    for (let i = 0; i < frame.length; i++) {
      // Use the first three fields
      // At this point we should only have
      // DateTime fields and number fields
      for (let j = 0; j < 3; j++) {
        switch (frame.fields[j].type) {
          case FieldType.time:
          case FieldType.number:
            points.push(
              frame.fields[j].values.get(i) / scaleFactors[j].factor - scaleFactors[j].min / scaleFactors[j].factor
            );
            break;
        }
      }

      const normalizedColor: RGBColor = hexToRgb(dataPointColor);

      colors.push(normalizedColor.r);
      colors.push(normalizedColor.g);
      colors.push(normalizedColor.b);
    }
  }

  return { points: new Float32Array(points), colors: new Float32Array(colors) };
}

export function getIntervalLabels(frames: DataFrame[], sceneScale: number, labelInterval: number, dateFormat: string): IntervalLabels {
  const xLabels = [];
  const yLabels = [];
  const zLabels = [];
  const intervalFactor = Math.floor(sceneScale / labelInterval);

  for (let frame of frames) {
    const interval = Math.floor((frame.length - 1) / intervalFactor) === 0 ? 1 : Math.floor((frame.length - 1) / intervalFactor);

    const yLabelValues = [];
    const zLabelValues = [];

    for (let i = 0; i < frame.length; i += interval) {
      xLabels.push(moment(new Date(frame.fields[0].values.get(i))).format(dateFormat));

      const yVal = frame.fields[1].values.get(i) as number;
      const zVal = frame.fields[2].values.get(i) as number;

      if (yVal) {
        yLabelValues.push(yVal);        
      }

      if (zVal) {
        zLabelValues.push(zVal);
      }
    }

    yLabelValues.sort((a,b) => a - b);
    zLabelValues.sort((a,b) => a - b);

    for (let i = 0; i < yLabelValues.length; i++) {
      yLabels.push(yLabelValues[i] ? yLabelValues[i].toString() : "Empty value");
      zLabels.push(zLabelValues[i] ? zLabelValues[i].toString() : "Empty value");
    }
  }

  return { xLabels, yLabels, zLabels };
}

export function hexToRgb(hexColor: string): RGBColor {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

  if (result === null) {
    return { r: 1, g: 1, b: 1};
  }

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  return { r: r / 255, g: g / 255, b: b / 255};
}