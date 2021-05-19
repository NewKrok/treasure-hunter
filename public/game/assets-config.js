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
};

export const TextureId = {
  AdventurerTexture: "adventurer-texture",
  SkyBox1: "sky-box-1",
  SkyBox2: "sky-box-2",
  SkyBox3: "sky-box-3",
  SkyBox4: "sky-box-4",
  SkyBox5: "sky-box-5",
  SkyBox6: "sky-box-6",
  Particle: "particle",
  Smoke: "smoke",
  SmokeBig: "smoke-big",
};

export const FBXModelId = {
  Hat1: "hat-1",
  Machete: "machete",
  Pistol: "pistol",
};

export const MaterialId = {
  Cartoon: "Cartoon",
};

export const assetConfig = {
  textures: [
    {
      url: "./game/game-assets/3d/characters/adventurers-texture.png",
      id: TextureId.AdventurerTexture,
    },
    {
      url: "./game/game-assets/textures/skybox/sb_1.jpg",
      id: TextureId.SkyBox1,
    },
    {
      url: "./game/game-assets/textures/skybox/sb_2.jpg",
      id: TextureId.SkyBox2,
    },
    {
      url: "./game/game-assets/textures/skybox/sb_3.jpg",
      id: TextureId.SkyBox3,
    },
    {
      url: "./game/game-assets/textures/skybox/sb_4.jpg",
      id: TextureId.SkyBox4,
    },
    {
      url: "./game/game-assets/textures/skybox/sb_5.jpg",
      id: TextureId.SkyBox5,
    },
    {
      url: "./game/game-assets/textures/skybox/sb_6.jpg",
      id: TextureId.SkyBox6,
    },
    {
      url: "./game/game-assets/textures/effects/particle.jpg",
      id: TextureId.Particle,
    },
    {
      url: "./game/game-assets/textures/effects/smoke.jpg",
      id: TextureId.Smoke,
    },
    {
      url: "./game/game-assets/textures/effects/smoke-big.jpg",
      id: TextureId.SmokeBig,
    },
  ],
  fbxModels: [
    {
      url: "./game/game-assets/3d/items/hat-1.fbx",
      id: FBXModelId.Hat1,
    },
    {
      url: "./game/game-assets/3d/items/machete.fbx",
      id: FBXModelId.Machete,
    },
    {
      url: "./game/game-assets/3d/items/pistol.fbx",
      id: FBXModelId.Pistol,
    },
  ],
};
