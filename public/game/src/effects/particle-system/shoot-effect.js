import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, delta, lifeTime, cos, sin }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;
  const sizeArr = particleSystem.geometry.attributes.size.array;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    positionArr[i] += speedArr[index] * delta * cos;
    positionArr[i + 2] += speedArr[index] * delta * sin;

    opacityArr[index] = ((500 - lifeTime) / 500) * 0.5;

    sizeArr[index] *= 1.02;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
};

export const createShootEffect = ({ position, angle }) => {
  const particleCount = 10;
  const startPosition = {
    x: { min: 0.0, max: 0.02 },
    y: { min: 0.0, max: 0.02 },
    z: { min: 0.0, max: 0.02 },
  };
  const speed = { min: 0.1, max: 1.5 };
  const size = { min: 1, max: 3.0 };
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const particleSystem = createParticleSystem({
    map: getTexture(TextureId.Smoke),
    particleCount,
    startPosition,
    size,
    onUpdate: ({ particleSystem, delta, lifeTime }) =>
      onUpdate({
        particleSystem,
        delta,
        lifeTime,
        cos,
        sin,
      }),
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

  particleSystem.position.copy(position);
  return particleSystem;
};
