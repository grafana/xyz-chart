import React from "react";
import { Direction } from "types";
import { Axis } from "./Axis";
import { Grid } from "./Grid";

export const PlotScene = () => {
  // const theme = useTheme();
  // const styles = getStyles();
  return (
    <group>
      <Grid direction={Direction.Up} size={10} gridInterval={1} />
      <Grid direction={Direction.Right} size={10} gridInterval={1} />
      <Grid direction={Direction.Forward} size={10} gridInterval={1} />
      <Axis direction={Direction.Up} size={10} />
      <Axis direction={Direction.Right} size={10} />
      <Axis direction={Direction.Forward} size={10} />
    </group>
  );
};