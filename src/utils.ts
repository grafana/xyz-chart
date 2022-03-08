import { BufferGeometry, Vector3 } from 'three';
import { DataFrame, GrafanaTheme2, Field, FieldType, ArrayVector } from '@grafana/data';
import { PointData } from 'types';

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
export function prepData(frames: DataFrame[]): PointData {
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
        factor: (max - min) / 10, // Currently scaled to 10
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

      colors.push(1);
      colors.push(0.5);
      colors.push(0.5);
    }
  }

  return { points: new Float32Array(points), colors: new Float32Array(colors) };
}
