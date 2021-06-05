import { AudioId } from "../../assets-config.js";
import { Raycaster, Vector3 } from "../../build/three.module.js";
import { playAudio } from "../../game-engine/audio/audio.js";
import { getCamera } from "../../game-engine/camera/camera.js";
import { getBulletColliders, getColliders } from "../../main.js";
import { ParticleCollection } from "../effects/particle-system/particle-collection.js";
import { destroyParticleSystem } from "../effects/particle-system/particle-defaults.js";

const bulletShape = new CANNON.Sphere(0.01);
const bulletGeometry = new THREE.SphereGeometry(bulletShape.radius, 8, 8);
const shootVelocity = 0.8;
const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });

let bullets = [];
let bulletIndex = 0;

export const shoot = ({ user, camera, scene }) => {
  const bulletPosition = user.bulletSlot.getWorldPosition(new Vector3());
  const raycaster = new Raycaster(
    camera.getWorldPosition(new Vector3()),
    camera.getWorldDirection(new Vector3()),
    0,
    100
  );
  const intersects = raycaster.intersectObjects(getColliders());
  let direction;
  if (intersects.length > 0) {
    direction = new Vector3()
      .subVectors(intersects[0].point, bulletPosition)
      .normalize();
  } else {
    direction = new Vector3()
      .subVectors(
        camera
          .getWorldPosition(new Vector3())
          .addScaledVector(camera.getWorldDirection(new Vector3()), 20),
        bulletPosition
      )
      .normalize();
  }

  const bulletMesh = new THREE.Mesh(bulletGeometry, material);
  bulletMesh.castShadow = true;
  bulletMesh.receiveShadow = false;
  bulletMesh.position.copy(bulletPosition);
  scene.add(bulletMesh);

  const bulletEffect = ParticleCollection.createBulletEffect({
    position: new Vector3(),
    direction,
  });
  bulletMesh.add(bulletEffect);

  bullets.push({
    id: user.name + "/" + bulletIndex++,
    bornTime: Date.now(),
    mesh: bulletMesh,
    direction,
    bulletEffect,
  });

  playAudio({
    audioId: AudioId.PistolShot,
    cacheId: AudioId.PistolShot,
  });
};

export const updateBullets = ({ scene }) => {
  const bulletsToRemove = [];
  const colliders = getBulletColliders();

  bullets.forEach(({ mesh, direction }) => {
    const { x, y, z } = mesh.position;
    const targetPos = mesh.position.clone();
    const maxOffset = shootVelocity;

    if (targetPos) {
      const raycaster = new Raycaster(targetPos, direction, 0, maxOffset);
      const intersects = raycaster.intersectObjects(colliders);

      if (intersects.length === 0) {
        mesh.position.set(
          x + direction.x * maxOffset,
          y + direction.y * maxOffset,
          z + direction.z * maxOffset
        );
      } else {
        mesh.position.copy(intersects[0].point);
        const effect = ParticleCollection.createShootHitEffect(mesh.position);
        scene.add(effect);

        playAudio({
          audioId: AudioId.PistolHit,
          cacheId: AudioId.PistolHit,
          position: intersects[0].point,
          radius: 10,
          scene,
          camera: getCamera(),
        });

        bulletsToRemove.push(mesh);
      }
    }
  });

  const now = Date.now();
  bullets = bullets.filter(({ mesh, bornTime, bulletEffect }) => {
    const old = now - bornTime > 50000;
    const isCollided = bulletsToRemove.includes(mesh);
    if (old || isCollided) {
      scene.remove(mesh);
      setTimeout(() => destroyParticleSystem(bulletEffect), 100);
    }

    return !old && !isCollided;
  });
};

export const syncBulletPosition = ({ id, bulletId, position, scene }) => {
  const bullet = bullets.find((b) => b.id === id);
  if (bullet) {
    if (bullet.positionTween) bullet.positionTween.kill();
    bullet.positionTween = gsap.to(
      bullet.body ? bullet.body.position : bullet.mesh.position,
      {
        x: position.x,
        y: position.y + 2,
        z: position.z,
        duration: 0.2,
        ease: "linear",
      }
    );
  } else {
    var { x, y, z } = position;
    var bulletMesh = new THREE.Mesh(ballGeometry, material);
    scene.add(bulletMesh);
    bulletMesh.castShadow = true;
    bulletMesh.receiveShadow = false;
    bulletMesh.position.x = x;
    bulletMesh.position.y = y;
    bulletMesh.position.z = z;
    bullets.push({
      bulletId,
      id,
      bornTime: Date.now(),
      mesh: bulletMesh,
    });
  }
};

export const syncOwnBullet = ({ serverCall, isStarted }) => {
  const now = Date.now();
  bullets.forEach((bullet) => {
    if (
      isStarted &&
      bullet.body &&
      (bullet.lastSyncTime === null ||
        bullet.lastSyncTime === undefined ||
        now - bullet.lastSyncTime > 25)
    ) {
      const currentPosition = {
        x: bullet.body.position.x.toFixed(1),
        y: bullet.body.position.y.toFixed(1),
        z: bullet.body.position.z.toFixed(1),
      };
      if (
        bullet === null ||
        bullet.body.position.x !== currentPosition.x ||
        bullet.body.position.y !== currentPosition.y ||
        bullet.body.position.z !== currentPosition.z
      ) {
        bullet.lastSyncTime = now;

        const syncData = {
          lastSyncTime: now,
          bulletId: bullet.id,
          position: { ...currentPosition },
        };

        serverCall({
          header: "updatePosition",
          data: {
            type: "bullet",
            ...syncData,
          },
        });
      }
    }
  });
};

export const getBullets = () => bullets;
