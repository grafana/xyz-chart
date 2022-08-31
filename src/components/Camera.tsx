import React from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { Vector3 } from '@react-three/fiber';
import { OrbitControls, MapControls } from 'three-stdlib';
import { SCENE_SCALE } from 'consts';
import { HUD } from './HUD';
import { HoveredPoint } from 'types';

interface HUDProps {
  hoveredPoint: HoveredPoint | null;
}

export const Camera: React.FC<HUDProps> = ({ hoveredPoint }) => {
  const { camera, gl } = useThree();
  // const { sceneScale } = useContext(OptionsContext);
  const sceneScale = SCENE_SCALE;
  let cameraPos: Vector3;
  let lookAt: Vector3;

  cameraPos = [
    sceneScale * 1.4,
    sceneScale - sceneScale / 2,
    sceneScale * 1.4
  ];

  lookAt = [0, 0, 0];

  useEffect(() => {
    let controls: OrbitControls | MapControls | null = null;

    controls = new OrbitControls(camera, gl.domElement);
      controls.minDistance = 3;
      controls.maxDistance = sceneScale * 2;

      // @ts-ignore
      camera.position.set(...cameraPos);
      // @ts-ignore
      controls.target.set(...lookAt);
      controls.update();
    
    return () => {
      if (controls !== null) {
        controls.dispose();
      }
    };
  }, [camera, gl, sceneScale]);

  return (
    <PerspectiveCamera fov={ 75 }>
      {/* { hoveredPoint !== null && <HUD hoveredPoint={ hoveredPoint } /> } */}
    </PerspectiveCamera> 
  );
};