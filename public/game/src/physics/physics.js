export let groundContactMaterial = null;
export let characterContactMaterial = null;

export const createPhysicsWorld = () => {
  const world = new CANNON.World();
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;
  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRelaxation = 4;

  const solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  world.solver = new CANNON.SplitSolver(solver);

  world.gravity.set(0, -20, 0);
  world.broadphase = new CANNON.NaiveBroadphase();

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
  world.addContactMaterial(groundContactMaterial);

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
  world.addContactMaterial(characterContactMaterial);

  return world;
};
