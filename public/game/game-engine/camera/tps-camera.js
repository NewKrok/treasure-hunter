import { Vector3, Euler } from "../../build/three.module.js";

const TPSCamera = (camera) => {
  let target, q, mX, mY, distance, maxDistance, currentDistance;
  let minY = 1.2;
  let maxY = 2.7;
  let positionOffset = new Vector3(0, 0, 0);
  let normalizedPositionOffset = new Vector3(0, 0, 0);

  const calculateOffset = () => {
    const normalizedDistance = Math.min(currentDistance, maxDistance);
    const idealOffset = new Vector3(
      0,
      1 + -normalizedDistance * Math.cos(mY),
      -normalizedDistance * Math.sin(mY)
    );
    const pos = target.position.clone();
    pos.add(normalizedPositionOffset);
    idealOffset.applyQuaternion(q);
    idealOffset.add(pos);
    return idealOffset;
  };

  const calculateLookat = () => {
    const idealLookat = new Vector3(0, 1, 0);
    const pos = target.position.clone();
    pos.add(normalizedPositionOffset);
    idealLookat.add(pos);
    return idealLookat;
  };

  const normalizePositionOffset = () => {
    normalizedPositionOffset.set(
      positionOffset.x + positionOffset.z * Math.cos(mX),
      positionOffset.y,
      positionOffset.z * Math.sin(mX)
    );
  };

  return {
    getTarget: () => target,
    setTarget: (object) => {
      target = object;
      q = target.quaternion.clone();
      mX = -new Euler().setFromQuaternion(q).y;
      mY = 2.4;
      distance = 15;
      currentDistance = distance;
      maxDistance = 99;
      normalizePositionOffset();
    },
    update: ({ x, y, delta }) => {
      if (target) {
        if (x || y) {
          mX += x || 0;
          mY += y || 0;
          mY = Math.max(minY, mY);
          mY = Math.min(maxY, mY);
          if (x) {
            q.setFromAxisAngle(new Vector3(0, 1, 0), -mX);
          }
          normalizePositionOffset();
        } else if (delta) {
          camera.position.copy(calculateOffset());
          camera.lookAt(calculateLookat());

          currentDistance = THREE.Math.lerp(
            currentDistance,
            distance,
            distance < currentDistance ? 0.1 : 0.05
          );
        }
      }
    },
    getRotation: () => ({ x: mX, y: mY }),
    setDistance: (d, useLerp = true) => {
      distance = d;
      if (!useLerp) currentDistance = distance;
    },
    setMaxDistance: (d) => (maxDistance = d),
    setYBoundaries: ({ min, max }) => {
      minY = min || minY;
      maxY = max || maxY;
    },
    setPositionOffset: (o) => {
      positionOffset = o;
      normalizePositionOffset();
    },
  };
};

export default TPSCamera;
