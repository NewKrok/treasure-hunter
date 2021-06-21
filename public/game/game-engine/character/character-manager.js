import { createCharacter } from "./base-character.js";
import { updateCharacterAnimation } from "./character-animation.js";

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
    if (!user.command) {
      user.command = { to: { x: 0, z: 0 } };
      user.viewRotation = 0;
    }

    let targetRotation = user.targetRotation;
    if (user.physics && targetRotation) {
      let newViewRotation = user.viewRotation;
      if (newViewRotation < 0) newViewRotation += Math.PI * 2;
      let diff = targetRotation - newViewRotation;

      while (Math.abs(diff) > Math.PI) {
        if (targetRotation < newViewRotation) {
          if (targetRotation === 0) targetRotation = Math.PI * 2;
          else targetRotation += Math.PI * 2;

          if (targetRotation >= Math.PI * 4) {
            targetRotation -= Math.PI * 4;
            newViewRotation -= Math.PI * 4;
          }
        } else {
          newViewRotation += Math.PI * 2;
        }
        diff = targetRotation - newViewRotation;
      }
      user.viewRotation += diff * (delta / 0.2);

      user.physics.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0, 1, 0),
        -user.viewRotation
      );
    }

    if (!user.lastCommandTime || now - user.lastCommandTime > 5000) {
      if (!user.lastCommandTime) {
        user.lastCommandTime = now;
      } else {
        user.lastCommandTime = now;
        user.command = {
          type: "move",
          to: {
            x: user.physics.position.x + Math.random() * 10 - 5,
            z: user.physics.position.z + Math.random() * 10 - 5,
          },
        };
        user.targetRotation =
          Math.atan2(
            user.physics.position.z - user.command.to.z,
            user.physics.position.x - user.command.to.x
          ) +
          Math.PI / 2;
        user.velocity = 2;
        const tweenValue = {
          x: user.physics.position.x,
          z: user.physics.position.z,
        };

        let distanceX = user.command.to.x - user.physics.position.x;
        let distanceY = user.command.to.z - user.physics.position.z;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        gsap.to(tweenValue, {
          x: user.command.to.x,
          z: user.command.to.z,
          duration: distance / user.velocity,
          ease: "linear",
          onUpdate: () => {
            user.physics.position.vadd(
              new THREE.Vector3(
                tweenValue.x - user.physics.position.x,
                0,
                tweenValue.z - user.physics.position.z
              ),
              user.physics.position
            );
          },
          onComplete: () => {
            user.velocity = 0;
          },
        });
      }
    }
    user.updatePositions();

    updateCharacterAnimation({ delta, now, user });

    if (user.isHanging) {
      user.physics.velocity.set(0, 0, 0);
      user.physics.mass = 0;
    } else user.physics.mass = 5;
  });
};
