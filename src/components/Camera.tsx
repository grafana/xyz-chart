import { useThree } from '@react-three/fiber';
import OptionsContext from 'optionsContext';
import { useEffect, useContext } from 'react';
import { OrbitControls } from 'three-stdlib';
//import { ScatterPlotOptions } from 'types';

export const Camera = () => {
  const { camera, gl } = useThree();
  const { sceneScale } = useContext(OptionsContext);

  const cameraPos = [
    sceneScale * 1.4,
    sceneScale - sceneScale / 2,
    sceneScale * 1.4
  ] as const;
  camera.position.set(...cameraPos);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.minDistance = 3;
    controls.maxDistance = sceneScale * 2;
    controls.target.set(0, 0, 0);

    return () => {
      controls.dispose();
    };
  }, [camera, gl, sceneScale]);
  return null;
};
