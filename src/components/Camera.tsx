import { useThree } from "@react-three/fiber";
import { SCENE_SCALE } from "consts";
import { useEffect } from "react";
import { OrbitControls } from "three-stdlib";

export const Camera = () => {
  const { camera, gl } = useThree();
  camera.position.set(SCENE_SCALE * 1.4, SCENE_SCALE - SCENE_SCALE / 2,SCENE_SCALE * 1.4);
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 3;
      controls.maxDistance = SCENE_SCALE * 2;
      controls.target.set(0, 0, 0);

      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};