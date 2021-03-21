export const intersect = (a, b) =>
  a.minX <= b.maxX &&
  a.maxX >= b.minX &&
  a.minY <= b.maxY &&
  a.maxY >= b.minY &&
  a.minZ <= b.maxZ &&
  a.maxZ >= b.minZ;

export const calculateBoundingBox = (mesh) => {
  var bbox = new THREE.Box3().setFromObject(mesh);

  return {
    minX: bbox.min.x,
    maxX: bbox.max.x,
    minY: bbox.min.y,
    maxY: bbox.max.y,
    minZ: bbox.min.z,
    maxZ: bbox.max.z,
  };
};

export const rotateObjectOnAxis = (object, axis, radians) => {
  var rotationQuaternion = new THREE.Quaternion();
  rotationQuaternion.setFromAxisAngle(axis, radians);
  object.quaternion.copy(rotationQuaternion.multiply(object.quaternion));
};

export const toScreenPosition = ({ object, camera, canvas }) => {
  var vector = new THREE.Vector3();

  var widthHalf = 0.5 * canvas.width;
  var heightHalf = 0.5 * canvas.height;

  object.updateMatrixWorld();
  vector.setFromMatrixPosition(object.matrixWorld);
  vector.project(camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;

  return {
    x: vector.x,
    y: vector.y,
  };
};
