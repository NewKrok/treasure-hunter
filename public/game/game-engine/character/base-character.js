import { AnimationMixer } from "../../build/three.module.js";
import { getAnimation, getFBXModel } from "../assets/assets.js";
import { AnimationId } from "../../assets-config.js";
import { characterContactMaterial } from "../../src/physics/physics.js";
import { getUniqueNumber } from "../utils/token.js";

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

  let body = null;
  let activeAction = null;

  const animations = [];

  const model = getFBXModel(config.model);
  model.scale.set(config.scale, config.scale, config.scale);
  model.position.set(position.x, position.y, position.z);

  scene.add(model);

  const mixer = new AnimationMixer(model);

  const addAnimation = (key) => {
    const anim = getAnimation(key);
    const animClip = mixer.clipAction(anim);
    animations[key] = animClip;
  };

  addAnimation(AnimationId.SKELETON_IDLE);
  addAnimation(AnimationId.SKELETON_WALK);
  addAnimation(AnimationId.SKELETON_RUN);

  activeAction = animations[AnimationId.SKELETON_IDLE];
  activeAction.reset();
  activeAction.play();
  scene.add(model);

  const mass = 5;
  const radius = 0.3;
  const shape = new CANNON.Sphere(radius);
  body = new CANNON.Body({
    mass: mass,
    material: characterContactMaterial,
  });
  body.addShape(shape);
  setTimeout(() => body.position.set(position.x, position.y, position.z), 1000);
  body.quaternion.setFromEuler(0, rotation, 0, "XYZ");
  body.linearDamping = 0.9;
  body.fixedRotation = true;
  body.updateMassProperties();

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
          body.position.y - 0.3,
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
