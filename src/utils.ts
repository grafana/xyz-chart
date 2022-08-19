import { BufferGeometry, Vector3 } from 'three';
import { DataFrame, GrafanaTheme2, Field, FieldType, ArrayVector, getFieldDisplayName } from '@grafana/data';
import { IntervalLabels, PointData, RGBColor } from 'types';
import moment from 'moment';
import { COLOR_PICKER_OPTIONS, DATE_FORMAT, LABEL_INTERVAL, SCENE_SCALE } from 'consts';
import { XYZDimensionConfig } from 'models.gen';

export function createLineGeometry(startVec: Vector3, endVec: Vector3): BufferGeometry {
  const points = [];

  points.push(startVec);
  points.push(endVec);

  return new BufferGeometry().setFromPoints(points);
}

/**
 * Take data frames and identify and time and value fields stripping other fields.
 */
export function prepare3DScatterPlotDisplayValues(series: DataFrame[], dims: XYZDimensionConfig, theme: GrafanaTheme2): DataFrame[] {
  if (!series.length) {
    return [];
  }

  const dimensions = {
    frame: dims?.frame ?? 0,
    x: dims?.x ?? null,
  }


  let copy: Field;
  const fields: Field[] = [];

  let xField: Field | null = null;

  for (const field of series[dimensions.frame].fields) {
    const name = getFieldDisplayName(field, series[dimensions.frame], series);

    if (name === dimensions.x || dimensions.x === null) {
      xField = field;

      if (dimensions.x === null) {
        dimensions.x = name;
      }

      continue;
    }

    switch (field.type) {
      case FieldType.time:
        fields.push(field);
        break;

      case FieldType.number:
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

  if (!xField) {
    return [];
  }

  const frame: DataFrame = {
    ...series[dimensions.frame],
    fields: [
      xField,
      ...fields
    ],
  };

  console.log(frame);

  return [frame];
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
export function prepData(frames: DataFrame[], dataPointColor: string): PointData {
  const points = [],
    colors = [];
  let scaleFactors: ScaleFactors = {};

  // Create scaling factor to map data coordinates to
  // chart coords, assuming as single data frame (although that's silly)
  for (let frame of frames) {
    if (frame.fields.length < 3) {
      return{ points: new Float32Array(), colors: new Float32Array() };
    }


    for (let i = 0; i < 3; i++) {
      let vals = frame.fields[i].values.toArray();
      const max = Math.max(...vals);
      const min = Math.min(...vals);

      scaleFactors[i] = {
        min: min,
        max: max,
        factor: (max - min) / SCENE_SCALE,
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

export function getIntervalLabels(frames: DataFrame[]): IntervalLabels {
  const xLabels: string[] = [];
  const yLabels: string[] = [];
  const zLabels: string[] = [];
  const intervalFactor = Math.floor(SCENE_SCALE / LABEL_INTERVAL);

  if (frames.length === 0) {
    return { xLabels, yLabels, zLabels };
  }

  //build labels based on first frame
  const frame = frames[0]

  const xVals = frame.fields[0].values.toArray();
  const yVals = frame.fields[1].values.toArray();
  const zVals = frame.fields[2].values.toArray();

  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const xFactor = (xMax - xMin) / intervalFactor;

  const yMin = Math.min(...yVals);
  const yMax = Math.max(...yVals);
  const yFactor = (yMax - yMin) / intervalFactor;

  const zMin = Math.min(...zVals);
  const zMax = Math.max(...zVals);
  const zFactor = (zMax - zMin) / intervalFactor;

  for (let i = 0; i < intervalFactor; i++) {
    if (frame.fields[0].type === FieldType.time) {   
      xLabels.push(moment.unix((xMin + i * xFactor) / 1000).format(DATE_FORMAT));
    } else {
      xLabels.push((xMin + i * xFactor).toFixed(2));
    }

    yLabels.push((yMin + i * yFactor).toFixed(2));
    zLabels.push((zMin + i * zFactor).toFixed(2));
  }

  if (frame.fields[0].type === FieldType.time) {      
    xLabels.push(moment.unix(xMax / 1000).format(DATE_FORMAT));
  } else {
    xLabels.push(xMax.toFixed(2));
  }

  yLabels.push(yMax.toFixed(2));
  zLabels.push(zMax.toFixed(2));

  return { xLabels, yLabels, zLabels };
}

export function hexToRgb(hexColor: string): RGBColor {
  const color = convertTextColorToHex(hexColor);

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

  if (result === null) {
    return { r: 1, g: 1, b: 1};
  }

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  return { r: r / 255, g: g / 255, b: b / 255};
}

export function convertTextColorToHex(color: string): string {
  if (color[0] == '#') {
    return color;
  }

  return COLOR_PICKER_OPTIONS[color];
}