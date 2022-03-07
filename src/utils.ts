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
export function prepare3DScatterPlotDisplayValues(series: DataFrame[], theme: GrafanaTheme2): DataFrame[] | null {
  let copy: Field;
  const frames: DataFrame[] = [];
  let hasTimeField = false, hasValueField = false;

  for (let frame of series) {
    const fields: Field[] = [];

    for (const field of frame.fields) {
      switch(field.type) {
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
            )
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

  if (frames.length) {
    return frames;
  }

  return null;
}

/**
 * Take sparse frame data and format for display with R3F.
 */
export function prepData(frames: DataFrame[] | null): PointData {
  let points = new Float32Array();
  let colors = new Float32Array();

  return { points, colors }
}