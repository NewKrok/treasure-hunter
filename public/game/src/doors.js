import { Vector3 } from "../build/three.module.js";

import { AudioId, MaterialId } from "../assets-config.js";
import { getAudio, getMaterial } from "../game-engine/assets/assets.js";
import { registerCameraCollider } from "../game-engine/camera/camera.js";
import { groundContactMaterial } from "./physics/physics.js";
import { createColliderByObject } from "./utils/cannon-utils.js";

const doors = {};

const openDoor = (door) => {
  door.isOpen = true;
  door.button.position.y -= 0.05;
  door.leftDoorCollider.quaternion.set(door.leftDoor.quaternion);
  door.rightDoorCollider.quaternion.set(door.rightDoor.quaternion);

  const leftDoorTweenParams = { rotation: 0, zPosition: 0, xPosition: 0 };
  const originalLeftPosition = door.leftDoorCollider.position.clone();
  const originalRightPosition = door.rightDoorCollider.position.clone();
  gsap.to(leftDoorTweenParams, {
    rotation: Math.PI / 2,
    zPosition: 0.75,
    xPosition: -0.75,
    duration: 6,
    onUpdate: () => {
      door.leftDoor.quaternion.setFromAxisAngle(
        new Vector3(0, 1, 0),
        leftDoorTweenParams.rotation
      );

      door.leftDoorCollider.quaternion.setFromAxisAngle(
        new Vector3(0, 1, 0),
        leftDoorTweenParams.rotation
      );

      door.leftDoorCollider.position.z =
        originalLeftPosition.z + leftDoorTweenParams.zPosition;

      door.leftDoorCollider.position.x =
        originalLeftPosition.x + leftDoorTweenParams.xPosition;

      door.rightDoor.quaternion.setFromAxisAngle(
        new Vector3(0, 1, 0),
        -leftDoorTweenParams.rotation
      );

      door.rightDoorCollider.quaternion.setFromAxisAngle(
        new Vector3(0, 1, 0),
        -leftDoorTweenParams.rotation
      );

      door.rightDoorCollider.position.z =
        originalRightPosition.z - leftDoorTweenParams.zPosition;

      door.rightDoorCollider.position.x =
        originalRightPosition.x + leftDoorTweenParams.xPosition;
    },
  });
};

export const updateDoors = (user) => {
  Object.keys(doors).forEach((key) => {
    const door = doors[key];
    if (
      !door.isOpen &&
      door?.switch?.position.distanceTo(user.object.position) < 0.5
    ) {
      const switchSoundFx = getAudio(AudioId.Switch);
      if (switchSoundFx.isPlaying) switchSoundFx.stop();
      switchSoundFx.play();

      openDoor(door);
    }
  });
};

export const registerDoorElement = ({ element, physicsWorld }) => {
  element.castShadow = true;
  element.material = getMaterial(MaterialId.Cartoon, element.material.map);

  const id = element.name.split("-")[1];
  if (element.name.includes("switch")) {
    doors[id] = {
      ...doors[id],
      switch: element,
      isOpen: false,
    };
  } else if (element.name.includes("button")) {
    doors[id] = {
      ...doors[id],
      button: element,
    };
  } else {
    element.geometry.computeBoundingBox();
    const collider = createColliderByObject({
      object: element,
      material: groundContactMaterial,
    });
    var elementSize = new THREE.Box3().setFromObject(element).getSize();
    physicsWorld.add(collider);
    registerCameraCollider(element);

    if (element.name.includes("left")) {
      collider.position.y += elementSize.y / 2;
      collider.position.z += -elementSize.x / 2 - 0.15;
      doors[id] = {
        ...doors[id],
        leftDoorCollider: collider,
        leftDoor: element,
      };
    } else if (element.name.includes("right")) {
      collider.position.y += elementSize.y / 2;
      collider.position.z += elementSize.x / 2 + 0.15;
      doors[id] = {
        ...doors[id],
        rightDoorCollider: collider,
        rightDoor: element,
      };
    }
  }
};
