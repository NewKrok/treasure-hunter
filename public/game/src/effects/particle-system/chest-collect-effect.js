import { getTexture } from "../../assets.js";
import { TextureId } from "../../../assets-config.js";
import { createParticleSystem } from "./particle-defaults.js";

const onUpdate = ({ particleSystem, delta }) => {
  const positionArr = particleSystem.geometry.attributes.position.array;
  const opacityArr = particleSystem.geometry.attributes.opacity.array;
  const speedArr = particleSystem.geometry.attributes.speed.array;
  const xVelocityArr = particleSystem.geometry.attributes.xVelocity.array;
  const yVelocityArr = particleSystem.geometry.attributes.yVelocity.array;
  const zVelocityArr = particleSystem.geometry.attributes.zVelocity.array;
  const delayArr = particleSystem.geometry.attributes.delay.array;

  for (let i = 0; i < positionArr.length; i += 3) {
    const index = Math.floor(i / 3);

    if (delayArr[index] > 0) {
      opacityArr[index] = 0;
      delayArr[index] -= delta;

      if (delayArr[index] <= 0) opacityArr[index] = 1;
    } else {
      const speed = speedArr[index];
      const xVelocity = xVelocityArr[index];
      const yVelocity = yVelocityArr[index];
      const zVelocity = zVelocityArr[index];
      positionArr[i] += speed * xVelocity;
      positionArr[i + 1] += speed * yVelocity;
      positionArr[i + 2] += speed * zVelocity;

      opacityArr[index] -= delta * 1.5;

      if (speedArr[index] > 0) speedArr[index] *= 1 - delta * 13;
      else speedArr[index] *= 1 + delta * 15;

      if (speedArr[index] > 0 && speedArr[index] < 0.001) {
        speedArr[index] *= -1.0;
      }
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.opacity.needsUpdate = true;
};

export const createChestCollectEffect = ({ position }) => {
  const particleCount = 30;
  const startPosition = {
    x: { min: -0.1, max: 0.1 },
    y: { min: -0.1, max: 0.1 },
    z: { min: -0.1, max: 0.1 },
  };
  const speed = { min: 0.08, max: 0.12 };
  const size = { min: 3.0, max: 10.0 };
  const delay = { min: 0.0, max: 0.25 };

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

  const directions = Array.from({ length: particleCount }, () =>
    THREE.MathUtils.randFloat(-Math.PI, Math.PI)
  );

  particleSystem.geometry.setAttribute(
    "xVelocity",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, (_, index) =>
          Math.cos(directions[index])
        )
      ),
      1
    )
  );

  particleSystem.geometry.setAttribute(
    "yVelocity",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, (_, index) => Math.random())
      ),
      1
    )
  );

  particleSystem.geometry.setAttribute(
    "zVelocity",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, (_, index) =>
          Math.sin(directions[index])
        )
      ),
      1
    )
  );

  particleSystem.geometry.setAttribute(
    "delay",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, () =>
          THREE.MathUtils.randFloat(delay.min, delay.max)
        )
      ),
      1
    )
  );

  particleSystem.position.copy(position);
  return particleSystem;
};
