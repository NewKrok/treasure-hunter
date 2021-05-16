import { getTPSCameraRotation } from "../../game-engine/camera/camera.js";
import {
  onUnitAction,
  UnitAction,
  unitActionState,
} from "./unit-action-manager.js";

const WeaponType = {
  Unarmed: 0,
  Machete: 1,
  Pistol: 2,
};

let currentTarget = null;
let climbableAreas = [];

let isMovementBlocked = false;
let selectedWeaponType = WeaponType.Unarmed;

const jumpForceDuringWalk = 8;
const jumpForceDuringRun = 10;

let stamina = 100;
const staminaRegenerationRatio = 20;
const jumpStaminaCost = 10;
const slashStaminaCost = 30;
const shootStaminaCost = 40;
const runStaminaCostRatio = 30;

const jumpTimeout = 200;
const slashTimeout = 1000;
const shootTimeout = 500;
const weaponChangeTimeout = 600;

let staminaBar = null;

export const setUnitControllerTarget = (target) => {
  currentTarget = target;

  onUnitAction({
    action: UnitAction.Jump,
    callback: () => {
      const now = Date.now();
      if (currentTarget.isStanding) {
        currentTarget.isStanding = false;
        currentTarget.isJumpTriggered = true;
        currentTarget.physics.velocity.y =
          stamina >= jumpStaminaCost
            ? unitActionState.run.pressed
              ? jumpForceDuringRun
              : jumpForceDuringWalk
            : (stamina / jumpStaminaCost) * jumpForceDuringWalk;
        stamina = Math.max(0, stamina - jumpStaminaCost);
      } else if (
        currentTarget.isHanging &&
        (!currentTarget.isClimbingUp ||
          (currentTarget.isClimbingUp &&
            now - currentTarget.climbStartTime < 1500))
      ) {
        currentTarget.isHanging = false;
        currentTarget.cancelHangingTime = now;
      }
    },
  });

  onUnitAction({
    action: UnitAction.Attack,
    callback: () => {
      if (
        currentTarget.isStanding &&
        !currentTarget.isSlashTriggered &&
        selectedWeaponType === WeaponType.Machete &&
        stamina >= slashStaminaCost
      ) {
        currentTarget.isSlashTriggered = true;
        stamina = Math.max(0, stamina - slashStaminaCost);
      } else if (
        currentTarget.isStanding &&
        !currentTarget.isShootTriggered &&
        selectedWeaponType === WeaponType.Pistol &&
        stamina >= shootStaminaCost
      ) {
        currentTarget.isShootTriggered = true;
        stamina = Math.max(0, stamina - shootStaminaCost);
      }
    },
  });

  onUnitAction({
    action: UnitAction.ChooseWeapon1,
    callback: () => {
      if (!currentTarget.isWeaponChangeTriggered) {
        setTimeout(() => {
          if (currentTarget) {
            if (selectedWeaponType !== WeaponType.Machete) {
              selectedWeaponType = WeaponType.Machete;
              currentTarget.useMachete();
            } else {
              selectedWeaponType = WeaponType.Unarmed;
              currentTarget.useUnarmed();
            }
          }
        }, 300);
        currentTarget.isWeaponChangeTriggered = true;
      }
    },
  });

  onUnitAction({
    action: UnitAction.ChooseWeapon2,
    callback: () => {
      if (!currentTarget.isWeaponChangeTriggered) {
        setTimeout(() => {
          if (currentTarget) {
            if (selectedWeaponType !== WeaponType.Pistol) {
              selectedWeaponType = WeaponType.Pistol;
              currentTarget.usePistol();
            } else {
              selectedWeaponType = WeaponType.Unarmed;
              currentTarget.useUnarmed();
            }
          }
        }, 300);
        currentTarget.isWeaponChangeTriggered = true;
      }
    },
  });
};

export const addClimbableAreas = (areas) => (climbableAreas = areas);

export const updateUnitController = ({ now, delta }) => {
  if (currentTarget) {
    const {
      isHanging,
      climbEndTime,
      viewRotation,
      physics,
      isJumpTriggered,
      isStanding,
      jumpStartTime,
      wasSlashTriggered,
      isSlashTriggered,
      slashStartTime,
      wasShootTriggered,
      isShootTriggered,
      shootStartTime,
      wasWeaponChangeTriggered,
      isWeaponChangeTriggered,
      weaponChangeStartTime,
    } = currentTarget;
    const { x, y, z } = currentTarget.object.position;

    isMovementBlocked =
      isSlashTriggered || isShootTriggered || isWeaponChangeTriggered;

    if (isHanging) {
    } else {
      currentTarget.isClimbingUp = false;
      currentTarget.shimmyVelocity = 0;
      const cameraRotation = getTPSCameraRotation();

      if (now - climbEndTime > 400) {
        const verticalVelocity =
          Math.max(
            unitActionState.backward.value,
            unitActionState.forward.value
          ) *
          (unitActionState.backward.value > unitActionState.forward.value
            ? -1
            : 1);

        const horizontalVelocity =
          Math.max(unitActionState.left.value, unitActionState.right.value) *
          (unitActionState.left.value > unitActionState.right.value ? 1 : -1);

        const velocity =
          (stamina > 0 && unitActionState.run.pressed ? 4.5 : 2) *
          Math.max(
            unitActionState.forward.value,
            unitActionState.backward.value,
            unitActionState.left.value,
            unitActionState.right.value
          );
        let velocityMultiplier = 1;

        if (!isMovementBlocked && velocity !== 0) {
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
          if (selectedWeaponType != WeaponType.Unarmed)
            velocityMultiplier *= 0.9;

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

        stamina = Math.min(100, stamina + staminaRegenerationRatio * delta);
        if (unitActionState.run.pressed && velocity !== 0)
          stamina = Math.max(0, stamina - runStaminaCostRatio * delta);
        if (staminaBar) staminaBar.style.width = `${stamina}%`;
        else staminaBar = document.querySelector("#stamina-bar");

        if (
          unitActionState.forward.pressed ||
          unitActionState.backward.pressed
        ) {
          /* if (unitActionState.left.pressed) {
            updateTPSCameraRotation({
              x:
                -0.01 *
                unitActionState.left.value *
                (unitActionState.forward.pressed ? 1 : -1),
            });
          } else if (unitActionState.right.pressed) {
            updateTPSCameraRotation({
              x:
                0.01 *
                unitActionState.right.value *
                (unitActionState.forward.pressed ? 1 : -1),
            });
          } */
        } else {
          /*  if (unitActionState.left.pressed) {
            updateTPSCameraRotation({
              x: -0.03 * unitActionState.left.value,
            });
            users[0].turn = 1;
          } else if (unitActionState.right.pressed) {
            updateTPSCameraRotation({
              x: 0.03 * unitActionState.right.value,
            });
            users[0].turn = -1;
          } */
          // !!!!!! Sidling
          /* users[0].isSidling =
            unitActionState.left.pressed ||
            unitActionState.right.pressed;

          const sidlingVelocity = users[0].isStanding
            ? unitActionState.walk.pressed
              ? unitActionState.backward.pressed
                ? 0.5
                : 1.5
              : unitActionState.backward.pressed
              ? 0.5
              : velocity === 0
              ? 2.5
              : 1.5
            : 2;
          let sidlingRelativeVector = 0;
          if (unitActionState.left.pressed) {
            if (velocity !== 0 && tpsCamera) {
              users[0].targetRotation +=
                (tpsCamera.getXRotation() - users[0].targetRotation) /
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
          } else if (unitActionState.right.pressed) {
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

      if (isJumpTriggered && isStanding && now - jumpStartTime > jumpTimeout) {
        currentTarget.isJumpTriggered = false;
      }

      if (
        isSlashTriggered &&
        wasSlashTriggered &&
        now - slashStartTime > slashTimeout
      ) {
        currentTarget.wasSlashTriggered = false;
        currentTarget.isSlashTriggered = false;
      }

      if (
        isShootTriggered &&
        wasShootTriggered &&
        now - shootStartTime > shootTimeout
      ) {
        currentTarget.wasShootTriggered = false;
        currentTarget.isShootTriggered = false;
      }

      if (
        isWeaponChangeTriggered &&
        wasWeaponChangeTriggered &&
        now - weaponChangeStartTime > weaponChangeTimeout
      ) {
        currentTarget.wasWeaponChangeTriggered = false;
        currentTarget.isWeaponChangeTriggered = false;
      }

      const hangingInfo = climbableAreas.find(
        ({ area }) =>
          unitActionState.jump.pressed &&
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
