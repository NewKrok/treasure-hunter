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
  Walk: "Walk",
  Jump: "Jump",
  RotateCamera: "RotateCamera",
  Interaction: "Interaction",
  Pause: "Pause",
};

export const unitActionState = {
  forward: { pressed: false, value: 0 },
  backward: { pressed: false, value: 0 },
  left: { pressed: false, value: 0 },
  right: { pressed: false, value: 0 },
  walk: { pressed: false, value: 0 },
  jump: { pressed: false, value: 0 },
  interaction: { pressed: false, value: 0 },
  pause: { pressed: false, value: 0 },
};

const keys = {
  a: false,
  s: false,
  d: false,
  w: false,
  e: false,
  arrowup: false,
  arrowdown: false,
  arrowleft: false,
  arrowright: false,
  shift: false,
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

const updateWalkState = () => {
  unitActionState.walk = calculateState({
    prevState: unitActionState.walk,
    keys: [keys.shift],
    action: UnitAction.Walk,
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
  updateWalkState();
  updateJumpState();
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
};

export const onUnitAction = ({ action, callback }) => {
  actionHandlers.push({ action, callback });
};
