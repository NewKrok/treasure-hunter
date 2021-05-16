import {
  ButtonKey,
  getButtonState,
  initGamepadManager,
  updateGamePad,
} from "./gamepad.js";

const actionHandlers = [];

export const UnitAction = {
  Forward: "Forward",
  Backward: "Backward",
  Left: "Left",
  Right: "Right",
  Run: "Run",
  Jump: "Jump",
  Attack: "Attack",
  Crouch: "Crouch",
  Aim: "Aim",
  ChooseWeapon1: "ChooseWeapon1",
  ChooseWeapon2: "ChooseWeapon2",
  RotateCamera: "RotateCamera",
  Interaction: "Interaction",
  Pause: "Pause",
};

export const unitActionState = {
  forward: { pressed: false, value: 0 },
  backward: { pressed: false, value: 0 },
  left: { pressed: false, value: 0 },
  right: { pressed: false, value: 0 },
  run: { pressed: false, value: 0 },
  jump: { pressed: false, value: 0 },
  attack: { pressed: false, value: 0 },
  crouch: { pressed: false, value: 0 },
  aim: { pressed: false, value: 0 },
  chooseWeapon1: { pressed: false, value: 0 },
  chooseWeapon2: { pressed: false, value: 0 },
  interaction: { pressed: false, value: 0 },
  pause: { pressed: false, value: 0 },
};

const keys = {
  a: false,
  s: false,
  d: false,
  w: false,
  e: false,
  1: false,
  2: false,
  arrowup: false,
  arrowdown: false,
  arrowleft: false,
  arrowright: false,
  shift: false,
  control: false,
  space: false,
  escape: false,
};

const trigger = ({ action, value }) => {
  actionHandlers.forEach(
    (entry) =>
      entry.action === action &&
      (value ? entry.callback(value) : entry.callback())
  );
};

const calculateState = ({
  prevState,
  axis,
  keys,
  gamepadButton,
  action,
  axisValidator = (v) => v != 0,
  axisValueModifier = (v) => v,
}) => {
  const axisValue = axis ? getButtonState(axis).value : 0;
  const validatedAxisValue = axis ? axisValidator(axisValue) : false;
  const pressed = keys.includes(true) || getButtonState(gamepadButton).pressed;
  const value = validatedAxisValue
    ? axisValueModifier(axisValue)
    : pressed
    ? 1
    : 0;
  const newState = {
    pressed: pressed || validatedAxisValue,
    value,
  };

  if (newState.pressed && newState.pressed != prevState.pressed)
    trigger({ action, value });

  return newState;
};

const updateForwardState = () => {
  unitActionState.forward = calculateState({
    prevState: unitActionState.forward,
    axis: ButtonKey.LeftAxisY,
    axisValidator: (v) => v < -0.1,
    axisValueModifier: (v) => v * -1,
    keys: [keys.w || keys.arrowup],
    gamepadButton: ButtonKey.Up,
    action: UnitAction.Forward,
  });
};

const updateBackwardState = () => {
  unitActionState.backward = calculateState({
    prevState: unitActionState.backward,
    axis: ButtonKey.LeftAxisY,
    axisValidator: (v) => v > 0.1,
    keys: [keys.s || keys.arrowdown],
    gamepadButton: ButtonKey.Down,
    action: UnitAction.Backward,
  });
};

const updateLeftState = () => {
  unitActionState.left = calculateState({
    prevState: unitActionState.left,
    axis: ButtonKey.LeftAxisX,
    axisValidator: (v) => v < -0.1,
    axisValueModifier: (v) => v * -1,
    keys: [keys.a || keys.arrowleft],
    gamepadButton: ButtonKey.Left,
    action: UnitAction.Left,
  });
};

const updateRightState = () => {
  unitActionState.right = calculateState({
    prevState: unitActionState.right,
    axis: ButtonKey.LeftAxisX,
    axisValidator: (v) => v > 0.1,
    keys: [keys.d || keys.arrowright],
    gamepadButton: ButtonKey.Right,
    action: UnitAction.Right,
  });
};

const updateRunState = () => {
  unitActionState.run = calculateState({
    prevState: unitActionState.run,
    keys: [keys.shift],
    action: UnitAction.Run,
  });
};

const updateJumpState = () => {
  unitActionState.jump = calculateState({
    prevState: unitActionState.jump,
    keys: [keys.space],
    gamepadButton: ButtonKey.ActionBottom,
    action: UnitAction.Jump,
  });
};

const updateAttackState = () => {
  unitActionState.attack = calculateState({
    prevState: unitActionState.attack,
    keys: [],
    gamepadButton: ButtonKey.ActionLeft,
    action: UnitAction.Attack,
  });
};

const updateAimState = () => {
  unitActionState.aim = calculateState({
    prevState: unitActionState.aim,
    keys: [],
    gamepadButton: ButtonKey.RightTrigger,
    action: UnitAction.Aim,
  });
};

const updateChooseWeapon1State = () => {
  unitActionState.chooseWeapon1 = calculateState({
    prevState: unitActionState.chooseWeapon1,
    keys: [keys[1]],
    gamepadButton: ButtonKey.ActionLeft,
    action: UnitAction.ChooseWeapon1,
  });
};

const updateChooseWeapon2State = () => {
  unitActionState.chooseWeapon2 = calculateState({
    prevState: unitActionState.chooseWeapon2,
    keys: [keys[2]],
    gamepadButton: ButtonKey.LeftTrigger,
    action: UnitAction.ChooseWeapon2,
  });
};

const updateCrouchState = () => {
  unitActionState.crouch = calculateState({
    prevState: unitActionState.crouch,
    keys: [keys.control],
    gamepadButton: ButtonKey.RightAxisButton,
    action: UnitAction.Crouch,
  });
};

const updateInteractionState = () => {
  unitActionState.interaction = calculateState({
    prevState: unitActionState.interaction,
    keys: [keys.e],
    gamepadButton: ButtonKey.ActionLeft,
    action: UnitAction.Interaction,
  });
};

const updatePauseState = () => {
  unitActionState.pause = calculateState({
    prevState: unitActionState.pause,
    keys: [keys.escape],
    gamepadButton: ButtonKey.Options,
    action: UnitAction.Pause,
  });
};

export const updateUnitActions = () => {
  updateGamePad();

  updateForwardState();
  updateBackwardState();
  updateLeftState();
  updateRightState();
  updateRunState();
  updateJumpState();
  updateAttackState();
  updateCrouchState();
  updateAimState();
  updateChooseWeapon1State();
  updateChooseWeapon2State();
  updateInteractionState();
  updatePauseState();

  const rightAxisX = getButtonState(ButtonKey.RightAxisX).value;
  const rightAxisY = getButtonState(ButtonKey.RightAxisY).value;
  if (rightAxisX !== 0 || rightAxisY !== 0)
    trigger({
      action: UnitAction.RotateCamera,
      value: { x: rightAxisX / 35, y: rightAxisY / 35 },
    });
};

const getCharKey = (char) => {
  let key = char.toLowerCase();
  key = key === " " ? "space" : key;
  return key;
};

export const initUnitActions = () => {
  initGamepadManager();

  document.body.addEventListener("keydown", (e) => {
    const key = getCharKey(e.key);
    if (keys[key] !== undefined) keys[key] = true;
  });
  document.body.addEventListener("keyup", (e) => {
    const key = getCharKey(e.key);
    if (keys[key] !== undefined) keys[key] = false;
  });
  document.addEventListener("mousemove", ({ movementX, movementY }) => {
    trigger({
      action: UnitAction.RotateCamera,
      value: { x: movementX / 350, y: movementY / 350 },
    });
  });
  document.addEventListener("mousedown", (e) => {
    switch (e.button) {
      case 0:
        trigger({
          action: UnitAction.Attack,
          value: 1,
        });
        break;

      case 2:
        trigger({
          action: UnitAction.Aim,
          value: 1,
        });
        break;

      default:
    }
  });
};

export const onUnitAction = ({ action, callback }) => {
  actionHandlers.push({ action, callback });
};
