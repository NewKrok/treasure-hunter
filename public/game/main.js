import { GLTFLoader } from "./lib/jsm/loaders/GLTFLoader.js";
import Stats from "./lib/jsm/libs/stats.module.js";
import { CreateTrimesh } from "./src/utils/cannon-utils.js";
import { EffectComposer } from "./lib/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./lib/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "./lib/jsm/postprocessing/BokehPass.js";
import { OutlinePass } from "./lib/jsm/postprocessing/OutlinePass.js";
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

import { getAudio, getTexture, preload } from "./game-engine/assets/assets.js";
import {
  assetConfig,
  TextureId,
  AnimationId,
  AudioId,
} from "./assets-config.js";
import { teamLevels } from "./level-config.js";
import { loadAnimations } from "./game-engine/assets/animation-preloader.js";
import { calculateBoundingBox, intersect } from "./src/utils/threejs-utils.js";
import { createColliderByObject } from "./src/utils/cannon-utils.js";

import {
  initUnitActions,
  updateUnitActions,
  unitActionState,
  onUnitAction,
  UnitAction,
} from "./src/control/unit-action-manager.js";
import { updateParticleSystems } from "./src/effects/particle-system/particle-defaults.js";
import { registerChest, collectChest, updateChests } from "./src/chests.js";
import { registerDoorElement, updateDoors } from "./src/doors.js";
import {
  createCamera,
  registerCameraCollider,
  updateCameraRatio,
  setCameraPosition,
  updateCamera,
  setCameraTarget,
  updateTPSCameraRotation,
} from "./game-engine/camera/camera.js";
import {
  setUnitControllerTarget,
  updateUnitController,
} from "./src/control/unit-controller.js";
import { updateTooltips } from "./src/tooltips.js";
import {
  connectExternalCall,
  sendExternalCall,
} from "./src/external-communicator.js";
import { ParticleCollection } from "./src/effects/particle-system/particle-collection.js";
import { Vector3 } from "./build/three.module.js";

const USE_DEBUG_RENDERER = false;
let debugRenderer = null;

export const STATE = {
  WAITING_FOR_START: "WAITING_FOR_START",
  IN_PROGRESS: "IN_PROGRESS",
};

const clock = new THREE.Clock();
const controller = { movement: { x: 0, y: 0 }, rotation: { x: 0, y: 0 } };

let physicsWorld;
let scene;
let stats;
let renderer;
let canvas;
let light;
let controls;
let spawnPoints = [];
let climbableAreas = [];
let climbUpBlockers = [];
let climbLeftBlockers = [];
let climbRightBlockers = [];
const enemies = {};
const colliders = [];

export const getColliders = () => colliders;

const sharedData = {
  state: STATE.WAITING_FOR_START,
};

const postprocessing = {};
let outlinePass;

//let outlineEffect;
let lavaMaterial;

let _ownId = "";
let _gameMode = "";
let _serverCall = (args) => {};

const initThreeJS = () => {
  const camera = createCamera().perspectiveCamera;

  scene = new THREE.Scene();

  var alight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(alight);

  light = new THREE.PointLight(0xffffff, 1, 100);
  light.power = 300;
  light.position.set(0, 5, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

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
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  /*outlineEffect = new THREE.OutlineEffect(renderer, {
    defaultThickness: 0.001,
    defaultColor: [0, 0, 0],
    defaultAlpha: 1,
    defaultKeepAlive: true,
  });*/

  const renderPass = new RenderPass(scene, camera);

  const bokehPass = new BokehPass(scene, camera, {
    focus: 10.0,
    aperture: 0.0002,
    maxblur: 0.01,

    width: window.innerWidth,
    height: window.innerHeight,
  });
  bokehPass.materialDepth.skinning = true;

  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
    []
  );
  outlinePass.depthMaterial.skinning = true;
  outlinePass.prepareMaskMaterial.skinning = true;

  const composer = new EffectComposer(renderer);

  composer.addPass(renderPass);
  //composer.addPass(outlinePass);
  composer.addPass(bokehPass);

  postprocessing.composer = composer;
  //postprocessing.bokeh = bokehPass;

  const effect = ParticleCollection.createCloudEffect({
    position: new Vector3(10, 0, 0),
  });
  scene.add(effect);

  if (USE_DEBUG_RENDERER) {
    debugRenderer = new THREE.CannonDebugRenderer(scene, physicsWorld);
  }
};

const createSkyBox = () => {
  const materialArray = [
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SkyBox1) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SkyBox2) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SkyBox3) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SkyBox4) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SkyBox5) }),
    new THREE.MeshBasicMaterial({ map: getTexture(TextureId.SkyBox6) }),
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
              if (!child.userData.isCameraBlocker)
                registerCameraCollider(child);
              colliders.push(child);
            } else if (child.name.includes("Camera-Blocker")) {
              child.visible = false;
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
              registerChest({ element: child, physicsWorld, scene });
            } else if (child.name.includes("door")) {
              registerDoorElement({ element: child, physicsWorld });
            } else if (child.name.includes("fire")) {
              child.visible = false;
              const effect = ParticleCollection.createFireEffect({
                position: child.position.add(new Vector3(-0.1, 0.1, -0.1)),
                size: child.userData?.size || 1,
              });
              scene.add(effect);
            } else if (child.name.includes("Lava")) {
              child.receiveShadow = false;
              child.material.roughness = 0;
              child.material.metalness = 1;
              lavaMaterial = child.material;
              lavaMaterial.onBeforeCompile = (shader) => {
                shader.uniforms.time = { value: 0 };
                shader.uniforms.noiseTexture = {
                  value: getTexture(TextureId.Noise1),
                };
                shader.vertexShader = [
                  "uniform sampler2D noiseTexture;",
                  "uniform float time;",
                  "varying vec4 noiseOut;",
                  shader.vertexShader,
                ].join("\n");

                shader.vertexShader = shader.vertexShader.replace(
                  "#include <project_vertex>",
                  [
                    "#include <project_vertex>",
                    "vec4 noise = texture2D(noiseTexture, vec2(64.0 * cos(time * 0.001) * cos(position.x) * cos(position.y), 64.0 * sin(time * 0.001) * sin(position.z) * cos(position.z)));",
                    "vec4 modelViewPosition = modelViewMatrix * vec4(position.x + (sin(time * 0.02) * cos(time * 0.02) * 0.01), position.y + noise.x * 0.5, position.z * 1.1, 1.0);",
                    "gl_Position = projectionMatrix * modelViewPosition;",
                    "noiseOut = noise;",
                  ].join("\n")
                );

                shader.fragmentShader = [
                  "uniform float time;",
                  "varying vec4 noiseOut;",
                  shader.fragmentShader,
                ].join("\n");
                shader.fragmentShader = shader.fragmentShader.replace(
                  "}",
                  ["gl_FragColor *= noiseOut.x;", "}"].join("\n")
                );

                lavaMaterial.userData.shader = shader;
              };
            } else {
              child.receiveShadow = true;
              if (!child.name.includes("Landscape")) {
                child.material.flatShading = true;
              }
            }
          }
        }
      });
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
  connectExternalCall();
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
  initUnitActions();
  onUnitAction({
    action: UnitAction.RotateCamera,
    callback: ({ x, y }) => updateTPSCameraRotation({ x, y }),
  });
  onUnitAction({
    action: UnitAction.Pause,
    callback: () => sendExternalCall({ action: "pauseGame" }),
  });
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
  const ownUser = getOwnUser();
  if (users && users.length > 0 && bullets && bullets.length > 0)
    users.forEach((user) => {
      if (user.object && user.object.visible && user != ownUser)
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

  markedBullets.forEach((bullet) => {
    bullet.mesh.visible = false;
  });
};

const die = () => {
  const users = getUsers();
  users[0].isDead = true;
};

const updateData = {};
const updateWithReducer = ({ id, callback, minDelta, elapsed }) => {
  if (!updateData[id]) updateData[id] = { lastUpdate: 0 };

  if (elapsed - updateData[id].lastUpdate > minDelta) {
    callback();
    updateData[id].lastUpdate = elapsed;
  }
};

const animate = () => {
  const now = Date.now();
  const rawDelta = clock.getDelta();
  const delta = rawDelta > 0.1 ? 0.1 : rawDelta;
  const elapsed = clock.getElapsedTime();

  const users = getUsers();
  const user = users?.[0];

  updateUnitActions();
  updateUnitController({ now, delta });
  updateParticleSystems({ delta, elapsed });
  updateWithReducer({
    id: "updateTooltips",
    callback: updateTooltips,
    minDelta: 0.05,
    elapsed,
  });
  updateChests(user);
  updateDoors(user);

  physicsWorld.step(delta);
  updateBullets({ scene, colliders });

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

  light.position.x = users[0].object.position.x;
  light.position.y = users[0].object.position.y + 15;
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

      if (users[0].canClimbUp && unitActionState.forward.pressed) {
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
        let velocity = 0.0;
        if (unitActionState.left.pressed && canClimbLeft) velocity = 1;
        else if (unitActionState.right.pressed && canClimbRight) velocity = -1;
        let relativeVector = new CANNON.Vec3(velocity * delta, 0, 0);
        users[0].physics.quaternion.vmult(relativeVector, relativeVector);
        users[0].physics.position.vadd(
          relativeVector,
          users[0].physics.position
        );
        users[0].shimmyVelocity = velocity;
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

  //outlineEffect.render(scene, getCamera());
  postprocessing.composer.render(0.1);

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

  preload(assetConfig).then(() =>
    loadAnimations({
      [AnimationId.WALK]: "./game/game-assets/3d/animations/walk.fbx",
      [AnimationId.WALK_BACK]: "./game/game-assets/3d/animations/walk-back.fbx",
      [AnimationId.WALK_BACK_PISTOL]:
        "./game/game-assets/3d/animations/walk-back-pistol.fbx",
      [AnimationId.WALK_CROUCH]:
        "./game/game-assets/3d/animations/walk-crouch.fbx",
      [AnimationId.WALK_PISTOL]:
        "./game/game-assets/3d/animations/walk-pistol.fbx",
      [AnimationId.PISTOL_STRAFE]:
        "./game/game-assets/3d/animations/pistol-strafe.fbx",
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
      [AnimationId.SIDLE_LEFT]:
        "./game/game-assets/3d/animations/sidle-left.fbx",
      [AnimationId.SIDLE_RIGHT]:
        "./game/game-assets/3d/animations/sidle-right.fbx",
      [AnimationId.DIE]: "./game/game-assets/3d/animations/die.fbx",
      [AnimationId.TURN_LEFT]: "./game/game-assets/3d/animations/turn-left.fbx",
      [AnimationId.TURN_RIGHT]:
        "./game/game-assets/3d/animations/turn-right.fbx",
      [AnimationId.SLASH]: "./game/game-assets/3d/animations/slash.fbx",
      [AnimationId.SHOOTING_PISTOL]:
        "./game/game-assets/3d/animations/shooting-pistol.fbx",
      [AnimationId.CHANGE_WEAPON]:
        "./game/game-assets/3d/animations/change-weapon.fbx",
      [AnimationId.AIM]: "./game/game-assets/3d/animations/idle-pistol.fbx",
    }).then(
      () => {
        physicsWorld = createPhysicsWorld();
        initUserManager(physicsWorld);
        initThreeJS();
        createSkyBox();
        loadLevel(() => {
          setCameraPosition(spawnPoints[0].position);

          addUser({
            scene,
            useDebugRender: USE_DEBUG_RENDERER,
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
              //outlinePass.selectedObjects = [user.object];
              setCameraTarget(user.object);
              setUnitControllerTarget({ target: user, physicsWorld });
              onUnitAction({
                action: UnitAction.Interaction,
                callback: () => collectChest({ scene, physicsWorld }),
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

          const backgroundMusic = getAudio(AudioId.GameBackground);
          backgroundMusic.play();

          Object.keys(enemies).forEach((key) => {
            runEnemyLogic(enemies[key]);
          });
        });
      },
      (error) => console.error("Failed!", error)
    )
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
  shoot: () => shoot({ user: getOwnUser(), camera, scene }),
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
