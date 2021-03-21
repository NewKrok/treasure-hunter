export default function TPSCamera({ camera, target }) {
  const currentPosition = new THREE.Vector3();
  const currentLookat = new THREE.Vector3();

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(0, 3, -3);
    idealOffset.applyQuaternion(target.quaternion);
    idealOffset.add(target.position);
    return idealOffset;
  };

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(0, 1, 1);
    idealLookat.applyQuaternion(target.quaternion);
    idealLookat.add(target.position);
    return idealLookat;
  };

  return {
    update: (d) => {
      const idealOffset = calculateIdealOffset();
      const idealLookat = calculateIdealLookat();
      const t = 1.0 - Math.pow(0.001, d);

      currentPosition.lerp(idealOffset, t);
      currentLookat.lerp(idealLookat, t);

      camera.position.copy(currentPosition);
      camera.lookAt(currentLookat);
      camera.lookAt(currentLookat);
    },
  };
}
