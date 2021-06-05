import { getAudioBuffer } from "../assets/assets.js";
import { PositionalAudioHelper } from "../../lib/jsm/helpers/PositionalAudioHelper.js";

const defaultConfig = { loop: false, volume: 1 };
let audioConfig = {};

const audioCache = {};

export const setAudioConfig = (config) => (audioConfig = config);

export const playAudio = ({
  audioId,
  position,
  radius,
  scene,
  camera,
  cacheId,
}) => {
  const now = Date.now();
  let audio;
  if (!cacheId || !audioCache[cacheId]) {
    const audioBuffer = getAudioBuffer(audioId);
    const { loop, volume } = { ...defaultConfig, ...audioConfig[audioId] };

    const listener = new THREE.AudioListener();
    let container;
    if (position) {
      audio = new THREE.PositionalAudio(listener);
      audio.setRefDistance(radius);
      const sphere = new THREE.SphereGeometry(radius, 32, 32);
      container = new THREE.Mesh(sphere);
      container.visible = false;
      const helper = new PositionalAudioHelper(audio, radius);
      audio.add(helper);
      container.position.copy(position);
      container.add(audio);
      scene.add(container);
      camera.add(listener);
    } else audio = new THREE.Audio(listener);
    audio.setBuffer(audioBuffer);
    audio.setLoop(loop);
    audio.setVolume(volume);
    audioCache[cacheId] = {
      audio,
      container,
      lastPlayedTime: now,
    };
  } else {
    const { audio: cachedAudio, container } = audioCache[cacheId];
    audio = cachedAudio;
    if (audio.isPlaying) audio.stop();
    if (container) container.position.copy(position);
    audioCache[cacheId].lastPlayedTime = now;
  }
  audio.play();
};

export const stopAudio = (cacheId) => {
  const audio = getAudioCache(cacheId).audio;
  if (audio && audio.isPlaying) {
    audio.stop();
  }
};

export const getAudioCache = (cacheId) =>
  audioCache[cacheId] || { audio: null, container: null, lastPlayedTime: 0 };
