import { BufferGeometry, Vector3 } from "three";

export function createLineGeometry(startVec: Vector3, endVec: Vector3): BufferGeometry {
  const points = [];

  points.push(startVec);
  points.push(endVec);

  return new BufferGeometry().setFromPoints(points);
}