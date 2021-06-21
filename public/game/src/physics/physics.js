export let groundContactMaterial = null;
export let characterContactMaterial = null;

let physicsWorld = null;
export const getPhysicsWorld = () => physicsWorld;

export const createPhysicsWorld = () => {
  physicsWorld = new CANNON.World();
  physicsWorld.quatNormalizeSkip = 0;
  physicsWorld.quatNormalizeFast = false;
  physicsWorld.defaultContactMaterial.contactEquationStiffness = 1e9;
  physicsWorld.defaultContactMaterial.contactEquationRelaxation = 4;

  const solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  physicsWorld.solver = new CANNON.SplitSolver(solver);

  physicsWorld.gravity.set(0, -20, 0);
  physicsWorld.broadphase = new CANNON.NaiveBroadphase();

  var groundMaterial = new CANNON.Material("groundMaterial");
  groundContactMaterial = new CANNON.ContactMaterial(
    groundMaterial,
    groundMaterial,
    {
      friction: 0.6,
      restitution: 0.3,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e8,
      frictionEquationRegularizationTime: 3,
    }
  );
  physicsWorld.addContactMaterial(groundContactMaterial);

  const physicsMaterial = new CANNON.Material("slipperyMaterial");
  characterContactMaterial = new CANNON.ContactMaterial(
    groundMaterial,
    physicsMaterial,
    {
      friction: 0.01,
      restitution: 0.3,
      contactEquationStiffness: 1e10,
      contactEquationRelaxation: 3,
    }
  );
  physicsWorld.addContactMaterial(characterContactMaterial);

  return physicsWorld;
};
