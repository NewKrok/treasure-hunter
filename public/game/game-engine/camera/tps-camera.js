import { Vector3, Euler } from "../../build/three.module.js";

const TPSCamera = (camera) => {
  let target, q, mX, mY, distance, lastDistance;
  const currentPosition = new Vector3();
  const currentLookat = new Vector3();

  const calculateOffset = () => {
    const idealOffset = new Vector3(
      0,
      1 + -distance * Math.cos(mY),
      -distance * Math.sin(mY)
    );
    idealOffset.applyQuaternion(q);
    idealOffset.add(target.position);
    return idealOffset;
  };

  const calculateLookat = () => {
    const idealLookat = new Vector3(0, 1, 0);
    idealLookat.add(target.position);
    return idealLookat;
  };

  return {
    getTarget: () => target,
    setTarget: (object) => {
      target = object;
      q = target.quaternion.clone();
      mX = -new Euler().setFromQuaternion(q).y;
      mY = 2.4;
      distance = 15;
    },
    update: ({ x, y, delta }) => {
      if (target) {
        if (x || y) {
          mX += x || 0;
          mY += y || 0;
          mY = Math.max(1.2, mY);
          mY = Math.min(2.7, mY);
          if (x) {
            q.setFromAxisAngle(new Vector3(0, 1, 0), -mX);
          }
        } else if (delta) {
          /* const t =
            1.0 -
            Math.pow(
              lastDistance > distance ? 0.00000000000000000000001 : 0.001,
              delta
            ); */

          /*const idealOffset = calculateOffset();
          const idealLookat = calculateLookat();

          currentPosition.lerp(idealOffset, t);
          currentLookat.lerp(idealLookat, t);

          camera.position.copy(currentPosition);
          camera.lookAt(currentLookat);*/

          camera.position.copy(calculateOffset());
          camera.lookAt(calculateLookat());

          lastDistance = distance;
        }
      }
    },
    getRotation: () => ({ x: mX, y: mY }),
    setDistance: (d) => (distance = d),
  };
};

export default TPSCamera;
