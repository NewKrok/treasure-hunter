export const updateCharacterAnimation = ({ delta, now, user }) => {
  if (user.mixer) {
    const {
      velocity,
      useAim,
      climbEndTime,
      isWeaponChangeTriggered,
      isClimbingUp,
      isDead,
      config: { animations },
    } = user;
    setAnimationAction({
      user,
      animation:
        velocity === 0
          ? animations.idle
          : velocity >= 3
          ? animations.run
          : animations.walk,
      transitionTime: now - climbEndTime < 500 ? 0 : 0.15,
      loop:
        (!isWeaponChangeTriggered || velocity > 0 || useAim) &&
        !isClimbingUp &&
        !isDead &&
        now - climbEndTime > 300,
    });
    user.mixer.update(delta);
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
