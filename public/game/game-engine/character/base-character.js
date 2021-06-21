import { AnimationMixer, Vector3 } from "../../build/three.module.js";
import { getAnimation, getFBXModel } from "../assets/assets.js";
import {
  characterContactMaterial,
  getPhysicsWorld,
} from "../../src/physics/physics.js";
import { getUniqueNumber } from "../utils/token.js";
import { staticConfig } from "../../static-config.js";

export const CharacterPosition = {
  HeadEnd: "HeadEnd",
  HandRight: "HandRight",
  Hips: "Hips",
  Spine: "Spine",
};

export const createCharacter = ({
  position,
  rotation,
  scene,
  onComplete,
  config,
}) => {
  const id = getUniqueNumber();
  const characterSockets = {};
  const animations = [];

  let body = null;

  const model = getFBXModel(config.model);
  model.scale.set(config.scale, config.scale, config.scale);
  model.position.set(position.x, position.y, position.z);
  scene.add(model);

  if (staticConfig.useDebugRenderer) scene.add(new THREE.SkeletonHelper(model));

  const mixer = new AnimationMixer(model);

  const addAnimation = (key) => {
    const anim = getAnimation(key);
    const animClip = mixer.clipAction(anim);
    animations[key] = animClip;
  };
  Object.keys(config.animations).forEach((key) =>
    addAnimation(config.animations[key])
  );

  model.traverse((child) => {
    switch (child.name) {
      case "Head_end":
      case "mixamorigHeadTop_End":
        characterSockets[CharacterPosition.HeadEnd] = child;
        break;

      case "Hand_R":
      case "mixamorigRightHand":
        characterSockets[CharacterPosition.HandRight] = child;
        break;

      case "Hips":
      case "mixamorigHips":
        characterSockets[CharacterPosition.Hips] = child;
        break;

      case "Spine_01":
      case "mixamorigSpine1":
        characterSockets[CharacterPosition.Spine] = child;
        break;

      default:
    }
  });

  config.attachments.forEach((attachment) => {
    const model = getFBXModel(attachment.model);
    model.scale.set(attachment.scale, attachment.scale, attachment.scale);
    model.position.copy(attachment.offset);
    model.rotation.x = attachment.rotation.x;
    model.rotation.y = attachment.rotation.y;
    model.rotation.z = attachment.rotation.z;

    characterSockets[attachment.target].add(model);
    characterSockets[attachment.target].attach(model);
  });

  const shape = new CANNON.Sphere(config.radius);
  body = new CANNON.Body({
    mass: config.mass,
    material: characterContactMaterial,
  });
  body.addShape(shape);
  setTimeout(() => body.position.set(position.x, position.y, position.z), 1000);
  body.quaternion.setFromEuler(0, rotation, 0, "XYZ");
  body.linearDamping = 0.9;
  body.fixedRotation = true;
  body.updateMassProperties();
  window.requestAnimationFrame(() => getPhysicsWorld().add(body));

  if (onComplete)
    onComplete({
      id,
      position,
      model,
      calculateBoundingBox: () => ({
        minX: model.position.x - 0.1,
        maxX: model.position.x + 0.1,
        minY: model.position.y - 0,
        maxY: model.position.y + 0.5,
        minZ: model.position.z - 0.1,
        maxZ: model.position.z + 0.1,
      }),
      config,
      physics: body,
      mixer,
      isDead: false,
      hasAnimation: true,
      activeAnimation: "",
      animations,
      velocity: 0,
      turn: 0,
      isHanging: false,
      shimmyVelocity: 0,
      isSidling: false,
      sidlingDirection: 0,
      isClimbingUp: false,
      canClimbUp: true,
      climbStartTime: 0,
      climbEndTime: 0,
      climbingUpDirection: 0,
      cancelHangingTime: 0,
      contactNormal: new CANNON.Vec3(0, 0, 0),
      lastOnGroundTime: 0,
      isStanding: false,
      isJumpTriggered: false,
      wasJumpTriggered: false,
      jumpStartTime: 0,
      wasLanded: false,
      landingStartTime: 0,
      viewRotation: 0,
      targetRotation: 0,
      updatePositions: () => {
        model.position.set(
          body.position.x,
          body.position.y - config.radius,
          body.position.z
        );
        model.quaternion.set(
          body.quaternion.x,
          body.quaternion.y,
          body.quaternion.z,
          body.quaternion.w
        );
      },
      updateLookAtRotation: (rotation) => {
        //spine.rotation.x = rotation.y - Math.PI / 2;
      },
    });
};
