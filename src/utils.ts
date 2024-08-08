import { DataFrame, Field, FieldType, ArrayVector, getFieldDisplayName, toDataFrame } from '@grafana/data';
import { IntervalLabels, PointData, RGBColor } from 'types';
//eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import { COLOR_PICKER_OPTIONS, DATE_FORMAT, LABEL_INTERVAL, SCENE_SCALE } from 'consts';
import { XYZSeriesConfig, XYZDimensionConfig } from 'models.gen';

export function preparePlotByDims(series: DataFrame[], dimensions: XYZDimensionConfig[]): DataFrame[] {
  if (!series.length || !dimensions) {
    return [];
  }

  let frames: DataFrame[] = [];

  for (const dim of dimensions) {
    const dims = {
      frame: dim.frame ?? 0,
      x: dim.x ?? null,
    };

    let copy: Field;
    const fields: Field[] = [];

    let xField: Field | null = null;

    for (const field of series[dims.frame].fields) {
      const name = getFieldDisplayName(field, series[dims.frame], series);

      if (name === dims.x) {
        xField = field;
        continue;
      }

      if (dims.x === null && [FieldType.time, FieldType.number].includes(field.type)) {
        xField = field;
        dims.x = name;
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
      frames.push(toDataFrame({}));
      continue;
    }

    frames.push({
      ...series[dims.frame],
      fields: [xField, ...fields],
    });
  }

  return frames;
}

export function preparePlotByExplicitSeries(series: DataFrame[], explicitSeries: XYZSeriesConfig[]): DataFrame[] {
  if (!series.length || !explicitSeries) {
    return [];
  }

  const frames: DataFrame[] = [];
  let copy: Field;

  let xField: Field | null = null;
  let yField: Field | null = null;
  let zField: Field | null = null;

  for (let i = 0; i < series.length; i++) {
    for (const field of series[i].fields) {
      const name = getFieldDisplayName(field, series[i], series);

      let f: Field | null = null;

      switch (field.type) {
        case FieldType.time:
          f = field;
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

          f = copy;
          break;
      }

      if (!f) {
        continue;
      }

      if (name === explicitSeries[i].x) {
        xField = f;
      }

      if (name === explicitSeries[i].y) {
        yField = f;
      }

      if (name === explicitSeries[i].z) {
        zField = f;
      }
    }

    if (!xField || !yField || !zField) {
      frames.push(toDataFrame({}));
      continue;
    }

    frames.push({
      ...series[i],
      fields: [xField, yField, zField],
    });
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

interface FrameOptions {
  pointColor: string;
  pointSize: number;
}

/**
 * Take sparse frame data and format for display with R3F.
 */
export function prepData(frames: DataFrame[], frameOptions: FrameOptions[]): PointData[] {
  const boundaryFrame = createBoundaryDataFrame(frames);

  // TODO: add support for multiple frames
  // Also, at this moment, we assume that the first 3 fields of a frame are supported types and use those to plot.
  // Having a frame with more fields, where some fields are not supported (e.g: string), will result in a broken chart.

  // Create scaling factor to map data coordinates to
  // chart coords, assuming as single data frame (although that's silly)
  let factor: ScaleFactors = {}

  if (boundaryFrame.fields.length < 3) {
    return [{ points: new Float32Array(), colors: new Float32Array() }];
  }

  for (let i = 0; i < 3; i++) {
    let vals = boundaryFrame.fields[i].values.toArray();
    const max = Math.max(...vals);
    const min = Math.min(...vals);

    factor[i] = {
      min: min,
      max: max,
      factor: (max - min) / SCENE_SCALE === 0 ? 1 : (max - min) / SCENE_SCALE,
    };
  }

  const pointsArr = [];

  for (let x = 0; x < frames.length; x ++) {
    const points = [],
      colors = [];
    // TODO: Currently this is simply determing point location
    // by taking the first (sensible, i.e datetime or numeric) field as X, the second field as Y,
    // and the third avaiable field as Z
    for (let i = 0; i < frames[x].length; i++) {
      // Use the first three fields
      // At this point we should only have
      // DateTime fields and number fields
      for (let j = 0; j < 3; j++) {
        switch (frames[x].fields[j].type) {
          case FieldType.time:
          case FieldType.number:
            points.push(
              frames[x].fields[j].values.get(i) / factor[j].factor - factor[j].min / factor[j].factor
            );
            break;
        }
      }

      const normalizedColor: RGBColor = hexToRgb(frameOptions[x].pointColor);

      colors.push(normalizedColor.r);
      colors.push(normalizedColor.g);
      colors.push(normalizedColor.b);
    }

    pointsArr.push({ points: new Float32Array(points), colors: new Float32Array(colors) });
  }

  return pointsArr;
}

// this is used for intervals and scaling now that we have multiple frame
// support. Not the best solution, but it works for now.
// We're creating a dataframe with high/low values for each axis
function createBoundaryDataFrame(frames: DataFrame[]): DataFrame {
  if (frames.length === 0) {
    return toDataFrame({});
  }

  if (frames.length === 1) {
    return frames[0];
  }

  const boundaryFrame = frames[0];
  const fields: Field[] = [];

  let highestXValue = 0;
  let highestYValue = 0;
  let highestZValue = 0;
  let lowestXValue = Infinity;
  let lowestYValue = Infinity;
  let lowestZValue = Infinity;

  for (let frame of frames) { 
    const xVals = frame.fields[0].values.toArray();
    const yVals = frame.fields[1].values.toArray();
    const zVals = frame.fields[2].values.toArray();

    const xMax = Math.max(...xVals);
    const yMax = Math.max(...yVals);
    const zMax = Math.max(...zVals);

    const xMin = Math.min(...xVals);
    const yMin = Math.min(...yVals);
    const zMin = Math.min(...zVals);

    if (xMax > highestXValue) {
      highestXValue = xMax;
    }

    if (yMax > highestYValue) {
      highestYValue = yMax;
    }

    if (zMax > highestZValue) {
      highestZValue = zMax;
    }

    if (xMin < lowestXValue) {
      lowestXValue = xMin;
    }

    if (yMin < lowestYValue) {
      lowestYValue = yMin;
    }

    if (zMin < lowestZValue) {
      lowestZValue = zMin;
    }
  }

  fields.push({ name: 'x', type: FieldType.number, values: new ArrayVector([lowestXValue, highestXValue]), config: {} });
  fields.push({ name: 'y', type: FieldType.number, values: new ArrayVector([lowestYValue, highestYValue]), config: {} });
  fields.push({ name: 'z', type: FieldType.number, values: new ArrayVector([lowestZValue, highestZValue]), config: {} });

  return {
    ...boundaryFrame,
    fields,
  };
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
  const frame = createBoundaryDataFrame(frames);

  if (frame.fields.length < 3) {
    return { xLabels, yLabels, zLabels };
  }

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
    return { r: 1, g: 1, b: 1 };
  }

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  return { r: r / 255, g: g / 255, b: b / 255 };
}

export function convertTextColorToHex(color: string): string {
  if (color[0] === '#') {
    return color;
  }

  return COLOR_PICKER_OPTIONS[color];
}
