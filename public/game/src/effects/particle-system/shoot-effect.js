import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, delta, lifeTime, cos, sin }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;
  const sizeArr = particleSystem.geometry.attributes.size.array;
  const angleArr = particleSystem.geometry.attributes.angle.array;
  const opacity = ((1000 - lifeTime) / 1000) * 0.3;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    positionArr[i] += speedArr[index] * delta * cos;
    positionArr[i + 2] += speedArr[index] * delta * sin;
    positionArr[i + 1] *= 1.02;

    opacityArr[index] = opacity;

    sizeArr[index] *= 1.01;
    angleArr[index] *= 1.0003;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
  particleSystem.geometry.attributes.angle.needsUpdate = true;
};

export const createShootEffect = ({ position, direction }) => {
  const particleCount = 15;
  const startPosition = {
    x: { min: 0.0, max: 0.02 },
    y: { min: 0.0, max: 0.02 },
    z: { min: 0.0, max: 0.02 },
  };
  const speed = { min: 0.1, max: 1.5 };
  const size = { min: 0.5, max: 2.0 };
  const angle = { min: 0, max: Math.PI * 2 };
  const cos = Math.cos(direction);
  const sin = Math.sin(direction);

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

  particleSystem.geometry.setAttribute(
    "angle",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, () =>
          THREE.MathUtils.randFloat(angle.min, angle.max)
        )
      ),
      1
    )
  );

  particleSystem.position.copy(position);
  return particleSystem;
};
