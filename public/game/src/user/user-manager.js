import { AnimationId, AudioId } from "../../assets-config.js";
import { create } from "./user.js";
import { STATE } from "../../main.js";
import { getTPSCameraRotation } from "../../game-engine/camera/camera.js";
import {
  getAudioCache,
  playAudio,
  stopAudio,
} from "../../game-engine/audio/audio.js";
import { ParticleCollection } from "../effects/particle-system/particle-collection.js";
import { destroyParticleSystem } from "../effects/particle-system/particle-defaults.js";

const users = [];

let ownUser = null;
let syncData = null;
let _sharedData = null;

export const initUserManager = (world) => {
  const upVector = new CANNON.Vec3(0, 1, 0);
  world.addEventListener("postStep", (e) => {
    const now = Date.now();
    users.forEach((user) => {
      const { contactNormal } = user;
      const { id: objectId } = user.physics;

      let isOnGround = false;

      if (world.contacts.length > 0) {
        world.contacts.forEach((contact) => {
          if (isOnGround) return;

          if (contact.bi.id === objectId || contact.bj.id === objectId) {
            if (contact.bi.id === objectId) {
              contact.ni.negate(contactNormal);
            } else {
              contact.ni.copy(contactNormal);
            }
            isOnGround = contactNormal.dot(upVector) > 0.7;
          }
        });
      }
      if (isOnGround) user.lastOnGroundTime = now;
      user.isStanding =
        (now - user.lastOnGroundTime < 400 && !user.isJumpTriggered) ||
        isOnGround;
    });
  });
};

export const addUser = ({
  scene,
  id,
  name,
  position,
  rotation,
  isOwn,
  onComplete,
  sharedData,
  useDebugRender,
}) => {
  _sharedData = sharedData;
  if (users.find((user) => user.id == id)) {
    console.log(`Multiple user creation request for ${id}`);
    return null;
  } else {
    const user = create({
      id,
      name,
      position,
      rotation,
      isOwn,
      scene,
      useDebugRender,
      onComplete: (user) => {
        users.push(user);
        if (isOwn) ownUser = user;
        if (onComplete) onComplete(user);
      },
    });
  }
};

export const updateUsers = (delta) => {
  const now = Date.now();
  users.forEach((user) => {
    if (user.isOwn) {
      user.updatePositions();

      if (
        [
          AnimationId.WALK_PISTOL,
          AnimationId.PISTOL_STRAFE,
          AnimationId.WALK,
          AnimationId.WALK_BACK_PISTOL,
          AnimationId.RUN,
          AnimationId.SPRINT,
        ].includes(user.activeAnimation)
      ) {
        const { lastPlayedTime } = getAudioCache(AudioId.FootStep);
        if (now - lastPlayedTime > (4.75 / user.velocity) * 250) {
          playAudio({
            audioId: AudioId.FootStep,
            cacheId: AudioId.FootStep,
          });
          const effect = ParticleCollection.createStepEffect(
            user.object.position
          );
          user.object.parent.add(effect);
          setTimeout(() => destroyParticleSystem(effect), 500);
        }
      } else stopAudio(AudioId.FootStep);
    }
    if (user.mixer) {
      const { isStanding } = user;
      setAnimationAction({
        user,
        animation: user.isDead
          ? AnimationId.DIE
          : user.isSlashTriggered
          ? AnimationId.SLASH
          : user.isShootTriggered
          ? AnimationId.SHOOTING_PISTOL
          : user.useAim && (!user.moveBack || (user.moveBack && user.isSidling))
          ? user.velocity > 0
            ? user.isSidling
              ? user.sidlingDirection == 1
                ? AnimationId.PISTOL_STRAFE
                : AnimationId.PISTOL_STRAFE
              : AnimationId.WALK_PISTOL
            : AnimationId.AIM
          : user.isWeaponChangeTriggered
          ? AnimationId.CHANGE_WEAPON
          : user.isClimbingUp
          ? AnimationId.CLIMBING
          : now - user.climbEndTime < 500
          ? AnimationId.STANDING
          : user.isHanging && user.shimmyVelocity > 0
          ? AnimationId.SHIMMY_LEFT
          : user.isHanging && user.shimmyVelocity < 0
          ? AnimationId.SHIMMY_RIGHT
          : user.isHanging
          ? AnimationId.HANGING
          : !isStanding
          ? AnimationId.FALLING_IDLE
          : isStanding &&
            now - user.landingStartTime < 200 &&
            user.lastAction !== AnimationId.CLIMBING
          ? AnimationId.FALLING_LANDING
          : user.turn === 1
          ? AnimationId.TURN_LEFT
          : user.turn === -1
          ? AnimationId.TURN_RIGHT
          : user.velocity === 0
          ? user.isSidling
            ? user.sidlingDirection == 1
              ? AnimationId.SIDLE_LEFT
              : AnimationId.SIDLE_RIGHT
            : AnimationId.IDLE
          : (!user.useAim || (user.useAim && !user.moveBack)) &&
            user.velocity > 0
          ? user.velocity >= 3
            ? user.velocity >= 4
              ? AnimationId.SPRINT
              : AnimationId.RUN
            : AnimationId.WALK
          : user.velocity < -1 || user.moveBack
          ? user.useAim
            ? AnimationId.WALK_BACK_PISTOL
            : AnimationId.RUN_BACK
          : AnimationId.WALK_BACK,
        transitionTime: now - user.climbEndTime < 500 ? 0 : 0.15,
        loop:
          (!user.isWeaponChangeTriggered || user.velocity > 0 || user.useAim) &&
          !user.isClimbingUp &&
          !user.isDead &&
          now - user.climbEndTime > 300,
      });
      user.mixer.update(delta);
      user.updateLookAtRotation(
        user.useAim ? getTPSCameraRotation() : { y: Math.PI / 2 }
      );
      if (user.isJumpTriggered && !user.wasJumpTriggered) {
        user.jumpStartTime = now;
        user.wasJumpTriggered = true;
      }
      if (user.isSlashTriggered && !user.wasSlashTriggered) {
        user.slashStartTime = now;
        user.wasSlashTriggered = true;
      }
      if (user.isShootTriggered && !user.wasShootTriggered) {
        user.shootStartTime = now;
        user.wasShootTriggered = true;
      }
      if (user.isWeaponChangeTriggered && !user.wasWeaponChangeTriggered) {
        user.weaponChangeStartTime = now;
        user.wasWeaponChangeTriggered = true;
      }
      if (isStanding && !user.wasLanded) {
        user.wasLanded = true;
        user.landingStartTime = now;
        user.wasJumpTriggered = false;

        playAudio({ audioId: AudioId.Landing, cacheId: AudioId.Landing });

        const effect = ParticleCollection.createLandingEffect(
          user.object.position
        );
        user.object.parent.add(effect);
        setTimeout(() => destroyParticleSystem(effect), 1000);
      }
      if (!isStanding) user.wasLanded = false;
    }
    if (user.isHanging) {
      user.physics.velocity.set(0, 0, 0);
      user.physics.mass = 0;
    } else user.physics.mass = 5;
  });
};

export const syncUser = ({ id, position, rotation }) => {
  const user = users.find((user) => user.id === id);
  if (user && user.object) {
    const positionDiff = Math.sqrt(
      Math.pow(user.object.position.x - position.x, 2),
      Math.pow(user.object.position.z - position.z, 2)
    );

    if (positionDiff > 0.01)
      setAnimationAction({ user, animation: AnimationId.WALK });

    if (user.animationTimeout) clearTimeout(user.animationTimeout);
    if (user.positionTween) user.positionTween.kill();
    user.positionTween = gsap.to(user.object.position, {
      x: position.x,
      y: position.y - 1,
      z: position.z,
      duration: 0.2,
      ease: "linear",
      onComplete: () => {
        user.animationTimeout = setTimeout(() => {
          setAnimationAction({ user, animation: AnimationId.IDLE });
        }, 200);
      },
    });

    gsap.to(user, {
      targetRotation: rotation,
      duration: 0.2,
      ease: "linear",
      onUpdate: () => {
        var euler = new THREE.Euler(
          0 /* rotation.x */,
          rotation.y - Math.PI,
          rotation.z,
          "XYZ"
        );
        user.object.quaternion.setFromEuler(euler);
      },
    });
  }
};

const setAnimationAction = ({
  user,
  animation,
  transitionTime = 0.2,
  loop = true,
}) => {
  if (animation !== user.activeAnimation) {
    user.activeAnimation = animation;
    user.lastAction = user.activeAction;
    user.activeAction = user.animations[animation];
    if (user.lastAction) user.lastAction.fadeOut(transitionTime);
    user.activeAction.reset();
    user.activeAction.fadeIn(transitionTime);
    if (!loop) {
      user.activeAction.setLoop(THREE.LoopOnce);
      user.activeAction.clampWhenFinished = true;
    }
    user.activeAction.play();
  }
};

export const syncOwnUser = ({ serverCall, controls }) => {
  const now = Date.now();
  if (
    _sharedData.state !== STATE.WAITING_FOR_START &&
    ownUser &&
    (syncData === null || now - syncData.lastSyncTime > 25)
  ) {
    const currentPosition = {
      x: ownUser.physics.position.x.toFixed(1),
      y: ownUser.physics.position.y.toFixed(1),
      z: ownUser.physics.position.z.toFixed(1),
    };
    const direction = controls.getDirection();
    const currentRotation = {
      x: direction.x.toFixed(2),
      y: direction.y.toFixed(2),
      z: direction.z.toFixed(2),
    };
    if (
      syncData === null ||
      syncData.position.x !== currentPosition.x ||
      syncData.position.y !== currentPosition.y ||
      syncData.position.z !== currentPosition.z ||
      syncData.rotation.x !== currentRotation.x ||
      syncData.rotation.y !== currentRotation.y ||
      syncData.rotation.z !== currentRotation.z
    ) {
      syncData = {
        lastSyncTime: now,
        position: { ...currentPosition },
        rotation: { ...currentRotation },
      };

      serverCall({
        header: "updatePosition",
        data: {
          type: "user",
          ...syncData,
        },
      });
    }
  }
};

export const removeUser = ({ scene, id }) => {
  console.log(`Remove user with id ${id}`);
  var user = users.find(({ id }) => id === id);
  if (user) {
    scene.remove(user.mesh);
    scene.remove(user.objectContainer ? user.objectContainer.object : null);
  } else console.log(`Remove error, user not found`);

  users = users.filter(({ id }) => id !== id);
};

export const getOwnUser = () => ownUser;
export const getUsers = () => users;

export const setUserPosition = (pos) => {
  ownUser.physics.position.x = pos.x / 100;
  ownUser.physics.position.y = pos.y / 100;
  ownUser.physics.position.z = pos.z / 100;
};
