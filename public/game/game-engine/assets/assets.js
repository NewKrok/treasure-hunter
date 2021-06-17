import { MaterialId } from "../../assets-config.js";
import { MeshPhysicalMaterial } from "../../build/three.module.js";
import { loadAudio, loadFBXModels, loadTextures } from "./loaders.js";

const animations = {};
export const registerAnimation = ({ key, animation }) =>
  (animations[key] = animation);
export const getAnimation = (key) => animations[key];

const fbxModels = {};
export const registerFBXModel = ({ id, fbxModel }) =>
  (fbxModels[id] = fbxModel);
export const getFBXModel = (id) => THREE.SkeletonUtils.clone(fbxModels[id]);

const textures = {};
export const registerTexture = ({ id, texture }) => (textures[id] = texture);
export const getTexture = (id) => textures[id];

const audioBuffers = {};
export const registerAudioBuffer = ({ id, audioBuffer }) =>
  (audioBuffers[id] = audioBuffer);
export const getAudioBuffer = (id) => audioBuffers[id];

const materials = {};
const createMaterial = ({ key, map }) => {
  if (materials[key]) return materials[key];

  switch (key) {
    case MaterialId.Cartoon:
      materials[key] = new MeshPhysicalMaterial({ map });
      materials[key].emissiveIntensity = 0;
      break;

    default:
      break;
  }

  return materials[key];
};
export const getMaterial = (key, map = null) => createMaterial({ key, map });

export const preload = ({ textures, fbxModels, audio }) =>
  new Promise((resolve, reject) => {
    loadTextures(textures)
      .then((loadedTextures) => {
        loadedTextures.forEach((element) => registerTexture(element));
        console.log(`Textures(${loadedTextures.length}) are loaded...`);

        loadFBXModels(fbxModels)
          .then((loadedModels) => {
            loadedModels.forEach((element) => {
              element.fbxModel.traverse((child) => {
                if (child.isMesh) {
                  child.material.map = getTexture(element.textureId);
                }
              });
              registerFBXModel(element);
            });
            console.log(`FBX Models(${loadedModels.length}) are loaded...`);

            loadAudio(audio)
              .then((loadedAudio) => {
                loadedAudio.forEach((element) => registerAudioBuffer(element));
                console.log(`Audio files(${loadedAudio.length}) are loaded...`);
                resolve();
              })
              .catch((error) =>
                console.log(
                  `Fatal error during FBX model preloader phase: ${error}`
                )
              );
          })
          .catch((error) =>
            console.log(
              `Fatal error during FBX model preloader phase: ${error}`
            )
          );
      })
      .catch((error) =>
        console.log(`Fatal error during texture preloader phase: ${error}`)
      );
  });
