import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, lifeTime }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;
  const sizeArr = particleSystem.geometry.attributes.size.array;
  const opacity = ((1000 - lifeTime) / 1000) * 0.2;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    positionArr[i + 1] += speedArr[index];
    sizeArr[index] *= 1.01;
    opacityArr[index] = opacity;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
};

export const createLandingEffect = (position) => {
  const particleCount = 15;
  const startPosition = {
    x: { min: -0.2, max: 0.2 },
    y: { min: 0.0, max: 0.0 },
    z: { min: -0.2, max: 0.2 },
  };
  const speed = { min: 0.001, max: 0.002 };
  const size = { min: 5.0, max: 10.0 };

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

  particleSystem.geometry.setAttribute(
    "opacity",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => 0)),
      1
    )
  );

  particleSystem.position.copy(position);
  return particleSystem;
};
