import { getTPSCameraRotation } from "../camera.js";
import { unitControllerState } from "./unit-controller.js";

let currentTarget = null;
let climbableAreas = [];

export const setPlayerControllerTarget = (target) => (currentTarget = target);
export const addClimbableAreas = (areas) => (climbableAreas = areas);

export const updatePlayerController = ({ now, delta }) => {
  if (currentTarget) {
    const {
      isHanging,
      climbEndTime,
      viewRotation,
      physics,
      isJumpTriggered,
      isStanding,
      jumpStartTime,
    } = currentTarget;
    const { x, y, z } = currentTarget.object.position;

    if (isHanging) {
    } else {
      currentTarget.isClimbingUp = false;
      currentTarget.shimmyVelocity = 0;
      const cameraRotation = getTPSCameraRotation();

      if (now - climbEndTime > 400) {
        const verticalVelocity =
          Math.max(
            unitControllerState.backward.value,
            unitControllerState.forward.value
          ) *
          (unitControllerState.backward.value >
          unitControllerState.forward.value
            ? -1
            : 1);

        const horizontalVelocity =
          Math.max(
            unitControllerState.left.value,
            unitControllerState.right.value
          ) *
          (unitControllerState.left.value > unitControllerState.right.value
            ? 1
            : -1);

        const velocity =
          (unitControllerState.walk.pressed ? 1 : 4.5) *
          Math.max(
            unitControllerState.forward.value,
            unitControllerState.backward.value,
            unitControllerState.left.value,
            unitControllerState.right.value
          );
        let velocityMultiplier = 1;

        if (velocity !== 0) {
          let targetRotation =
            cameraRotation.x +
            Math.PI / 2 +
            Math.PI +
            Math.atan2(verticalVelocity, horizontalVelocity);
          let newViewRotation = viewRotation;
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
          currentTarget.viewRotation += diff * (delta / 0.1);
          currentTarget.targetRotation = targetRotation;

          physics.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            -currentTarget.viewRotation
          );

          let normalizedDiff = Math.abs(diff);
          normalizedDiff -= normalizedDiff > Math.PI ? Math.PI : 0;

          velocityMultiplier =
            normalizedDiff > 0.9 ? 0 : (Math.PI - normalizedDiff) / Math.PI;

          let relativeVector = new CANNON.Vec3(
            Math.sin(Math.PI * 2 - targetRotation) *
              velocity *
              velocityMultiplier *
              delta,
            0,
            Math.cos(Math.PI * 2 - targetRotation) *
              velocity *
              velocityMultiplier *
              delta
          );
          physics.position.vadd(relativeVector, physics.position);
        }

        currentTarget.velocity = velocity;
        currentTarget.turn = 0;

        if (
          unitControllerState.forward.pressed ||
          unitControllerState.backward.pressed
        ) {
          /* if (unitControllerState.left.pressed) {
            updateTPSCameraRotation({
              x:
                -0.01 *
                unitControllerState.left.value *
                (unitControllerState.forward.pressed ? 1 : -1),
            });
          } else if (unitControllerState.right.pressed) {
            updateTPSCameraRotation({
              x:
                0.01 *
                unitControllerState.right.value *
                (unitControllerState.forward.pressed ? 1 : -1),
            });
          } */
        } else {
          /*  if (unitControllerState.left.pressed) {
            updateTPSCameraRotation({
              x: -0.03 * unitControllerState.left.value,
            });
            users[0].turn = 1;
          } else if (unitControllerState.right.pressed) {
            updateTPSCameraRotation({
              x: 0.03 * unitControllerState.right.value,
            });
            users[0].turn = -1;
          } */
          // !!!!!! Sidling
          /* users[0].isSidling =
            unitControllerState.left.pressed ||
            unitControllerState.right.pressed;

          const sidlingVelocity = users[0].isStanding
            ? unitControllerState.walk.pressed
              ? unitControllerState.backward.pressed
                ? 0.5
                : 1.5
              : unitControllerState.backward.pressed
              ? 0.5
              : velocity === 0
              ? 2.5
              : 1.5
            : 2;
          let sidlingRelativeVector = 0;
          if (unitControllerState.left.pressed) {
            if (velocity !== 0 && adventureTPSCamera) {
              users[0].targetRotation +=
                (adventureTPSCamera.getXRotation() - users[0].targetRotation) /
                (delta * 1000);
              users[0].physics.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                -users[0].targetRotation
              );
            }

            sidlingRelativeVector = new CANNON.Vec3(
              sidlingVelocity * delta,
              0,
              0
            );
            users[0].sidlingDirection = 1;
            users[0].physics.quaternion.vmult(
              sidlingRelativeVector,
              sidlingRelativeVector
            );
            users[0].physics.position.vadd(
              sidlingRelativeVector,
              users[0].physics.position
            );
          } else if (unitControllerState.right.pressed) {
            sidlingRelativeVector = new CANNON.Vec3(
              -sidlingVelocity * delta,
              0,
              0
            );
            users[0].sidlingDirection = -1;
            users[0].physics.quaternion.vmult(
              sidlingRelativeVector,
              sidlingRelativeVector
            );
            users[0].physics.position.vadd(
              sidlingRelativeVector,
              users[0].physics.position
            );
          }*/
        }
      }

      if (isJumpTriggered && isStanding && now - jumpStartTime > 200) {
        currentTarget.isJumpTriggered = false;
      }

      const hangingInfo = climbableAreas.find(
        ({ area }) =>
          unitControllerState.jump.pressed &&
          now - users[0].cancelHangingTime > 200 &&
          x > area.x + area.min.x - 0.55 &&
          x < area.x + area.max.x + 0.55 &&
          y + 1.5 > area.y + area.min.y &&
          y + 1.5 < area.y + area.max.y &&
          z > area.z + area.min.z - 0.55 &&
          z < area.z + area.max.z + 0.55
      );
      currentTarget.climbingUpDirection = hangingInfo?.direction;
      currentTarget.isHanging = hangingInfo;

      if (hangingInfo) {
        physics.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 1, 0),
          (hangingInfo.direction * Math.PI) / 180
        );
      }
    }
  }
};
