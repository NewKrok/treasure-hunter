import { convertToThreeDigits, convertToTwoDigits } from "./number";

let delta = 0;
let lastDeltaTime = Date.now();

const getTime = () => {
  const d = new Date(Date.now());
  return `${convertToTwoDigits(d.getHours())}:${convertToTwoDigits(
    d.getMinutes()
  )}:${convertToTwoDigits(d.getSeconds())}.${convertToThreeDigits(
    d.getMilliseconds()
  )}`;
};

const getDelta = () => {
  delta = Date.now() - lastDeltaTime;
  lastDeltaTime = Date.now();

  const msDelta = Math.floor(delta % 1000);
  const secDelta = Math.floor((delta / 1000) % 60);
  const minDelta = Math.floor((delta / 1000 / 60) % 60);

  return minDelta > 0
    ? `+${convertToTwoDigits(minDelta)}min`
    : secDelta > 0
    ? `+${convertToTwoDigits(secDelta)}sec`
    : `+${convertToThreeDigits(msDelta)}ms`;
};

const getLogMessage = (data) =>
  getDelta() +
  " | " +
  getTime() +
  " | " +
  data.map((d) => JSON.stringify(d)).join(", ");

export const info = (...data) => console.info(getLogMessage(data));

export const warn = (...data) => console.warn(getLogMessage(data));

export const error = (...data) => console.error(getLogMessage(data));
