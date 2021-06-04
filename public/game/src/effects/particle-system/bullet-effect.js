import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, direction, iterationCount }) => {
  if (iterationCount === 1) {
    const positionArr = particleSystem.geometry.attributes.position.array;
    const opacityArr = particleSystem.geometry.attributes.opacity.array;
    const sizeArr = particleSystem.geometry.attributes.size.array;

    for (let i = 0; i < positionArr.length; i += 3) {
      const index = Math.floor(i / 3);

      positionArr[i] = index * -direction.x * 0.06;
      positionArr[i + 1] = index * -direction.y * 0.06;
      positionArr[i + 2] = index * -direction.z * 0.06;

      opacityArr[index] = (1 - index / 15) * 0.5;
      sizeArr[index] = (1 - index / 15) * 0.5;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.opacity.needsUpdate = true;
    particleSystem.geometry.attributes.size.needsUpdate = true;
  }
};

export const createBulletEffect = ({ position, direction }) => {
  const particleCount = 15;
  const startPosition = {
    x: { min: 0.0, max: 0.0 },
    y: { min: 0.0, max: 0.0 },
    z: { min: 0.0, max: 0.0 },
  };
  const size = { min: 1.0, max: 1.0 };

  const particleSystem = createParticleSystem({
    map: getTexture(TextureId.Trail),
    particleCount,
    startPosition,
    size,
    onUpdate: ({ particleSystem, iterationCount }) =>
      onUpdate({
        particleSystem,
        iterationCount,
        direction,
      }),
  });

  particleSystem.position.copy(position);
  return particleSystem;
};
