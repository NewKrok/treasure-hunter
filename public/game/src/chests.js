import { MaterialId } from "../assets-config.js";
import { TooltipId } from "../tooltip-config.js";
import { getMaterial } from "./assets.js";
import { registerCameraCollider } from "./camera.js";
import { ParticleCollection } from "./effects/particle-system/particle-collection.js";
import { groundContactMaterial } from "./physics/physics.js";
import { hideTooltip, showTooltip } from "./tooltips.js";
import { createColliderByObject } from "./utils/cannon-utils.js";

let chests = [];
let selectedChest;

export const updateChests = (user) => {
  chests.forEach((chest) => {
    const { object } = chest;
    if (user.object && object.position.distanceTo(user.object.position) < 1.5) {
      if (object.material.userData.outlineParameters?.thickness !== 0.002) {
        object.material.userData.outlineParameters = {
          thickness: 0.002,
          color: [1, 1, 0],
          alpha: 10,
        };
        selectedChest = chest;
      }
    } else if (
      object.material.userData.outlineParameters?.thickness !== 0.001
    ) {
      object.material.userData.outlineParameters = {
        thickness: 0.001,
        color: [0, 0, 0],
        alpha: 1,
      };
      selectedChest = null;
    }
  });

  if (selectedChest) {
    showTooltip({
      id: TooltipId.INTERACTION,
      target: selectedChest.object,
    });
  } else hideTooltip(TooltipId.INTERACTION);
};

export const registerChest = ({ element, physicsWorld, scene }) => {
  element.castShadow = true;
  element.material = getMaterial(
    MaterialId.Cartoon,
    element.material.map
  ).clone();
  element.geometry.computeBoundingBox();

  const collider = createColliderByObject({
    object: element,
    material: groundContactMaterial,
  });
  physicsWorld.add(collider);
  registerCameraCollider(element);

  const effect = ParticleCollection.createChestIdleEffect({
    position: element.position,
  });
  scene.add(effect);

  chests.push({
    object: element,
    collider,
    effect,
  });
};

export const collectChest = ({ scene, physicsWorld }) => {
  if (selectedChest) {
    const { object, collider, effect } = selectedChest;

    effect.geometry.dispose();
    effect.material.dispose();
    effect.parent.remove(effect);

    const removeChest = () => {
      object.parent.remove(object);
      physicsWorld.remove(collider);
      chests = chests.filter((chest) => chest != selectedChest);
      selectedChest = null;
    };

    const collectEffect = ParticleCollection.createChestCollectEffect({
      position: object.position,
    });
    scene.add(collectEffect);

    gsap.to(object.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 0.3,
      delay: 0.6,
      onComplete: removeChest,
    });
  }
};
