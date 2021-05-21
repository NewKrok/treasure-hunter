const defaultParticleSystemVertexShader = `
  attribute float opacity;
  attribute float size;
  attribute float angle;
  attribute float colorR;
  attribute float colorG;
  attribute float colorB;

  varying vec4 vColor;
  varying float vAngle;

  void main()
  {
    vColor = vec4(colorR, colorG, colorB, opacity);
    vAngle = angle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = size * (100.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const defaultParticleSystemFragmentShader = `
  uniform sampler2D map;

  varying vec4 vColor;
  varying float vAngle;

  void main()
  {
    gl_FragColor = vColor;
    float x = (gl_PointCoord.x - 0.5) * cos(vAngle);
    float y = (gl_PointCoord.y - 0.5) * sin(vAngle);
    float xR = (gl_PointCoord.y - 0.5) * cos(vAngle);
    float yR = (gl_PointCoord.x - 0.5) * sin(vAngle);
    vec2 rotatedUV = vec2(x + y + 0.5, xR - yR + 0.5);
    vec4 rotatedTexture = texture2D(map,  rotatedUV);
    
    gl_FragColor = gl_FragColor * rotatedTexture;
  }
`;

let createdParticleSystems = [];

export const createParticleSystem = ({
  map,
  particleCount,
  startPosition: { x, y, z },
  size = { min: 1, max: 1 },
  opacity = { min: 1, max: 1 },
  colorR = 1.0,
  colorG = 1.0,
  colorB = 1.0,
  onUpdate,
}) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: {
        value: map,
      },
    },
    vertexShader: defaultParticleSystemVertexShader,
    fragmentShader: defaultParticleSystemFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setFromPoints(
    Array.from({ length: particleCount }, () => ({
      x: THREE.MathUtils.randFloat(x.min, x.max),
      y: THREE.MathUtils.randFloat(y.min, y.max),
      z: THREE.MathUtils.randFloat(z.min, z.max),
    }))
  );

  geometry.setAttribute(
    "angle",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => 0)),
      1
    )
  );

  geometry.setAttribute(
    "size",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, () =>
          THREE.MathUtils.randFloat(size.min, size.max)
        )
      ),
      1
    )
  );

  geometry.setAttribute(
    "opacity",
    new THREE.BufferAttribute(
      new Float32Array(
        Array.from({ length: particleCount }, () =>
          THREE.MathUtils.randFloat(opacity.min, opacity.max)
        )
      ),
      1
    )
  );

  geometry.setAttribute(
    "colorR",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => colorR)),
      1
    )
  );

  geometry.setAttribute(
    "colorG",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => colorG)),
      1
    )
  );

  geometry.setAttribute(
    "colorB",
    new THREE.BufferAttribute(
      new Float32Array(Array.from({ length: particleCount }, () => colorB)),
      1
    )
  );

  const particleSystem = new THREE.Points(geometry, material);
  particleSystem.sortParticles = true;

  createdParticleSystems.push({
    particleSystem,
    onUpdate,
    creationTime: Date.now(),
  });
  return particleSystem;
};

export const destroyParticleSystem = (particleSystem) => {
  createdParticleSystems = createdParticleSystems.filter(
    (entry) => entry != particleSystem
  );

  particleSystem.geometry.dispose();
  particleSystem.material.dispose();
  particleSystem.parent.remove(particleSystem);
};

export const updateParticleSystems = ({ delta, elapsed }) => {
  const now = Date.now();
  createdParticleSystems.forEach(({ onUpdate, particleSystem, creationTime }) =>
    onUpdate({ particleSystem, delta, elapsed, lifeTime: now - creationTime })
  );
};
