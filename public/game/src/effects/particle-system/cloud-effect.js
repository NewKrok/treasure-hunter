import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, elapsed }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const angleArr = particleSystem.geometry.attributes.angle.array;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    opacityArr[index] = Math.abs(Math.sin(elapsed)) * 0.1 + 0.25;
    angleArr[index] += Math.random() * 0.003;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
  particleSystem.geometry.attributes.angle.needsUpdate = true;
};

export const createCloudEffect = ({ position }) => {
  const particleCount = 60;
  const startPosition = {
    x: { min: -40.0, max: 40.0 },
    y: { min: -4.0, max: 2.0 },
    z: { min: -40.0, max: 40.0 },
  };
  const size = { min: 200.0, max: 1000.0 };

  const particleSystem = createParticleSystem({
    map: getTexture(TextureId.SmokeBig),
    particleCount,
    startPosition,
    size,
    onUpdate,
  });

  particleSystem.position.copy(position);
  return particleSystem;
};
