import { getTexture } from "../../assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, delta, elapsed }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    // Set / Reset z position
    const raisingSpeed = speedArr[index];
    positionArr[i + 1] += raisingSpeed * delta;
    if (positionArr[i + 1] > 1.25) positionArr[i + 1] = -0.25;

    // Decrease radius from bottom to top
    const radius = Math.cos((positionArr[i + 1] + 0.5) / 1.25) * 0.5 + 0.1;

    // Set x and y based on the current radius and the speed

    const rotationSpeed = elapsed * speedArr[index];
    positionArr[i] = radius * Math.cos(rotationSpeed + index);
    positionArr[i + 2] = radius * Math.sin(rotationSpeed + index);

    // Set opacity based on the z position
    opacityArr[index] = ((1.25 - positionArr[i + 1]) / 1.25) * 0.2;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
};

export const createChestIdleEffect = ({ position }) => {
  const particleCount = 20;
  const startPosition = {
    x: { min: 0.0, max: 1.0 },
    y: { min: 0.0, max: 1.0 },
    z: { min: 0.0, max: 1.0 },
  };
  const speed = { min: 0.3, max: 0.6 };
  const size = { min: 1.0, max: 2.5 };

  const particleSystem = createParticleSystem({
    map: getTexture(TextureId.Particle),
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

  particleSystem.position.copy(position);
  return particleSystem;
};
