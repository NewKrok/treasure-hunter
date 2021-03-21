import { MaterialId } from "../assets-config.js";
import { MeshToonMaterial } from "../build/three.module.js";

const animations = {};
export const registerAnimation = ({ key, animation }) =>
  (animations[key] = animation);
export const getAnimation = (key) => animations[key];

const textures = {};
export const registerTexture = ({ key, texture }) => (textures[key] = texture);
export const getTexture = (key) => textures[key];

const materials = {};
const createMaterial = ({ key, map }) => {
  if (materials[key]) return materials[key];

  switch (key) {
    case MaterialId.Cartoon:
      materials[key] = new MeshToonMaterial({ map });
      materials[key].emissiveIntensity = 0;
      break;

    default:
      break;
  }

  return materials[key];
};
export const getMaterial = (key, map = null) => createMaterial({ key, map });
