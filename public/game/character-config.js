import { AnimationId, FBXModelId } from "./assets-config.js";
import { CharacterPosition } from "./game-engine/character/base-character.js";

export const CharacterId = {
  Skeleton: "Skeleton",
};

export const characterConfig = {
  [CharacterId.Skeleton]: {
    model: FBXModelId.CharacterSkeleton,
    scale: 0.009,
    mass: 5,
    radius: 0.3,
    animations: {
      idle: AnimationId.SKELETON_IDLE,
      walk: AnimationId.SKELETON_WALK,
      run: AnimationId.SKELETON_RUN,
    },
    attachments: [
      {
        target: CharacterPosition.HandRight,
        model: FBXModelId.SwordMedium07,
        scale: 1,
        offset: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, Math.PI / 2, 0),
      },
    ],
  },
};
