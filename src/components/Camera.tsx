import { useThree } from '@react-three/fiber';
import OptionsContext from 'optionsContext';
import { useEffect, useContext } from 'react';
import { OrbitControls } from 'three-stdlib';
import { ScatterPlotOptions } from 'types';

export const Camera = () => {
  const { camera, gl } = useThree();
  const options: ScatterPlotOptions = useContext(OptionsContext);

  camera.position.set(options.sceneScale * 1.4, options.sceneScale - options.sceneScale / 2, options.sceneScale * 1.4);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.minDistance = 3;
    controls.maxDistance = options.sceneScale * 2;
    controls.target.set(0, 0, 0);

    return () => {
      controls.dispose();
    };
  }, [camera, gl, options]);
  return null;
};
