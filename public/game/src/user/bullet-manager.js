import { Raycaster, Vector3 } from "../../build/three.module.js";
import { ParticleCollection } from "../effects/particle-system/particle-collection.js";

const bulletShape = new CANNON.Sphere(0.02);
const bulletGeometry = new THREE.SphereGeometry(bulletShape.radius, 8, 8);
const shootVelocity = 0.8;
const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });

let bullets = [];
let bulletIndex = 0;

function getShootDir({ physics, camera }) {
  const directionVector = new THREE.Vector3();
  directionVector.set(0, 0, 1);
  directionVector.unproject(camera);
  var ray = new THREE.Ray(
    physics.position,
    directionVector.sub(physics.position).normalize()
  );
  directionVector.x = ray.direction.x;
  directionVector.y = ray.direction.y;
  directionVector.z = ray.direction.z;

  return directionVector;
}

export const shoot = ({ user, camera, scene }) => {
  const x = user.physics.position.x;
  const y = user.physics.position.y + 0.6;
  const z = user.physics.position.z;
  const direction = getShootDir({ physics: user.physics, camera });

  const bulletMesh = new THREE.Mesh(bulletGeometry, material);
  bulletMesh.castShadow = true;
  bulletMesh.receiveShadow = false;
  bulletMesh.position.set(x, y, z);
  scene.add(bulletMesh);

  /* var arrow = new THREE.ArrowHelper(
    direction,
    new Vector3(0, 0, 0),
    3,
    Math.random() * 0xffffff
  );
  bulletMesh.add(arrow); */

  bullets.push({
    id: user.name + "/" + bulletIndex++,
    bornTime: Date.now(),
    mesh: bulletMesh,
    direction,
  });
};

export const updateBullets = ({ scene, colliders }) => {
  const bulletsToRemove = [];

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
        //console.log(intersects[0]);
        console.log(intersects.length);
        mesh.position.copy(intersects[0].point);
        const effect = ParticleCollection.createShootHitEffect(mesh.position);
        scene.add(effect);
        bulletsToRemove.push(mesh);
      }
    }
  });

  const now = Date.now();
  bullets = bullets.filter(({ mesh, bornTime }) => {
    const old = now - bornTime > 50000;
    const isCollided = bulletsToRemove.includes(mesh);
    if (old || isCollided) {
      scene.remove(mesh);
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
