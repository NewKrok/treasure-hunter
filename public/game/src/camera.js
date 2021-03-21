import {
  Vector3,
  Raycaster,
  PerspectiveCamera,
} from "../build/three.module.js";

import AdventureTPSCamera from "./adventure-tps-camera.js";

const cameraColliders = [];

let adventureTPSCamera;
let perspectiveCamera;

export const createCamera = () => {
  perspectiveCamera = new PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  adventureTPSCamera = AdventureTPSCamera(perspectiveCamera);
};

export const registerCameraCollider = (collider) =>
  cameraColliders.push(collider);

export const updateCamera = (delta) => {
  if (adventureTPSCamera) {
    const userPos = adventureTPSCamera.getTarget().position.clone();
    userPos.y += 1;
    const vector = new Vector3(0, 0, 1);
    vector.applyQuaternion(getCamera().quaternion);
    const raycaster = new Raycaster(userPos, vector, 0, 10);
    const intersects = raycaster.intersectObjects(cameraColliders);

    if (intersects.length > 0) {
      let distance = 6;
      for (let i = 0; i < intersects.length; i++) {
        distance =
          intersects[i].distance < distance ? intersects[i].distance : distance;
        distance *= 0.9;
      }
      adventureTPSCamera?.setDistance(
        Math.min(Math.floor(distance * 1000) / 1000, 6)
      );
    } else adventureTPSCamera?.setDistance(6);

    adventureTPSCamera.update({ delta });
  }
};

export const updateCameraRatio = () => {
  perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
  perspectiveCamera.updateProjectionMatrix();
};

export const setCameraTarget = (target) => adventureTPSCamera.setTarget(target);

export const setCameraPosition = (position) =>
  perspectiveCamera.position.set(position.x, position.y, position.z);

export const updateTPSCameraRotation = ({ x, y }) =>
  adventureTPSCamera && adventureTPSCamera.update({ x, y });

export const getTPSCameraRotation = () => adventureTPSCamera.getRotation();

export const getCamera = () => perspectiveCamera;
