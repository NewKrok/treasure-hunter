export const AnimationId = {
  IDLE: "ANIMATION.IDLE",
  WALK: "ANIMATION.WALK",
  WALK_BACK: "ANIMATION.WALK_BACK",
  WALK_BACK_PISTOL: "ANIMATION.WALK_BACK_PISTOL",
  WALK_CROUCH: "ANIMATION.WALK_CROUCH",
  WALK_PISTOL: "ANIMATION.WALK_PISTOL",
  PISTOL_STRAFE: "ANIMATION.PISTOL_STRAFE",
  RUN: "ANIMATION.RUN",
  SPRINT: "ANIMATION.SPRINT",
  RUN_BACK: "ANIMATION.RUN_BACK",
  FALLING_IDLE: "ANIMATION.FALLING_IDLE",
  FALLING_LANDING: "ANIMATION.FALLING_LANDING",
  HANGING: "ANIMATION.HANGING",
  SHIMMY_LEFT: "ANIMATION.SHIMMY_LEFT",
  SHIMMY_RIGHT: "ANIMATION.SHIMMY_RIGHT",
  CLIMBING: "ANIMATION.CLIMBING",
  STANDING: "ANIMATION.STANDING",
  VICTORY: "ANIMATION.VICTORY",
  DIE: "ANIMATION.DIE",
  SIDLE_LEFT: "ANIMATION.SIDLE_LEFT",
  SIDLE_RIGHT: "ANIMATION.SIDLE_RIGHT",
  TURN_LEFT: "ANIMATION.TURN_LEFT",
  TURN_RIGHT: "ANIMATION.TURN_RIGHT",
  SLASH: "ANIMATION.SLASH",
  SHOOTING_PISTOL: "ANIMATION.SHOOTING_PISTOL",
  CHANGE_WEAPON: "ANIMATION.CHANGE_WEAPON",
  AIM: "ANIMATION.AIM",
  SKELETON_IDLE: "ANIMATION.SKELETON_IDLE",
};

export const TextureId = {
  AdventurerTexture: "AdventurerTexture",
  SkyBox1: "SkyBox1",
  SkyBox2: "SkyBox2",
  SkyBox3: "SkyBox3",
  SkyBox4: "SkyBox4",
  SkyBox5: "SkyBox5",
  SkyBox6: "SkyBox6",
  Particle: "Particle",
  Trail: "Trail",
  Smoke: "Smoke",
  SmokeBig: "SmokeBig",
  Noise1: "Noise1",
};

export const FBXModelId = {
  CharacterAdventurer: "CharacterAdventurer",
  CharacterSkeleton: "CharacterSkeleton",
  Hat1: "Hat1",
  Machete: "Machete",
  Pistol: "Pistol",
};

export const AudioId = {
  GameBackground: "GameBackground",
  Landing: "Landing",
  Jump: "Jump",
  PistolHit: "PistolHit",
  PistolShot: "PistolShot",
  FootStep: "FootStep",
  Aim: "Aim",
  ChangeToPistol: "ChangeToPistol",
  ChangeToMachete: "ChangeToMachete",
  MacheteAttack: "MacheteAttack",
  Switch: "Switch",
};

export const MaterialId = {
  Cartoon: "Cartoon",
};

export const assetConfig = {
  textures: [
    {
      id: TextureId.AdventurerTexture,
      url: "./game/game-assets/3d/characters/adventurers-texture.png",
    },
    {
      id: TextureId.DungeonsTexture01A,
      url: "./game/game-assets/textures/model-textures/dungeons_2_texture_01_a.jpg",
    },
    {
      id: TextureId.SkyBox1,
      url: "./game/game-assets/textures/skybox/sb_1.jpg",
    },
    {
      id: TextureId.SkyBox2,
      url: "./game/game-assets/textures/skybox/sb_2.jpg",
    },
    {
      id: TextureId.SkyBox3,
      url: "./game/game-assets/textures/skybox/sb_3.jpg",
    },
    {
      id: TextureId.SkyBox4,
      url: "./game/game-assets/textures/skybox/sb_4.jpg",
    },
    {
      id: TextureId.SkyBox5,
      url: "./game/game-assets/textures/skybox/sb_5.jpg",
    },
    {
      id: TextureId.SkyBox6,
      url: "./game/game-assets/textures/skybox/sb_6.jpg",
    },
    {
      id: TextureId.Particle,
      url: "./game/game-assets/textures/effects/particle.jpg",
    },
    {
      id: TextureId.Trail,
      url: "./game/game-assets/textures/effects/trail-55.png",
    },
    {
      id: TextureId.Smoke,
      url: "./game/game-assets/textures/effects/smoke.jpg",
    },
    {
      id: TextureId.SmokeBig,
      url: "./game/game-assets/textures/effects/smoke-big.jpg",
    },
    {
      id: TextureId.Noise1,
      url: "./game/game-assets/textures/effects/noise-1.jpg",
    },
  ],
  fbxModels: [
    {
      id: FBXModelId.Hat1,
      url: "./game/game-assets/3d/items/hat-1.fbx",
      textureId: TextureId.AdventurerTexture,
    },
    {
      id: FBXModelId.Machete,
      url: "./game/game-assets/3d/items/machete.fbx",
      textureId: TextureId.AdventurerTexture,
    },
    {
      id: FBXModelId.Pistol,
      url: "./game/game-assets/3d/items/pistol.fbx",
      textureId: TextureId.AdventurerTexture,
    },
    {
      id: FBXModelId.CharacterAdventurer,
      url: "./game/game-assets/3d/characters/adventurer-1.fbx",
      textureId: TextureId.AdventurerTexture,
    },
    {
      id: FBXModelId.CharacterSkeleton,
      url: "./game/game-assets/3d/characters/skeleton-a.fbx",
      textureId: TextureId.DungeonsTexture01A,
    },
  ],
  audio: [
    {
      id: AudioId.GameBackground,
      url: "./game/game-assets/audio/music/final-storm.ogg",
    },
    {
      id: AudioId.Landing,
      url: "./game/game-assets/audio/fx/jump-5.ogg",
    },
    {
      id: AudioId.Jump,
      url: "./game/game-assets/audio/fx/male-jump-3.ogg",
    },
    {
      id: AudioId.PistolHit,
      url: "./game/game-assets/audio/fx/concrete-7.ogg",
    },
    {
      id: AudioId.PistolShot,
      url: "./game/game-assets/audio/fx/revolver-shot-03.ogg",
    },
    {
      id: AudioId.FootStep,
      url: "./game/game-assets/audio/fx/stone-footstep-8.ogg",
    },
    {
      id: AudioId.Switch,
      url: "./game/game-assets/audio/fx/switch-sounds-19.ogg",
    },
    {
      id: AudioId.Aim,
      url: "./game/game-assets/audio/fx/cloth-item-ripped-2.ogg",
    },
    {
      id: AudioId.ChangeToPistol,
      url: "./game/game-assets/audio/fx/weapon-swap-3.ogg",
    },
    {
      id: AudioId.ChangeToMachete,
      url: "./game/game-assets/audio/fx/sword-woosh-2.ogg",
    },
    {
      id: AudioId.MacheteAttack,
      url: "./game/game-assets/audio/fx/sword-woosh-10.ogg",
    },
  ],
};

export const audioConfig = {
  [AudioId.GameBackground]: {
    loop: true,
  },
  [AudioId.FootStep]: {
    volume: 0.2,
  },
  [AudioId.Switch]: {
    volume: 0.5,
  },
  [AudioId.Landing]: {
    volume: 0.5,
  },
  [AudioId.Jump]: {
    volume: 0.2,
  },
  [AudioId.ChangeToPistol]: {
    volume: 0.5,
  },
  [AudioId.Aim]: {
    volume: 0.1,
  },
};
