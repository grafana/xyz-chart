import React from 'react';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import OptionsContext from 'optionsContext';
import { useEffect, useContext } from 'react';
import { Vector3 } from '@react-three/fiber';
import { OrbitControls, MapControls } from 'three-stdlib';
import { CameraOptions } from 'types';

interface Props {
  cameraOpts: CameraOptions;
}

export const Camera: React.FC<Props> = ({cameraOpts}) => {
  const { camera, gl } = useThree();
  const { sceneScale } = useContext(OptionsContext);
  const midpoint = sceneScale - sceneScale / 2;
  const isOrtho = cameraOpts.type === "orthographic";
  let cameraPos: Vector3;
  let lookAt: Vector3;

  if (isOrtho) {
    switch (cameraOpts.viewPlane) {
      case "x":
        cameraPos = [midpoint, midpoint, sceneScale * 3];
        lookAt = [midpoint, midpoint, 0];
        break;
      case "y":
        cameraPos = [sceneScale * 3, midpoint, midpoint];
        lookAt = [0, midpoint, midpoint];
        break;
      case "z":
        cameraPos = [midpoint, sceneScale, midpoint];
        lookAt = [midpoint, 0, midpoint];
        break;
      default:
        cameraPos = [midpoint, midpoint, sceneScale];
        lookAt = [midpoint, midpoint, 0];
        break;
    }
    
  }
  else {
    cameraPos = [
      sceneScale * 1.4,
      sceneScale - sceneScale / 2,
      sceneScale * 1.4
    ];

    lookAt = [0, 0, 0];
  }

  useEffect(() => {
    let controls: OrbitControls | MapControls | null = null;

    if (isOrtho) {
      controls = new MapControls(camera, gl.domElement);
      
      // @ts-ignore
      camera.position.set(...cameraPos);
      // @ts-ignore
      controls.target.set(...lookAt);
      controls.update();
    }
    else {
      controls = new OrbitControls(camera, gl.domElement);
      controls.minDistance = 3;
      controls.maxDistance = sceneScale * 2;

      // @ts-ignore
      camera.position.set(...cameraPos);
      // @ts-ignore
      controls.target.set(...lookAt);
      controls.update();
    }
    
    return () => {
      if (controls !== null) {
        controls.dispose();
      }
    };
  }, [camera, gl, sceneScale, cameraOpts]);

  return (
    <>
      <PerspectiveCamera fov={ 75 } makeDefault={ !isOrtho } />
      <OrthographicCamera zoom={ 3.5 } makeDefault={ isOrtho } />
    </>
  );
};
