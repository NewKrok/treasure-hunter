export const AnimationId = {
  IDLE: "ANIMATION.IDLE",
  WALK: "ANIMATION.WALK",
  WALK_BACK: "ANIMATION.WALK_BACK",
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
};

export const TextureId = {
  ADVENTURES_TEXTURE: "AdventurersTexture",
  SKY_BOX_1: "SkyBox1",
  SKY_BOX_2: "SkyBox2",
  SKY_BOX_3: "SkyBox3",
  SKY_BOX_4: "SkyBox4",
  SKY_BOX_5: "SkyBox5",
  SKY_BOX_6: "SkyBox6",
  Particle: "particle",
};

export const MaterialId = {
  Cartoon: "Cartoon",
};

export const assetConfig = {
  textures: [
    {
      url: "./game/game-assets/3d/characters/adventurers-texture.png",
      id: "AdventurersTexture",
    },
    {
      url: "./game/game-assets/textures/skybox/sb_1.jpg",
      id: "SkyBox1",
    },
    {
      url: "./game/game-assets/textures/skybox/sb_2.jpg",
      id: "SkyBox2",
    },
    {
      url: "./game/game-assets/textures/skybox/sb_3.jpg",
      id: "SkyBox3",
    },
    {
      url: "./game/game-assets/textures/skybox/sb_4.jpg",
      id: "SkyBox4",
    },
    {
      url: "./game/game-assets/textures/skybox/sb_5.jpg",
      id: "SkyBox5",
    },
    {
      url: "./game/game-assets/textures/skybox/sb_6.jpg",
      id: "SkyBox6",
    },
    {
      url: "./game/game-assets/textures/effects/particle.jpg",
      id: TextureId.Particle,
    },
  ],
};
