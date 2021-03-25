import { GLTFLoader } from "./lib/jsm/loaders/GLTFLoader.js";
import Stats from "./lib/jsm/libs/stats.module.js";
import { CreateTrimesh } from "./src/utils/cannon-utils.js";
import {
  createPhysicsWorld,
  groundContactMaterial,
} from "./src/physics/physics.js";
import {
  addUser,
  updateUsers,
  syncOwnUser,
  removeUser,
  getOwnUser,
  syncUser,
  setUserPosition,
  getUsers,
  initUserManager,
} from "./src/user/user-manager.js";
import {
  shoot,
  updateBullets,
  syncBulletPosition,
  syncOwnBullet,
  getBullets,
} from "./src/user/bullet-manager.js";

import { getMaterial, getTexture, registerTexture } from "./src/assets.js";
import {
  assetConfig,
  TextureId,
  AnimationId,
  MaterialId,
} from "./assets-config.js";
import { teamLevels } from "./level-config.js";
import { loadAnimations } from "./src/utils/animation-preloader.js";
import {
  toScreenPosition,
  calculateBoundingBox,
  intersect,
} from "./src/utils/threejs-utils.js";
import { createColliderByObject } from "./src/utils/cannon-utils.js";

import {
  initUnitController,
  updateUnitController,
  unitControllerState,
  onUnitControllerAction,
  UnitControllerAction,
} from "./src/control/unit-controller.js";
import { updateParticleSystems } from "./src/effects/particle-system/particle-defaults.js";
import { ParticleCollection } from "./src/effects/particle-system/particle-collection.js";
import { registerDoorElement, updateDoors } from "./src/doors.js";
import {
  createCamera,
  getCamera,
  registerCameraCollider,
  updateCameraRatio,
  setCameraPosition,
  updateCamera,
  setCameraTarget,
  getTPSCameraRotation,
  updateTPSCameraRotation,
} from "./src/camera.js";

const USE_DEBUG_RENDERER = false;
let debugRenderer = null;

export const STATE = {
  WAITING_FOR_START: "WAITING_FOR_START",
  IN_PROGRESS: "IN_PROGRESS",
};

const clock = new THREE.Clock();
const controller = { movement: { x: 0, y: 0 }, rotation: { x: 0, y: 0 } };

let tooltip;
let selectedChest;

let physicsWorld;
let scene;
let level;
let stats;
let renderer;
let canvas;
let light;
let controls;
let textureAssets = {};
let spawnPoints = [];
let climbableAreas = [];
let climbUpBlockers = [];
let climbLeftBlockers = [];
let climbRightBlockers = [];
const enemies = {};
let chests = [];

const params = {
  edgeStrength: 3.0,
  edgeGlow: 0.0,
  edgeThickness: 1.0,
  pulsePeriod: 0,
  rotate: false,
  usePatternTexture: false,
};

let velocity = 0.0;

const sharedData = {
  state: STATE.WAITING_FOR_START,
};

let outlineEffect;

let lavaMaterial;
const getLavaMaterial = ({ map }) => {
  if (lavaMaterial) return lavaMaterial;

  lavaMaterial = new THREE.MeshToonMaterial({ map });
  lavaMaterial.emissiveIntensity = 0;

  lavaMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };

    shader.vertexShader = "uniform float time;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <project_vertex>",
      [
        "#include <project_vertex>",
        "vec4 modelViewPosition = modelViewMatrix * vec4(position.x + (sin(time * 0.2) * cos(time * 0.2) * 50.0), position.y * 1.2, position.z * 1.1, 1.0);",
        "gl_Position = projectionMatrix * modelViewPosition;",
      ].join("\n")
    );

    shader.fragmentShader = "uniform float time;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "}",
      ["gl_FragColor *= 1.0 + (1.0 + sin(time)) * 0.5;", "}"].join("\n")
    );

    lavaMaterial.map.wrapS = lavaMaterial.map.wrapT = THREE.RepeatWrapping;
    lavaMaterial.userData.shader = shader;
  };

  return lavaMaterial;
};

let _ownId = "";
let _gameMode = "";
let _serverCall = (args) => {};

const initThreeJS = () => {
  createCamera();

  scene = new THREE.Scene();

  var alight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(alight);

  light = new THREE.PointLight(0xffffff, 1, 100);
  light.power = 300;
  light.position.set(0, 5, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);

  canvas = document.getElementById("canvas");

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.autoClear = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  outlineEffect = new THREE.OutlineEffect(renderer, {
    defaultThickness: 0.001,
    defaultColor: [0, 0, 0],
    defaultAlpha: 1,
    defaultKeepAlive: true,
  });

  if (USE_DEBUG_RENDERER) {
    debugRenderer = new THREE.CannonDebugRenderer(scene, physicsWorld);
  }
};

const loadTextures = (textureConfig, onLoaded) => {
  const currentConfig = textureConfig[0];
  console.log(
    `Load texture asset ${currentConfig.id} from: ${currentConfig.url}`
  );
  new THREE.TextureLoader().load(currentConfig.url, (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    textureAssets = {
      ...textureAssets,
      [currentConfig.id]: new THREE.MeshBasicMaterial({
        map: texture,
      }),
    };
    registerTexture({ key: currentConfig.id, texture });
    if (textureConfig.length > 1) {
      textureConfig.shift();
      loadTextures(textureConfig, onLoaded);
    } else onLoaded();
  });
};

const createSkyBox = () => {
  const materialArray = [
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SKY_BOX_1) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SKY_BOX_2) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SKY_BOX_3) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SKY_BOX_4) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SKY_BOX_5) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SKY_BOX_6) }),
  ];
  materialArray.forEach((m) => (m.side = THREE.BackSide));

  const skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
  const skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
};

const loadLevel = (onLoaded) => {
  const loader = new GLTFLoader();
  spawnPoints = [];

  const levelList = _gameMode === "team" ? teamLevels : dmLevels;

  loader.load(
    levelList.find((level) => level.id === 0).url,
    ({ scene: gltfScene }) => {
      gltfScene.traverse(function (child) {
        if (child && child.isMesh) {
          if (child.name.includes("Invisible")) {
            child.visible = false;
          }

          if (child.name.includes("Spawn")) {
            child.visible = false;
            spawnPoints.push({
              position: {
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
              },
              rotation: child.rotation.y,
            });
          } else {
            if (child.name.includes("PolygonCollider")) {
              const shape = CreateTrimesh(child.geometry);
              shape.scale.set(0.35, 0.35, 0.35);
              const polygonBody = new CANNON.Body({ mass: 0 });
              polygonBody.addShape(shape);
              polygonBody.position.copy(
                new CANNON.Vec3(
                  child.position.x / 100,
                  child.position.y / 100,
                  child.position.z / 100
                )
              );
              physicsWorld.add(polygonBody);
            } else if (child.name.includes("Climb-up-blocker")) {
              child.visible = false;
              child.geometry.computeBoundingBox();
              climbUpBlockers.push({
                ...child.geometry.boundingBox,
                ...child.position,
              });
            } else if (child.name.includes("Climb-left-blocker")) {
              child.visible = false;
              child.geometry.computeBoundingBox();
              climbLeftBlockers.push({
                ...child.geometry.boundingBox,
                ...child.position,
              });
            } else if (child.name.includes("Climb-right-blocker")) {
              child.visible = false;
              child.geometry.computeBoundingBox();
              climbRightBlockers.push({
                ...child.geometry.boundingBox,
                ...child.position,
              });
            } else if (child.name.includes("Climb")) {
              //child.visible = false;
              child.geometry.computeBoundingBox();
              climbableAreas.push({
                area: {
                  ...child.geometry.boundingBox,
                  ...child.position,
                },
                direction: child.name.includes("D-90")
                  ? -90
                  : child.name.includes("D0")
                  ? 0
                  : child.name.includes("D90")
                  ? 90
                  : 180,
              });
            } else if (child.name.includes("Collider")) {
              child.visible = false;
              const collider = createColliderByObject({
                object: child,
                material: groundContactMaterial,
              });
              physicsWorld.add(collider);
              registerCameraCollider(child);
            } else if (child.name.includes("Enemy")) {
              const rawData = child.name.split("|");
              const key = rawData[0];
              const data = JSON.parse(
                rawData[1]
                  .replace(/_/g, ":")
                  .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
              );
              child.visible = data.index === 0;
              child.castShadow = child.visible;
              child.geometry.computeBoundingBox();
              enemies[key] = enemies[key] || {
                path: [],
                child: null,
                speed: 1,
                pathIndex: 1,
              };
              enemies[key].child = child.visible ? child : enemies[key].child;
              enemies[key].speed = 1 / (data.speed || enemies[key].speed);
              enemies[key].path.push({
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
              });
            } else if (child.name.includes("chest")) {
              const rawData = child.name.split("|");
              const data = JSON.parse(
                rawData[1]
                  .replace(/_/g, ":")
                  .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
              );
              child.castShadow = child.visible;
              child.material = getMaterial(
                MaterialId.Cartoon,
                child.material.map
              ).clone();
              child.geometry.computeBoundingBox();

              const collider = createColliderByObject({
                object: child,
                material: groundContactMaterial,
              });
              physicsWorld.add(collider);
              registerCameraCollider(child);

              const effect = ParticleCollection.createChestIdleEffect({
                position: child.position,
              });
              scene.add(effect);

              chests.push({
                data,
                object: child,
                collider,
                effect,
              });
            } else if (child.name.includes("door")) {
              registerDoorElement({ element: child, physicsWorld });
            } else {
              child.receiveShadow = true;
              if (child.name.includes("lava")) {
                child.material = getLavaMaterial(child.material);
              } else {
                child.material = getMaterial(
                  MaterialId.Cartoon,
                  child.material.map
                );
              }
            }
          }
        }
      });
      level = gltfScene;
      scene.add(gltfScene);
      onLoaded();
    }
  );
};

const createPlayers = (players, onComplete) => {
  players.forEach((player) => {
    if (player.id === _ownId) {
      setUserPosition(spawnPoints[player.spawnIndex]);
    } else {
      addUser({
        scene,
        id: player.id,
        name: player.userName,
        isOwn: player.id === _ownId,
        position: { ...spawnPoints[player.spawnIndex].position },
        rotation: spawnPoints[player.spawnIndex].rotation,
        kill: player.kill,
        die: player.die,
        sharedData,
      });
    }
  });
  onComplete();
};

function init() {
  tooltip = document.getElementById("tooltip");
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
  initUnitController();
  renderer.domElement.onclick = renderer.domElement.requestPointerLock;
  stats = new Stats();
  document.body.appendChild(stats.dom);
}

function onWindowResize() {
  updateCameraRatio();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const checkCollisions = ({ users, bullets }) => {
  const markedUsers = [];
  const markedBullets = [];
  if (users && users.length > 0 && bullets && bullets.length > 0)
    users.forEach((user) => {
      if (user.object && user.object.visible)
        bullets.forEach((bullet) => {
          if (bullet.mesh.visible && user.object && bullet.body) {
            const userPosition = user.object.position;
            const bulletPosition = bullet.body.position;
            if (
              userPosition.x - bulletPosition.x < 0.1 &&
              userPosition.y - bulletPosition.y < 0.1 &&
              userPosition.z - bulletPosition.z < 0.1
            ) {
              markedUsers.push(user);
              markedBullets.push(bullet);
            }
          }
        });
    });

  markedUsers.forEach((user) => {
    user.object.visible = false;
    _serverCall({
      header: "respawn",
      data: {
        id: user.id,
        targetName: user.name,
        killerName: getOwnUser().name,
      },
    });
  });

  markedBullets.forEach((bullet) => {
    bullet.mesh.visible = false;
  });
};

const die = () => {
  const users = getUsers();
  users[0].isDead = true;
};

const animate = () => {
  const now = Date.now();
  const rawDelta = clock.getDelta();
  const delta = rawDelta > 0.1 ? 0.1 : rawDelta;
  const elapsed = clock.getElapsedTime();

  const users = getUsers();
  const user = users?.[0];

  updateUnitController();
  updateParticleSystems({ delta, elapsed });

  chests.forEach((chest) => {
    const { object } = chest;
    if (object.position.distanceTo(users[0].object.position) < 1.5) {
      if (object.material.userData.outlineParameters?.thickness !== 0.002) {
        object.material.userData.outlineParameters = {
          thickness: 0.002,
          color: [1, 1, 0],
          alpha: 10,
        };
        selectedChest = chest;
      }
    } else if (
      object.material.userData.outlineParameters?.thickness !== 0.001
    ) {
      object.material.userData.outlineParameters = {
        thickness: 0.001,
        color: [0, 0, 0],
        alpha: 1,
      };
      selectedChest = null;
    }
  });

  updateDoors(user.object);

  tooltip.style.display = selectedChest ? "block" : "none";
  if (selectedChest) {
    const pos = toScreenPosition({
      object: selectedChest.object,
      camera: getCamera(),
      canvas,
    });
    tooltip.style.left = `${Math.floor(pos.x)}px`;
    tooltip.style.top = `${Math.floor(pos.y) - 150}px`;
  }

  physicsWorld.step(delta);
  updateBullets({ scene, physicsWorld });

  if (users) {
    Object.keys(enemies).forEach((key) => {
      const enemy = enemies[key];
      const hasContact = intersect(
        calculateBoundingBox(enemy.child),
        users[0].calculateBoundingBox()
      );

      if (hasContact) die();
    });
  }

  const { isStanding } = users[0];

  light.position.x = users[0].object.position.x;
  light.position.y = users[0].object.position.y + 8;
  light.position.z = users[0].object.position.z;

  if (!users[0].isDead) {
    if (users[0].isHanging) {
      users[0].canClimbUp = !climbUpBlockers.find(
        (area) =>
          users[0].object.position.x > area.x + area.min.x - 0.5 &&
          users[0].object.position.x < area.x + area.max.x + 0.5 &&
          users[0].object.position.y + 1.5 > area.y + area.min.y &&
          users[0].object.position.y + 1.5 < area.y + area.max.y &&
          users[0].object.position.z > area.z + area.min.z - 0.5 &&
          users[0].object.position.z < area.z + area.max.z + 0.5
      );
      const canClimbLeft = !climbLeftBlockers.find(
        (area) =>
          users[0].object.position.x > area.x + area.min.x - 0.5 &&
          users[0].object.position.x < area.x + area.max.x + 0.5 &&
          users[0].object.position.y + 1.5 > area.y + area.min.y &&
          users[0].object.position.y + 1.5 < area.y + area.max.y &&
          users[0].object.position.z > area.z + area.min.z - 0.5 &&
          users[0].object.position.z < area.z + area.max.z + 0.5
      );
      const canClimbRight = !climbRightBlockers.find(
        (area) =>
          users[0].object.position.x > area.x + area.min.x - 0.5 &&
          users[0].object.position.x < area.x + area.max.x + 0.5 &&
          users[0].object.position.y + 1.5 > area.y + area.min.y &&
          users[0].object.position.y + 1.5 < area.y + area.max.y &&
          users[0].object.position.z > area.z + area.min.z - 0.5 &&
          users[0].object.position.z < area.z + area.max.z + 0.5
      );

      if (users[0].canClimbUp && unitControllerState.forward.pressed) {
        if (!users[0].isClimbingUp) {
          users[0].isClimbingUp = true;
          users[0].climbStartTime = now;
        }
      }
      if (users[0].isClimbingUp && now - users[0].climbStartTime >= 2534) {
        users[0].isHanging = false;
        users[0].isClimbingUp = false;
        users[0].isStanding = true;
        users[0].isJumpTriggered = false;
        users[0].climbEndTime = now;
        users[0].velocity = 0;
        users[0].shimmyVelocity = 0;
        users[0].physics.position.set(
          users[0].physics.position.x +
            (users[0].climbingUpDirection === 90
              ? -0.5
              : users[0].climbingUpDirection === -90
              ? 0.5
              : 0),
          users[0].physics.position.y + 1.6,
          users[0].physics.position.z +
            (users[0].climbingUpDirection === 180
              ? -0.5
              : users[0].climbingUpDirection === 0
              ? 0.5
              : 0)
        );
      }

      if (!users[0].isClimbingUp) {
        velocity = 0.0;
        if (unitControllerState.left.pressed && canClimbLeft) velocity = 1;
        else if (unitControllerState.right.pressed && canClimbRight)
          velocity = -1;
        let relativeVector = new CANNON.Vec3(velocity * delta, 0, 0);
        users[0].physics.quaternion.vmult(relativeVector, relativeVector);
        users[0].physics.position.vadd(
          relativeVector,
          users[0].physics.position
        );
        users[0].shimmyVelocity = velocity;
      }
    } else {
      users[0].isClimbingUp = false;
      users[0].shimmyVelocity = 0;
      const cameraRotation = getTPSCameraRotation();
      if (now - users[0].climbEndTime > 400) {
        velocity = 0.0;
        if (unitControllerState.forward.pressed)
          velocity =
            (unitControllerState.walk.pressed ? 1 : 3.5) *
            Math.max(
              unitControllerState.forward.value,
              unitControllerState.left.value,
              unitControllerState.right.value
            );
        else if (unitControllerState.backward.pressed)
          velocity =
            (unitControllerState.walk.pressed ? -0.75 : -2) *
            Math.max(
              unitControllerState.backward.value,
              unitControllerState.left.value,
              unitControllerState.right.value
            );
        let relativeVector = new CANNON.Vec3(0, 0, velocity * delta);

        if (velocity !== 0) {
          users[0].targetRotation +=
            (cameraRotation.x - users[0].targetRotation) / (delta * 1000);
          users[0].physics.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            -users[0].targetRotation
          );
        }

        users[0].physics.quaternion.vmult(relativeVector, relativeVector);
        users[0].physics.position.vadd(
          relativeVector,
          users[0].physics.position
        );
        users[0].velocity = velocity;

        if (
          !unitControllerState.forward.pressed &&
          (unitControllerState.left.pressed ||
            unitControllerState.right.pressed)
        ) {
          users[0].targetRotation +=
            (cameraRotation.x - users[0].targetRotation) / (delta * 1000);
          users[0].physics.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            -users[0].targetRotation
          );
        }

        users[0].turn = 0;
        if (
          unitControllerState.forward.pressed ||
          unitControllerState.backward.pressed
        ) {
          if (unitControllerState.left.pressed) {
            updateTPSCameraRotation({
              x:
                -0.02 *
                unitControllerState.left.value *
                (unitControllerState.forward.pressed ? 1 : -1),
            });
          } else if (unitControllerState.right.pressed) {
            updateTPSCameraRotation({
              x:
                0.02 *
                unitControllerState.right.value *
                (unitControllerState.forward.pressed ? 1 : -1),
            });
          }
        } else {
          if (unitControllerState.left.pressed) {
            updateTPSCameraRotation({
              x: -0.03 * unitControllerState.left.value,
            });
            users[0].turn = 1;
          } else if (unitControllerState.right.pressed) {
            updateTPSCameraRotation({
              x: 0.03 * unitControllerState.right.value,
            });
            users[0].turn = -1;
          }

          // !!!!!! Sidling
          /* users[0].isSidling =
        unitControllerState.left.pressed || unitControllerState.right.pressed;

        const sidlingVelocity = users[0].isStanding
          ? unitControllerState.walk.pressed
            ? unitControllerState.backward.pressed
              ? 0.5
              : 1.5
            : unitControllerState.backward.pressed
            ? 0.5
            : velocity === 0
            ? 2.5
            : 1.5
          : 2;
        let sidlingRelativeVector = 0;
           if (unitControllerState.left.pressed) {
            if (velocity !== 0 && adventureTPSCamera) {
              users[0].targetRotation +=
                (adventureTPSCamera.getXRotation() - users[0].targetRotation) /
                (delta * 1000);
              users[0].physics.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                -users[0].targetRotation
              );
            }

            sidlingRelativeVector = new CANNON.Vec3(
              sidlingVelocity * delta,
              0,
              0
            );
            users[0].sidlingDirection = 1;
            users[0].physics.quaternion.vmult(
              sidlingRelativeVector,
              sidlingRelativeVector
            );
            users[0].physics.position.vadd(
              sidlingRelativeVector,
              users[0].physics.position
            );
          } else if (unitControllerState.right.pressed) {
            sidlingRelativeVector = new CANNON.Vec3(
              -sidlingVelocity * delta,
              0,
              0
            );
            users[0].sidlingDirection = -1;
            users[0].physics.quaternion.vmult(
              sidlingRelativeVector,
              sidlingRelativeVector
            );
            users[0].physics.position.vadd(
              sidlingRelativeVector,
              users[0].physics.position
            );
          } */
        }
      }

      if (
        users[0].isJumpTriggered &&
        isStanding &&
        Date.now() - users[0].jumpStartTime > 200
      ) {
        users[0].isJumpTriggered = false;
      }

      const hangingInfo = climbableAreas.find(
        ({ area }) =>
          unitControllerState.jump.pressed &&
          now - users[0].cancelHangingTime > 200 &&
          users[0].object.position.x > area.x + area.min.x - 0.55 &&
          users[0].object.position.x < area.x + area.max.x + 0.55 &&
          users[0].object.position.y + 1.5 > area.y + area.min.y &&
          users[0].object.position.y + 1.5 < area.y + area.max.y &&
          users[0].object.position.z > area.z + area.min.z - 0.55 &&
          users[0].object.position.z < area.z + area.max.z + 0.55
      );
      users[0].climbingUpDirection = hangingInfo?.direction;
      users[0].isHanging = hangingInfo;
      if (hangingInfo) {
        users[0].physics.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 1, 0),
          (hangingInfo.direction * Math.PI) / 180
        );
      }
    }

    stats.update();
  }

  updateUsers(delta);
  syncOwnUser({ serverCall: _serverCall, controls });
  syncOwnBullet({
    serverCall: _serverCall,
    isStarted: sharedData.state !== STATE.WAITING_FOR_START,
  });
  checkCollisions({ users: getUsers(), bullets: getBullets() });

  performance.mark("threejs-render-start-mark");

  if (lavaMaterial?.userData?.shader)
    lavaMaterial.userData.shader.uniforms.time.value += delta;

  outlineEffect.render(scene, getCamera());

  performance.mark("threejs-render-end-mark");
  performance.measure(
    "threejs-render-measure",
    "threejs-render-start-mark",
    "threejs-render-end-mark"
  );

  updateCamera(delta);

  if (USE_DEBUG_RENDERER) debugRenderer.update();

  requestAnimationFrame(animate);
};

onUnitControllerAction({
  action: UnitControllerAction.RotateCamera,
  callback: ({ x, y }) => updateTPSCameraRotation({ x, y }),
});

window.createWorld = ({
  serverCall,
  onReady,
  userName,
  players,
  userId = "ownId",
}) => {
  _ownId = userId;
  _gameMode = players.length === 4 ? "deathMatch" : "team";
  _serverCall = serverCall;
  sharedData.state = STATE.WAITING_FOR_START;

  loadAnimations({
    [AnimationId.WALK]: "./game/game-assets/3d/animations/walk.fbx",
    [AnimationId.WALK_BACK]: "./game/game-assets/3d/animations/walk-back.fbx",
    [AnimationId.RUN]: "./game/game-assets/3d/animations/run.fbx",
    [AnimationId.SPRINT]: "./game/game-assets/3d/animations/sprint.fbx",
    [AnimationId.RUN_BACK]: "./game/game-assets/3d/animations/run-back.fbx",
    [AnimationId.IDLE]: "./game/game-assets/3d/animations/idle.fbx",
    [AnimationId.FALLING_IDLE]:
      "./game/game-assets/3d/animations/falling-idle.fbx",
    [AnimationId.FALLING_LANDING]:
      "./game/game-assets/3d/animations/falling-landing.fbx",
    [AnimationId.HANGING]: "./game/game-assets/3d/animations/hanging.fbx",
    [AnimationId.SHIMMY_LEFT]:
      "./game/game-assets/3d/animations/shimmy-left.fbx",
    [AnimationId.SHIMMY_RIGHT]:
      "./game/game-assets/3d/animations/shimmy-right.fbx",
    [AnimationId.CLIMBING]: "./game/game-assets/3d/animations/climbing.fbx",
    [AnimationId.STANDING]: "./game/game-assets/3d/animations/standing.fbx",
    [AnimationId.VICTORY]: "./game/game-assets/3d/animations/victory.fbx",
    [AnimationId.DIE]: "./game/game-assets/3d/animations/die.fbx",
    [AnimationId.SIDLE_LEFT]: "./game/game-assets/3d/animations/sidle-left.fbx",
    [AnimationId.SIDLE_RIGHT]:
      "./game/game-assets/3d/animations/sidle-right.fbx",
    [AnimationId.DIE]: "./game/game-assets/3d/animations/die.fbx",
    [AnimationId.TURN_LEFT]: "./game/game-assets/3d/animations/turn-left.fbx",
    [AnimationId.TURN_RIGHT]: "./game/game-assets/3d/animations/turn-right.fbx",
  }).then(
    () => {
      loadTextures(assetConfig.textures, () => {
        physicsWorld = createPhysicsWorld();
        initUserManager(physicsWorld);
        initThreeJS();
        createSkyBox();
        loadLevel(() => {
          setCameraPosition(spawnPoints[0].position);

          addUser({
            scene,
            id: userId,
            name: userName,
            isOwn: true,
            position: {
              x: spawnPoints[0].position.x,
              y: spawnPoints[0].position.y,
              z: spawnPoints[0].position.z,
            },
            rotation: spawnPoints[0].rotation,
            onComplete: (user) => {
              setCameraTarget(user.object);
              onUnitControllerAction({
                action: UnitControllerAction.Jump,
                callback: () => {
                  const now = Date.now();
                  if (user.isStanding) {
                    user.isStanding = false;
                    user.isJumpTriggered = true;
                    user.physics.velocity.y = 10;
                  } else if (
                    user.isHanging &&
                    (!user.isClimbingUp ||
                      (user.isClimbingUp && now - user.climbStartTime < 1500))
                  ) {
                    user.isHanging = false;
                    user.cancelHangingTime = now;
                  }
                },
              });
              onUnitControllerAction({
                action: UnitControllerAction.Interaction,
                callback: () => {
                  if (selectedChest) {
                    const { object, collider, effect } = selectedChest;

                    effect.geometry.dispose();
                    effect.material.dispose();
                    scene.remove(effect);

                    const removeChest = () => {
                      object.parent.remove(object);
                      physicsWorld.remove(collider);
                      chests = chests.filter((chest) => chest != selectedChest);
                      selectedChest = null;
                    };

                    const collectEffect = ParticleCollection.createChestCollectEffect(
                      {
                        position: object.position,
                      }
                    );
                    scene.add(collectEffect);

                    gsap.to(object.scale, {
                      x: 0.1,
                      y: 0.1,
                      z: 0.1,
                      duration: 0.3,
                      delay: 0.6,
                      onComplete: removeChest,
                    });
                  }
                },
              });
              init();
              animate();

              console.log(`World is ready.`);
              onReady();
              createPlayers(players, () => {});
              physicsWorld.add(user.physics);
            },
            sharedData,
          });

          const runEnemyLogic = (enemy) => {
            gsap.to(enemy.child.position, {
              x: enemy.path[enemy.pathIndex].x,
              y: enemy.path[enemy.pathIndex].y,
              z: enemy.path[enemy.pathIndex].z,
              duration:
                (enemy.child.position.distanceTo(enemy.path[enemy.pathIndex]) /
                  1) *
                enemy.speed,
              ease: "linear",
              onComplete: () => {
                enemy.pathIndex++;
                if (enemy.pathIndex === enemy.path.length) enemy.pathIndex = 0;
                runEnemyLogic(enemy);
              },
            });

            const tweenValue = {
              rotation: 0,
            };
            gsap.to(tweenValue, {
              rotation: Math.PI,
              duration: 0.5,
              onUpdate: () => {
                enemy.child.rotation.z = tweenValue.rotation;
              },
            });
          };

          Object.keys(enemies).forEach((key) => {
            runEnemyLogic(enemies[key]);
          });
        });
      });
    },
    (error) => console.error("Failed!", error)
  );
};

window.addUsers = (users) => {
  users.forEach(({ id, name, position }) => {
    addUser({
      scene,
      id,
      name,
      isOwn: false,
      position,
      sharedData,
    });
  });
};
window.removeUser = (id) => removeUser({ scene, id });
window.touchController = {
  movement: { reportPercentages: (v) => (controller.movement = { ...v }) },
  rotation: { reportPercentages: (v) => (controller.rotation = { ...v }) },
};
window.actions = {
  jump: () => controls.jump(),
  shoot: () => shoot({ user: getOwnUser(), camera, physicsWorld, scene }),
};

// data gets an extra id param automatically by the server
window.serverMessage = ({ header, data }) => {
  switch (header) {
    case "start":
      sharedData.state = STATE.IN_PROGRESS;
      break;

    case "updatePosition":
      if (data.type === "user") syncUser(data);
      if (data.type === "bullet") syncBulletPosition({ ...data, scene });
      break;

    case "respawn":
      const user = getUsers().find((u) => u.id === data.id);
      if (user) {
        if (user.object) user.object.visible = true;
        const spawnPoint = spawnPoints[data.spawnIndex];
        if (user.id === getOwnUser().id) {
          setUserPosition(spawnPoint.position);
        } else {
          user.object.position.x = spawnPoint.position.x;
          user.object.position.y = spawnPoint.position.y;
          user.object.position.z = spawnPoint.position.z;
        }
      }

    default:
  }
};

document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);
