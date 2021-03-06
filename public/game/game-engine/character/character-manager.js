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

export const updateCharacters = (delta, navMeshes) => {
  const now = Date.now();
  characters.forEach((user) => {
    if (!user.command) {
      user.command = { isSteppCompleted: true };
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

    if (user.command.isSteppCompleted) {
      if (!user.command.path)
        user.command = {
          isSteppCompleted: false,
          type: "move",
          path: [
            "nav-mesh-2",
            "nav-mesh-3",
            "nav-mesh-4",
            "nav-mesh-5",
            "nav-mesh-6",
            "nav-mesh-7",
            "nav-mesh-8",
            "nav-mesh-9",
            "nav-mesh-10",
            "nav-mesh-11",
            "nav-mesh-10",
            "nav-mesh-9",
            "nav-mesh-8",
            "nav-mesh-7",
            "nav-mesh-6",
            "nav-mesh-5",
            "nav-mesh-4",
            "nav-mesh-3",
            "nav-mesh-2",
            "nav-mesh-1",
          ],
        };
      else {
        user.command = {
          isSteppCompleted: false,
          type: "move",
          path: user.command.path.slice(1),
        };
        if (user.command.path.length === 0) {
          user.command.path = [
            "nav-mesh-2",
            "nav-mesh-3",
            "nav-mesh-4",
            "nav-mesh-5",
            "nav-mesh-6",
            "nav-mesh-7",
            "nav-mesh-8",
            "nav-mesh-9",
            "nav-mesh-10",
            "nav-mesh-11",
            "nav-mesh-10",
            "nav-mesh-9",
            "nav-mesh-8",
            "nav-mesh-7",
            "nav-mesh-6",
            "nav-mesh-5",
            "nav-mesh-4",
            "nav-mesh-3",
            "nav-mesh-2",
            "nav-mesh-1",
          ];
        }
      }

      const navMesh = navMeshes.find((n) => n.id === user.command.path[0]);

      user.command.to = {
        x: navMesh.x + Math.random() * 1 - 0.5,
        z: navMesh.z + Math.random() * 1 - 0.5,
      };

      /*user.targetRotation =
          Math.atan2(
            user.physics.position.z - to.z,
            user.physics.position.x - to.x
          ) +
          Math.PI / 2;*/
      user.velocity = 1;
      /*const tweenValue = {
          x: user.physics.position.x,
          z: user.physics.position.z,
        };*/

      // let distanceX = to.x - user.physics.position.x;
      // let distanceY = to.z - user.physics.position.z;
      // let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      /*gsap.to(tweenValue, {
          x: to.x,
          z: to.z,
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
        });*/
    } else if (user.command && user.command.to && user.velocity != 0) {
      user.targetRotation =
        Math.atan2(
          user.physics.position.z - user.command.to.z,
          user.physics.position.x - user.command.to.x
        ) +
        Math.PI / 2;

      user.physics.position.vadd(
        new THREE.Vector3(
          delta * 1 * Math.cos(user.targetRotation + Math.PI / 2),
          0,
          delta * 1 * Math.sin(user.targetRotation + Math.PI / 2)
        ),
        user.physics.position
      );

      if (!user.command.isSteppCompleted) {
        let distanceX = user.command.to.x - user.physics.position.x;
        let distanceY = user.command.to.z - user.physics.position.z;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < 0.5) {
          user.velocity = 0;
          setTimeout(() => {
            user.command.isSteppCompleted = true;
          }, Math.random() * 1000);
        }
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
