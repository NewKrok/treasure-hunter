import { FBXLoader } from "../../lib/jsm/loaders/FBXLoader.js";
import { AnimationMixer } from "../../build/three.module.js";
import {
  getAnimation,
  getFBXModel,
  getTexture,
} from "../../game-engine/assets/assets.js";
import { AnimationId, FBXModelId, TextureId } from "../../assets-config.js";
import { characterContactMaterial } from "../physics/physics.js";

export const create = ({
  id,
  name,
  position,
  rotation,
  isOwn,
  scene,
  onComplete,
  useDebugRender,
}) => {
  console.log(`Create user for ${id}`);
  let body = null;
  let activeAction = null;

  const objLoader = new FBXLoader();
  const animations = [];

  const hat = getFBXModel(FBXModelId.Hat1);
  hat.scale.set(0.0095, 0.0095, 0.0095);
  hat.position.y -= 0.05;
  hat.position.z -= 0.06;
  hat.rotation.x = -0.6;

  const macheteInHand = getFBXModel(FBXModelId.Machete);
  macheteInHand.visible = false;
  macheteInHand.scale.set(0.007, 0.007, 0.007);
  macheteInHand.position.x = 0.06;
  macheteInHand.position.y = 0.06;
  macheteInHand.position.z = 0.04;
  macheteInHand.rotation.x = -Math.PI / 2;
  macheteInHand.rotation.y = -Math.PI / 2;
  macheteInHand.rotation.z = Math.PI / 2;
  const attachedMachete = getFBXModel(FBXModelId.Machete);
  attachedMachete.scale.set(0.007, 0.007, 0.007);
  attachedMachete.position.x = 0.2;
  attachedMachete.position.y = 0.06;
  attachedMachete.position.z = 0.04;
  attachedMachete.rotation.x = Math.PI / 1.5;
  attachedMachete.rotation.y = 0.2;
  attachedMachete.rotation.z = 0;

  const pistolInHand = getFBXModel(FBXModelId.Pistol);
  pistolInHand.visible = false;
  pistolInHand.scale.set(0.01, 0.01, 0.01);
  pistolInHand.position.x = -0.05;
  pistolInHand.position.y = 0.08;
  pistolInHand.position.z = 0.05;
  pistolInHand.rotation.x = -Math.PI / 3;
  pistolInHand.rotation.y = 0;
  pistolInHand.rotation.z = Math.PI / 2;
  const attachedPistol = getFBXModel(FBXModelId.Pistol);
  attachedPistol.scale.set(0.01, 0.01, 0.01);
  attachedPistol.position.x = 0.19;
  attachedPistol.position.y = 0.1;
  attachedPistol.position.z = 0;
  attachedPistol.rotation.x = Math.PI / 2;
  attachedPistol.rotation.y = 0;
  attachedPistol.rotation.z = 0;

  objLoader.load(
    "./game/game-assets/3d/characters/adventurer-1.fbx",
    (object) => {
      object.scale.set(0.007, 0.007, 0.007);
      object.position.set(position.x, position.y, position.z);

      object.traverse((child) => {
        if (child.isMesh) {
          child.material.map = getTexture(TextureId.AdventurerTexture);
          child.castShadow = true;
        }
        if (child.name === "Head_end") {
          child.add(hat);
          child.attach(hat);
        }
        if (child.name === "Thumb_01001") {
          child.add(macheteInHand);
          child.add(pistolInHand);
        }
        if (child.name === "Hips") {
          child.add(attachedMachete);
          child.add(attachedPistol);
        }
      });

      if (useDebugRender) {
        const helper = new THREE.SkeletonHelper(object);
        scene.add(helper);
      }

      scene.add(object);

      const mixer = new AnimationMixer(object);

      const addAnimation = (key) => {
        const anim = getAnimation(key);
        const animClip = mixer.clipAction(anim);
        animations[key] = animClip;
      };

      addAnimation(AnimationId.WALK);
      addAnimation(AnimationId.WALK_BACK);
      addAnimation(AnimationId.WALK_CROUCH);
      addAnimation(AnimationId.WALK_PISTOL);
      addAnimation(AnimationId.RUN);
      addAnimation(AnimationId.SPRINT);
      addAnimation(AnimationId.RUN_BACK);
      addAnimation(AnimationId.IDLE);
      addAnimation(AnimationId.FALLING_IDLE);
      addAnimation(AnimationId.FALLING_LANDING);
      addAnimation(AnimationId.HANGING);
      addAnimation(AnimationId.SHIMMY_LEFT);
      addAnimation(AnimationId.SHIMMY_RIGHT);
      addAnimation(AnimationId.CLIMBING);
      addAnimation(AnimationId.STANDING);
      addAnimation(AnimationId.VICTORY);
      addAnimation(AnimationId.DIE);
      addAnimation(AnimationId.SIDLE_LEFT);
      addAnimation(AnimationId.SIDLE_RIGHT);
      addAnimation(AnimationId.TURN_LEFT);
      addAnimation(AnimationId.TURN_RIGHT);
      addAnimation(AnimationId.SLASH);
      addAnimation(AnimationId.SHOOTING_PISTOL);
      addAnimation(AnimationId.CHANGE_WEAPON);

      activeAction = animations[AnimationId.IDLE];
      activeAction.reset();
      activeAction.play();
      scene.add(object);

      const mass = 5;
      const radius = 0.3;
      const shape = new CANNON.Sphere(radius);
      body = new CANNON.Body({
        mass: mass,
        material: characterContactMaterial,
      });
      body.addShape(shape);
      setTimeout(
        () => body.position.set(position.x, position.y, position.z),
        1000
      );
      body.quaternion.setFromEuler(0, rotation, 0, "XYZ");
      body.linearDamping = 0.9;
      body.fixedRotation = true;
      body.updateMassProperties();

      const resetAssetVisibilities = () => {
        attachedPistol.visible = true;
        attachedMachete.visible = true;
        pistolInHand.visible = false;
        macheteInHand.visible = false;
      };

      if (onComplete)
        onComplete({
          isOwn,
          id,
          name,
          position,
          object: object,
          calculateBoundingBox: () => ({
            minX: object.position.x - 0.1,
            maxX: object.position.x + 0.1,
            minY: object.position.y - 0,
            maxY: object.position.y + 0.5,
            minZ: object.position.z - 0.1,
            maxZ: object.position.z + 0.1,
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
          useMachete: () => {
            resetAssetVisibilities();
            macheteInHand.visible = true;
            attachedMachete.visible = false;
          },
          usePistol: () => {
            resetAssetVisibilities();
            pistolInHand.visible = true;
            attachedPistol.visible = false;
          },
          useUnarmed: resetAssetVisibilities,
          updatePositions: () => {
            object.position.set(
              body.position.x,
              body.position.y - 0.3,
              body.position.z
            );
            object.quaternion.set(
              body.quaternion.x,
              body.quaternion.y,
              body.quaternion.z,
              body.quaternion.w
            );
          },
        });
    }
  );
};
