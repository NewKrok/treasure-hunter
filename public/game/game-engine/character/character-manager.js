import { AnimationId } from "../../assets-config.js";
import { createCharacter } from "./base-character.js";

const characters = [];

export const spawnCharacter = (props) => {
  createCharacter({
    ...props,
    onComplete: (character) => {
      props.onComplete(character);
      characters.push(character);
    },
  });
};

export const updateCharacters = (delta) => {
  const now = Date.now();
  characters.forEach((user) => {
    user.updatePositions();

    if (user.mixer) {
      const { isStanding } = user;
      /* setAnimationAction({
        user,
        animation: AnimationId.SKELETON_IDLE,
        transitionTime: now - user.climbEndTime < 500 ? 0 : 0.15,
        loop:
          (!user.isWeaponChangeTriggered || user.velocity > 0 || user.useAim) &&
          !user.isClimbingUp &&
          !user.isDead &&
          now - user.climbEndTime > 300,
      });*/
      user.mixer.update(delta);
      /*user.updateLookAtRotation(
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
      if (!isStanding) user.wasLanded = false;*/
    }
    if (user.isHanging) {
      user.physics.velocity.set(0, 0, 0);
      user.physics.mass = 0;
    } else user.physics.mass = 5;
  });
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
