import { DataFrame, Field, FieldMatcher, FieldType, getFieldDisplayName } from '@grafana/data';
// import { XYFieldMatchers } from '@grafana/ui/src/components/GraphNG/types';

import { XYZDimensionConfig } from './models.gen';

//TODO temporary till we move inside grafana core and import it from above
export interface XYFieldMatchers {
  x: FieldMatcher; // first match
  y: FieldMatcher;
  z: FieldMatcher;
}

export enum DimensionError {
  NoData,
  BadFrameSelection,
  XNotFound,
}

export interface XYZDimensions {
  frame: DataFrame; // matches order from configs, excluds non-graphable values
  x: Field;
  error?: DimensionError;
}

export function isGraphable(field: Field) {
  return field.type === FieldType.number || field.type === FieldType.time;
}

export function getXYZDimensions(cfg?: XYZDimensionConfig, data?: DataFrame[]): XYZDimensions {
  if (!data || !data.length) {
    return { error: DimensionError.NoData } as XYZDimensions;
  }
  if (!cfg) {
    cfg = {
      frame: 0,
    };
  }

  let frame = data[cfg.frame ?? 0];
  if (!frame) {
    return { error: DimensionError.BadFrameSelection } as XYZDimensions;
  }

  let xIndex = -1;
  for (let i = 0; i < frame.fields.length; i++) {
    const f = frame.fields[i];
    if (cfg.x && cfg.x === getFieldDisplayName(f, frame, data)) {
      xIndex = i;
      break;
    }
    if (isGraphable(f) && !cfg.x) {
      xIndex = i;
      break;
    }
  }

  const x = frame.fields[xIndex];
  const fields: Field[] = [x];
  for (const f of frame.fields) {
    if (f === x || !isGraphable(f)) {
      continue;
    }
    fields.push(f);
  }

  return {
    x,
    frame: {
      ...frame,
      fields,
    },
  };
}