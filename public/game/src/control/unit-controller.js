import { AudioId } from "../../assets-config.js";
import { Vector3 } from "../../build/three.module.js";
import { playAudio } from "../../game-engine/audio/audio.js";
import {
  getTPSCameraRotation,
  useAimZoom,
  disableAimZoom,
  getCamera,
} from "../../game-engine/camera/camera.js";
import { ParticleCollection } from "../effects/particle-system/particle-collection.js";
import { destroyParticleSystem } from "../effects/particle-system/particle-defaults.js";
import { shoot } from "../user/bullet-manager.js";
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

const speed = 3;
const runningSpeed = 4.75;

const jumpForceDuringWalk = 8;
const jumpForceDuringRun = 10;

let stamina = 100;
const staminaRegenerationRatio = 20;
const jumpStaminaCost = 10;
const slashStaminaCost = 30;
const shootStaminaCost = 15;
const runStaminaCostRatio = 30;

const jumpTimeout = 200;
const slashTimeout = 1000;
const shootTimeout = 500;
const weaponChangeTimeout = 600;

let staminaBar = null;
let crosshairs = null;

const clearAimState = () => {
  disableAimZoom();
  currentTarget.useAim = false;
};

export const setUnitControllerTarget = ({ target, physicsWorld }) => {
  currentTarget = target;

  onUnitAction({
    action: UnitAction.Jump,
    callback: () => {
      if (!currentTarget.isShootTriggered) {
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
          playAudio({
            audioId: AudioId.Jump,
            cacheId: AudioId.Jump,
          });
        } else if (
          currentTarget.isHanging &&
          (!currentTarget.isClimbingUp ||
            (currentTarget.isClimbingUp &&
              now - currentTarget.climbStartTime < 1500))
        ) {
          currentTarget.isHanging = false;
          currentTarget.cancelHangingTime = now;
        }
        clearAimState();
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

        setTimeout(() => {
          playAudio({
            audioId: AudioId.MacheteAttack,
            cacheId: AudioId.MacheteAttack,
          });
        }, 250);
      } else if (
        currentTarget.isStanding &&
        currentTarget.useAim &&
        !currentTarget.isShootTriggered &&
        selectedWeaponType === WeaponType.Pistol &&
        stamina >= shootStaminaCost
      ) {
        currentTarget.isShootTriggered = true;
        stamina = Math.max(0, stamina - shootStaminaCost);

        setTimeout(() => {
          var position = new Vector3();
          position
            .copy(new Vector3(0, 0, 1))
            .applyQuaternion(currentTarget.pistolInHand.quaternion);
          position = currentTarget.pistolInHand
            .getWorldPosition(new Vector3())
            .add(new Vector3(0, -0.2, 0))
            .add(position.multiplyScalar(0.3));
          var rotation = currentTarget.object.rotation.y - Math.PI / 2;
          var direction =
            currentTarget.object.rotation.x === 0
              ? Math.PI * 2 - rotation
              : rotation;
          const effect = ParticleCollection.createShootEffect({
            position,
            direction,
          });
          currentTarget.object.parent.add(effect);
          setTimeout(() => destroyParticleSystem(effect), 1000);

          shoot({
            user: currentTarget,
            bulletStartPosition: position,
            camera: getCamera(),
            physicsWorld,
            scene: currentTarget.object.parent,
          });
        }, 200);
      }
    },
  });

  const choosePistol = () => {
    if (!currentTarget.isWeaponChangeTriggered) {
      setTimeout(() => {
        if (currentTarget) {
          if (selectedWeaponType !== WeaponType.Pistol) {
            selectedWeaponType = WeaponType.Pistol;
            currentTarget.usePistol();

            playAudio({
              audioId: AudioId.ChangeToPistol,
              cacheId: AudioId.ChangeToPistol,
            });
          } else {
            selectedWeaponType = WeaponType.Unarmed;
            currentTarget.useUnarmed();
            clearAimState();
          }
        }
      }, 500);
      if (selectedWeaponType === WeaponType.Pistol) {
        playAudio({
          audioId: AudioId.ChangeToPistol,
          cacheId: AudioId.ChangeToPistol,
        });
      }
      currentTarget.isWeaponChangeTriggered = true;
    }
  };

  onUnitAction({
    action: UnitAction.Aim,
    callback: () => {
      if (currentTarget.isStanding) {
        const zoom = () => {
          currentTarget.useAim = !currentTarget.useAim;
          if (currentTarget.useAim) useAimZoom();
          else clearAimState();
          playAudio({
            audioId: AudioId.Aim,
            cacheId: AudioId.Aim,
          });
        };

        if (selectedWeaponType !== WeaponType.Pistol) {
          choosePistol();
          setTimeout(zoom, 500);
        } else zoom();
      }
    },
  });

  onUnitAction({
    action: UnitAction.ChooseWeapon1,
    callback: () => {
      if (!currentTarget.isWeaponChangeTriggered && currentTarget.isStanding) {
        setTimeout(() => {
          if (currentTarget) {
            if (selectedWeaponType !== WeaponType.Machete) {
              selectedWeaponType = WeaponType.Machete;
              currentTarget.useMachete();
              clearAimState();
              playAudio({
                audioId: AudioId.ChangeToMachete,
                cacheId: AudioId.ChangeToMachete,
              });
            } else {
              selectedWeaponType = WeaponType.Unarmed;
              currentTarget.useUnarmed();
              clearAimState();
            }
          }
        }, 300);
        if (selectedWeaponType === WeaponType.Machete) {
          playAudio({
            audioId: AudioId.ChangeToMachete,
            cacheId: AudioId.ChangeToMachete,
          });
        }
        currentTarget.isWeaponChangeTriggered = true;
      }
    },
  });

  onUnitAction({
    action: UnitAction.ChooseWeapon2,
    callback: () => {
      if (!currentTarget.isWeaponChangeTriggered && currentTarget.isStanding) {
        choosePistol();
      }
    },
  });
};

export const addClimbableArea = (area) => climbableAreas.push(area);

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
      useAim,
      cancelHangingTime,
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
          (stamina > 0 && unitActionState.run.pressed ? runningSpeed : speed) *
          Math.max(
            unitActionState.forward.value,
            unitActionState.backward.value,
            unitActionState.left.value,
            unitActionState.right.value
          );
        let velocityMultiplier = 1;

        if ((!isMovementBlocked && velocity !== 0) || useAim) {
          let targetRotation = useAim
            ? cameraRotation.x
            : cameraRotation.x +
              Math.PI / 2 +
              Math.PI +
              (velocity === 0 && useAim
                ? Math.PI / 2
                : Math.atan2(verticalVelocity, horizontalVelocity));
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

          let noramalizedTargetRotation = Math.PI * 2 - targetRotation;
          let relativeVector;

          currentTarget.moveBack = unitActionState.backward.value > 0;

          if (useAim) {
            currentTarget.isSidling =
              unitActionState.left.pressed || unitActionState.right.pressed;
            let rotationOffset = 0;

            if (unitActionState.left.value)
              rotationOffset =
                unitActionState.forward.value > 0
                  ? Math.PI / 4
                  : unitActionState.backward.value > 0
                  ? Math.PI + -Math.PI / 4
                  : Math.PI / 2;
            else if (unitActionState.right.value)
              rotationOffset =
                unitActionState.forward.value > 0
                  ? -Math.PI / 4
                  : unitActionState.backward.value > 0
                  ? Math.PI + Math.PI / 4
                  : -Math.PI / 2;
            else if (unitActionState.backward.value) rotationOffset = Math.PI;

            currentTarget.sidlingDirection = unitActionState.left.value
              ? 1
              : unitActionState.right.value
              ? -1
              : 0;
            relativeVector = new CANNON.Vec3(
              Math.sin(noramalizedTargetRotation + rotationOffset) *
                velocity *
                velocityMultiplier *
                delta,
              0,
              Math.cos(noramalizedTargetRotation + rotationOffset) *
                velocity *
                velocityMultiplier *
                delta
            );
          } else {
            relativeVector = new CANNON.Vec3(
              Math.sin(noramalizedTargetRotation) *
                velocity *
                velocityMultiplier *
                delta,
              0,
              Math.cos(noramalizedTargetRotation) *
                velocity *
                velocityMultiplier *
                delta
            );
          }
          if (!isMovementBlocked)
            physics.position.vadd(relativeVector, physics.position);
        }

        currentTarget.velocity = velocity;
        currentTarget.turn = 0;

        stamina = Math.min(100, stamina + staminaRegenerationRatio * delta);
        if (unitActionState.run.pressed && velocity !== 0)
          stamina = Math.max(0, stamina - runStaminaCostRatio * delta);
        if (staminaBar) staminaBar.style.width = `${stamina}%`;
        else staminaBar = document.querySelector("#stamina-bar");

        if (crosshairs) crosshairs.style.opacity = currentTarget.useAim ? 1 : 0;
        else crosshairs = document.querySelector("#crosshairs");
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

      const hangingInfo = climbableAreas.find(({ area }) => {
        /*if (Math.random() > 0.99)
          console.log(
            unitActionState.jump.pressed,
            now - cancelHangingTime > 200,
            x > area.x + area.min.x - 0.55,
            x < area.x + area.max.x + 0.55,
            y + 1.5 > area.y + area.min.y,
            y + 1.5 < area.y + area.max.y,
            z > area.z + area.min.z - 0.55,
            z < area.z + area.max.z + 0.55,
            unitActionState.jump.pressed &&
              now - cancelHangingTime > 200 &&
              x > area.x + area.min.x - 0.55 &&
              x < area.x + area.max.x + 0.55 &&
              y + 1.5 > area.y + area.min.y &&
              // y + 1.5 < area.y + area.max.y &&
          //z > area.z + area.min.z - 0.55 && 
              z < area.z + area.max.z + 0.55
          );*/
        return (
          unitActionState.jump.pressed &&
          now - cancelHangingTime > 200 &&
          x > area.x + area.min.x - 0.55 &&
          x < area.x + area.max.x + 0.55 &&
          y + 1.5 > area.y + area.min.y &&
          /* y + 1.5 < area.y + area.max.y &&
          z > area.z + area.min.z - 0.55 && */
          z < area.z + area.max.z + 0.55
        );
      });
      currentTarget.climbingUpDirection = hangingInfo?.direction;
      currentTarget.isHanging = hangingInfo;

      if (hangingInfo) {
        physics.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 1, 0),
          (hangingInfo.direction * Math.PI) / 180
        );

        switch (hangingInfo.direction) {
          case 90:
            physics.position.x = hangingInfo.area.x;
            physics.position.y = hangingInfo.area.y - 1.4;
            break;

          case 180:
            //physics.position.z = hangingInfo.area.z + 0.5;
            break;

          default:
        }
      }
    }
  }
};
