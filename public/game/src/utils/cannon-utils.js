import * as THREE from "../../build/three.module.js";

export function CreateTrimesh(geometry) {
  if (!geometry.attributes) {
    geometry = new THREE.BufferGeometry().fromGeometry(geometry);
  }
  const vertices = geometry.attributes.position.array;
  const indices = Object.keys(vertices).map(Number);
  return new CANNON.Trimesh(vertices, indices);
}

export function CreateConvexPolyhedron(geometry) {
  if (!geometry.vertices) {
    geometry = new THREE.Geometry().fromBufferGeometry(geometry);
    geometry.mergeVertices();
    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
  }
  const points = geometry.vertices.map(function (v) {
    return new CANNON.Vec3(v.x, v.y, v.z);
  });
  const faces = geometry.faces.map(function (f) {
    return [f.a, f.b, f.c];
  });

  return new CANNON.ConvexPolyhedron(points, faces);
}

export function offsetCenterOfMass(body, centreOfMass) {
  body.shapeOffsets.forEach(function (offset) {
    centreOfMass.vadd(offset, centreOfMass);
  });
  centreOfMass.scale(1 / body.shapes.length, centreOfMass);
  body.shapeOffsets.forEach(function (offset) {
    offset.vsub(centreOfMass, offset);
  });
  const worldCenterOfMass = new CANNON.Vec3();
  body.vectorToWorldFrame(centreOfMass, worldCenterOfMass);
  body.position.vadd(worldCenterOfMass, body.position);
}

export const rotateOnAxis = (rigidBody, axis, radians) => {
  var rotationQuaternion = new CANNON.Quaternion();
  rotationQuaternion.setFromAxisAngle(axis, radians);
  rigidBody.quaternion = rotationQuaternion.mult(rigidBody.quaternion);
};

export const createColliderByObject = ({ object, material }) => {
  object.geometry.computeBoundingBox();
  var bb = object.geometry.boundingBox;
  var object3DWidth = bb.max.x - bb.min.x;
  var object3DHeight = bb.max.y - bb.min.y;
  var object3DDepth = bb.max.z - bb.min.z;
  const halfExtents = new CANNON.Vec3(
    object3DWidth / 2,
    object3DHeight / 2,
    object3DDepth / 2
  );
  const box = new CANNON.Box(halfExtents);
  const body = new CANNON.Body({
    mass: 0,
    material,
  });
  body.addShape(box);
  body.position.copy(
    new CANNON.Vec3(object.position.x, object.position.y, object.position.z)
  );
  body.quaternion.copy(object.quaternion);

  return body;
};
