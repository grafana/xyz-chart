import { LABEL_INTERVAL, SCENE_SCALE } from "consts";
import React from "react";
import { Direction } from "types";
import { Grid } from "./Grid";

export const PlotScene = () => {
  // const theme = useTheme();
  // const styles = getStyles();

  const size = SCENE_SCALE;
  const gridInterval = LABEL_INTERVAL;

  return (
    <group>
      <Grid direction={Direction.Up} size={size} gridInterval={gridInterval} />
      <Grid direction={Direction.Right} size={size} gridInterval={gridInterval} />
      <Grid direction={Direction.Forward} size={size} gridInterval={gridInterval} />
    </group>
  );
};