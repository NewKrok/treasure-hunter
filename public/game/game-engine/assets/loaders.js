import { FBXLoader } from "../../lib/jsm/loaders/FBXLoader.js";
import { AudioLoader, TextureLoader } from "../../build/three.module.js";

const fbxLoader = new FBXLoader();
const textureLoader = new TextureLoader();
const audioLoader = new AudioLoader();

const loadFBXModelRoutine = ({
  list,
  onElementLoaded,
  onComplete,
  onError,
}) => {
  if (list.length > 0) {
    const { url, id, textureId } = list[0];
    fbxLoader.load(url, (fbxModel) => {
      onElementLoaded({ id, fbxModel, textureId });
      list.shift();
      loadFBXModelRoutine({ list, onElementLoaded, onComplete, onError });
    });
  } else onComplete();
};

export const loadFBXModels = (list) => {
  const elements = [];
  const onElementLoaded = (element) => elements.push(element);

  const promise = new Promise((resolve, reject) => {
    loadFBXModelRoutine({
      list,
      onElementLoaded,
      onComplete: () => resolve(elements),
      onError: (error) => reject(Error(`Something wrong happened: ${error}`)),
    });
  });

  return promise;
};

const loadTextureRoutine = ({ list, onElementLoaded, onComplete, onError }) => {
  if (list.length > 0) {
    const { url, id } = list[0];
    textureLoader.load(
      url,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        onElementLoaded({ id, texture });
        list.shift();
        loadTextureRoutine({ list, onElementLoaded, onComplete, onError });
      },
      null,
      onError
    );
  } else onComplete();
};

export const loadTextures = (list) => {
  const elements = [];
  const onElementLoaded = (element) => elements.push(element);

  const promise = new Promise((resolve, reject) => {
    loadTextureRoutine({
      list,
      onElementLoaded,
      onComplete: () => resolve(elements),
      onError: (error) => reject(Error(`Something wrong happened: ${error}`)),
    });
  });

  return promise;
};

const loadAudioRoutine = ({ list, onElementLoaded, onComplete, onError }) => {
  if (list.length > 0) {
    const { url, id } = list[0];
    audioLoader.load(
      url,
      (audioBuffer) => {
        onElementLoaded({ id, audioBuffer });
        list.shift();
        loadAudioRoutine({ list, onElementLoaded, onComplete, onError });
      },
      null,
      onError
    );
  } else onComplete();
};

export const loadAudio = (list) => {
  const elements = [];
  const onElementLoaded = (element) => elements.push(element);

  const promise = new Promise((resolve, reject) => {
    loadAudioRoutine({
      list,
      onElementLoaded,
      onComplete: () => resolve(elements),
      onError: (error) => reject(Error(`Something wrong happened: ${error}`)),
    });
  });

  return promise;
};
