import { FBXLoader } from "../../lib/jsm/loaders/FBXLoader.js";
import { registerAnimation } from "../assets.js";

const objLoader = new FBXLoader();

const load = ({ list, onComplete }) => {
  if (list.length > 0) {
    const { url, key } = list[0];
    objLoader.load(url, (res) => {
      registerAnimation({ key, animation: res.animations[0] });
      load({ list: [...list.slice(1)], onComplete });
    });
  } else onComplete();
};

export const loadAnimations = (entries) => {
  const list = [];
  Object.keys(entries).map((key) => list.push({ key, url: entries[key] }));

  const promise = new Promise((resolve, reject) => {
    load({ list, onComplete: resolve });
    //reject(Error("something wrong happened")); // maybe later
  });

  return promise;
};
