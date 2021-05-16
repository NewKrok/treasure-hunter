import {
  Vector3,
  Raycaster,
  PerspectiveCamera,
} from "../../build/three.module.js";

import TPSCamera from "./tps-camera.js";

const cameraColliders = [];

let tpsCamera;
let perspectiveCamera;

export const createCamera = () => {
  perspectiveCamera = new PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  tpsCamera = TPSCamera(perspectiveCamera);

  return { perspectiveCamera, tpsCamera };
};

export const registerCameraCollider = (collider) =>
  cameraColliders.push(collider);

export const updateCamera = (delta) => {
  if (tpsCamera) {
    const targetPos = tpsCamera.getTarget()?.position.clone();
    if (targetPos) {
      targetPos.y += 1;
      const vector = new Vector3(0, 0, 1);
      vector.applyQuaternion(getCamera().quaternion);
      const raycaster = new Raycaster(targetPos, vector, 0, 10);
      const intersects = raycaster.intersectObjects(cameraColliders);

      if (intersects.length > 0) {
        let distance = 8;
        for (let i = 0; i < intersects.length; i++) {
          distance =
            intersects[i].distance < distance
              ? intersects[i].distance
              : distance;
          distance *= 0.9;
        }
        tpsCamera?.setDistance(Math.min(Math.floor(distance * 1000) / 1000, 8));
      } else tpsCamera?.setDistance(8);

      tpsCamera.update({ delta });
    }
  }
};

export const updateCameraRatio = () => {
  perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
  perspectiveCamera.updateProjectionMatrix();
};

export const setCameraTarget = (target) => tpsCamera.setTarget(target);

export const setCameraPosition = (position) =>
  perspectiveCamera.position.set(position.x, position.y, position.z);

export const updateTPSCameraRotation = ({ x, y }) =>
  tpsCamera && tpsCamera.update({ x, y });

export const getTPSCameraRotation = () => tpsCamera.getRotation();

export const getCamera = () => perspectiveCamera;
