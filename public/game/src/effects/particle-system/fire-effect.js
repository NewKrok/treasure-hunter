import { getTexture } from "../../../game-engine/assets/assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, delta }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    // Set / Reset z position
    const raisingSpeed = speedArr[index];
    positionArr[i + 1] += raisingSpeed * delta;
    if (positionArr[i + 1] > 0.25) positionArr[i + 1] = -0.25;

    // Set opacity based on the z position
    opacityArr[index] =
      positionArr[i + 1] < 0.05 ? 1 : (0.25 - positionArr[i + 1]) / 0.25;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
};

export const createFireEffect = ({ position, size: ratio }) => {
  const particleCount = 20;
  const startPosition = {
    x: { min: 0.0, max: 0.2 * ratio },
    y: { min: 0.0, max: 0.2 * ratio },
    z: { min: 0.0, max: 0.2 * ratio },
  };
  const speed = { min: 0.3, max: 0.6 };
  const size = { min: 2.0 * ratio, max: 10.0 * ratio };

  const particleSystem = createParticleSystem({
    map: getTexture(TextureId.Smoke),
    particleCount,
    startPosition,
    size,
    onUpdate,
  });

  particleSystem.geometry.setAttribute(
    "colorR",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => 2)),
      1
    )
  );

  particleSystem.geometry.setAttribute(
    "colorG",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => 0.1)),
      1
    )
  );

  particleSystem.geometry.setAttribute(
    "colorB",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => 0)),
      1
    )
  );

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
