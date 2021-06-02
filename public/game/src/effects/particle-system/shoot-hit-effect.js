import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, delta, lifeTime }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;
  const cosArr = particleSystem.geometry.attributes.cos.array;
  const sinArr = particleSystem.geometry.attributes.sin.array;
  const sizeArr = particleSystem.geometry.attributes.size.array;
  const opacity = ((1000 - lifeTime) / 1000) * 0.1;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    positionArr[i] += speedArr[index] * delta * cosArr[index];
    positionArr[i + 1] += speedArr[index] * delta * sinArr[index];
    positionArr[i + 2] += speedArr[index] * delta * sinArr[index];

    opacityArr[index] = opacity;

    sizeArr[index] *= 1.01;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
};

export const createShootHitEffect = (position) => {
  const particleCount = 15;
  const startPosition = {
    x: { min: 0.0, max: 0.02 },
    y: { min: 0.0, max: 0.02 },
    z: { min: 0.0, max: 0.02 },
  };
  const speed = { min: 0.1, max: 0.2 };
  const size = { min: 2.0, max: 5.0 };

  const particleSystem = createParticleSystem({
    map: getTexture(TextureId.Smoke),
    particleCount,
    startPosition,
    size,
    onUpdate,
  });

  particleSystem.geometry.setAttribute(
    "speed",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, () =>
          THREE.MathUtils.randFloat(speed.min, speed.max)
        )
      ),
      1
    )
  );

  const directions = Array.from(
    { length: particleCount },
    () => Math.random() * Math.PI * 2
  );

  particleSystem.geometry.setAttribute(
    "cos",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, (_, index) => {
          return Math.cos(directions[index]);
        })
      ),
      1
    )
  );

  particleSystem.geometry.setAttribute(
    "sin",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, (_, index) => {
          return Math.sin(directions[index]);
        })
      ),
      1
    )
  );

  particleSystem.position.copy(position);
  return particleSystem;
};
