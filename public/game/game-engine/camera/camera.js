import {
  Vector3,
  Raycaster,
  PerspectiveCamera,
} from "../../build/three.module.js";

import TPSCamera from "./tps-camera.js";

const cameraColliders = [];

let tpsCamera;
let perspectiveCamera;
let isAimZoomEnabled = false;

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
      const maxDistance = isAimZoomEnabled ? 1.2 : 8;
      const raycaster = new Raycaster(targetPos, vector, 0, maxDistance);
      const intersects = raycaster.intersectObjects(cameraColliders);

      if (intersects.length > 0) {
        let distance = maxDistance;
        for (let i = 0; i < intersects.length; i++) {
          distance =
            intersects[i].distance < distance
              ? intersects[i].distance
              : distance;
          distance *= 0.9;
        }
        tpsCamera?.setDistance(
          Math.min(Math.floor(distance * 1000) / 1000, maxDistance),
          false
        );
      } else tpsCamera?.setDistance(maxDistance);

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

export const useAimZoom = () => {
  if (tpsCamera) {
    isAimZoomEnabled = true;
    tpsCamera.setPositionOffset(new Vector3(0, 0.2, -0.4));
    tpsCamera.setYBoundaries({ max: 2.1 });
  }
};

export const disableAimZoom = () => {
  if (tpsCamera) {
    isAimZoomEnabled = false;
    tpsCamera.setPositionOffset(new Vector3(0, 0, 0));
    tpsCamera.setYBoundaries({ max: 2.7 });
  }
};

export const getTPSCameraRotation = () => tpsCamera.getRotation();
export const getCamera = () => perspectiveCamera;
