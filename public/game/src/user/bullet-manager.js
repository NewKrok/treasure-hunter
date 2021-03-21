const ballShape = new CANNON.Sphere(0.15);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 16, 16);
const shootVelo = 18;
const characterRadius = 1;
const directionVector = new THREE.Vector3();
const material = new THREE.MeshLambertMaterial({ color: 0xdddddd });

let balls = [];
let ballIndex = 0;

function getShootDir({ targetVec, physics, camera }) {
  var vector = targetVec;
  targetVec.set(0, 0, 1);
  vector.unproject(camera);
  var ray = new THREE.Ray(
    physics.position,
    vector.sub(physics.position).normalize()
  );
  targetVec.x = ray.direction.x;
  targetVec.y = ray.direction.y + 0.15;
  targetVec.z = ray.direction.z;
}

export const shoot = ({ user, camera, physicsWorld, scene }) => {
  var x = user.physics.position.x;
  var y = user.physics.position.y;
  var z = user.physics.position.z;
  var ballBody = new CANNON.Body({ mass: 1 });
  ballBody.addShape(ballShape);
  var ballMesh = new THREE.Mesh(ballGeometry, material);
  physicsWorld.add(ballBody);
  scene.add(ballMesh);
  ballMesh.castShadow = true;
  ballMesh.receiveShadow = false;
  balls.push({
    id: user.name + "/" + ballIndex++,
    bornTime: Date.now(),
    body: ballBody,
    mesh: ballMesh,
  });

  getShootDir({ targetVec: directionVector, physics: user.physics, camera });
  ballBody.velocity.set(
    directionVector.x * shootVelo,
    directionVector.y * shootVelo,
    directionVector.z * shootVelo
  );
  x += directionVector.x * (characterRadius + ballShape.radius);
  y += directionVector.y * (characterRadius + ballShape.radius);
  z += directionVector.z * (characterRadius + ballShape.radius);
  ballBody.position.set(x, y, z);
  ballMesh.position.set(x, y, z);
};

export const updateBullets = ({ scene, physicsWorld }) => {
  balls.forEach((ball, index) => {
    if (ball.body) {
      ball.mesh.position.copy(ball.body.position);
      ball.mesh.quaternion.copy(ball.body.quaternion);
    }
  });

  const now = Date.now();
  balls = balls.filter((ball) => {
    const old = now - ball.bornTime > 2000;
    if (old) {
      scene.remove(ball.mesh);
      if (ball.body) physicsWorld.remove(ball.body);
    }

    return !old;
  });
};

export const syncBulletPosition = ({ id, bulletId, position, scene }) => {
  const bullet = balls.find((b) => b.id === id);
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
    var ballMesh = new THREE.Mesh(ballGeometry, material);
    scene.add(ballMesh);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = false;
    ballMesh.position.x = x;
    ballMesh.position.y = y;
    ballMesh.position.z = z;
    balls.push({
      bulletId,
      id,
      bornTime: Date.now(),
      mesh: ballMesh,
    });
  }
};

export const syncOwnBullet = ({ serverCall, isStarted }) => {
  const now = Date.now();
  balls.forEach((bullet) => {
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

export const getBullets = () => balls;
