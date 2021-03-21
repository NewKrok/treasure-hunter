import { FBXLoader } from "../../lib/jsm/loaders/FBXLoader.js";
import { AnimationMixer } from "../../build/three.module.js";
import { getAnimation, getTexture } from "../assets.js";
import { AnimationId, TextureId } from "../../assets-config.js";
import { characterContactMaterial } from "../physics/physics.js";

let cartoonMaterial = null;
const getCartoonMaterial = ({ map }) => {
  if (cartoonMaterial) return cartoonMaterial;
  cartoonMaterial = new THREE.MeshToonMaterial({ map });
  cartoonMaterial.emissiveIntensity = 0;
  cartoonMaterial.skinning = true;
  return cartoonMaterial;
};

export const create = ({
  id,
  name,
  position,
  rotation,
  isOwn,
  scene,
  onComplete,
}) => {
  console.log(`Create user for ${id}`);
  let body = null;
  let activeAction = null;

  const objLoader = new FBXLoader();
  const animations = [];

  objLoader.load(
    "./game/game-assets/3d/characters/adventurer-1.fbx",
    (object) => {
      object.scale.set(0.007, 0.007, 0.007);
      object.position.set(position.x, position.y, position.z);

      object.traverse((child) => {
        if (child.isMesh) {
          child.material = getCartoonMaterial({
            map: getTexture(TextureId.ADVENTURES_TEXTURE),
          });
          child.castShadow = true;
        }
      });
      scene.add(object);

      const mixer = new AnimationMixer(object);

      const addAnimation = (key) => {
        const anim = getAnimation(key);
        const animClip = mixer.clipAction(anim);
        animations[key] = animClip;
      };

      addAnimation(AnimationId.WALK);
      addAnimation(AnimationId.WALK_BACK);
      addAnimation(AnimationId.RUN);
      addAnimation(AnimationId.SPRINT);
      addAnimation(AnimationId.RUN_BACK);
      addAnimation(AnimationId.IDLE);
      addAnimation(AnimationId.FALLING_IDLE);
      addAnimation(AnimationId.FALLING_LANDING);
      addAnimation(AnimationId.HANGING);
      addAnimation(AnimationId.SHIMMY_LEFT);
      addAnimation(AnimationId.SHIMMY_RIGHT);
      addAnimation(AnimationId.CLIMBING);
      addAnimation(AnimationId.STANDING);
      addAnimation(AnimationId.VICTORY);
      addAnimation(AnimationId.DIE);
      addAnimation(AnimationId.SIDLE_LEFT);
      addAnimation(AnimationId.SIDLE_RIGHT);
      addAnimation(AnimationId.TURN_LEFT);
      addAnimation(AnimationId.TURN_RIGHT);

      activeAction = animations[AnimationId.IDLE];
      activeAction.reset();
      activeAction.play();
      scene.add(object);

      const mass = 5;
      const radius = 0.3;
      const shape = new CANNON.Sphere(radius);
      body = new CANNON.Body({
        mass: mass,
        material: characterContactMaterial,
      });
      body.addShape(shape);
      body.position.set(position.x, position.y, position.z);
      body.quaternion.setFromEuler(0, rotation, 0, "XYZ");
      body.linearDamping = 0.9;
      body.fixedRotation = true;
      body.updateMassProperties();

      if (onComplete)
        onComplete({
          isOwn,
          id,
          name,
          position,
          object: object,
          calculateBoundingBox: () => ({
            minX: object.position.x - 0.1,
            maxX: object.position.x + 0.1,
            minY: object.position.y - 0,
            maxY: object.position.y + 0.5,
            minZ: object.position.z - 0.1,
            maxZ: object.position.z + 0.1,
          }),
          physics: body,
          mixer,
          isDead: false,
          hasAnimation: true,
          activeAnimation: "",
          animations,
          velocity: 0,
          turn: 0,
          isHanging: false,
          shimmyVelocity: 0,
          isSidling: false,
          sidlingDirection: 0,
          isClimbingUp: false,
          canClimbUp: true,
          climbStartTime: 0,
          climbEndTime: 0,
          climbingUpDirection: 0,
          cancelHangingTime: 0,
          contactNormal: new CANNON.Vec3(0, 0, 0),
          lastOnGroundTime: 0,
          isStanding: false,
          isJumpTriggered: false,
          wasJumpTriggered: false,
          jumpStartTime: 0,
          wasLanded: false,
          landingStartTime: 0,
          targetRotation: 0,
          updatePositions: () => {
            object.position.set(
              body.position.x,
              body.position.y - 0.3,
              body.position.z
            );
            object.quaternion.set(
              body.quaternion.x,
              body.quaternion.y,
              body.quaternion.z,
              body.quaternion.w
            );
          },
        });
    }
  );
};
