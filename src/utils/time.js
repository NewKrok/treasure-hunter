import { convertToTwoDigits } from "./number";

export const formatTime = (timeStamp) => {
  const secDelta = Math.floor((timeStamp / 1000) % 60);
  const minDelta = Math.floor((timeStamp / 1000 / 60) % 60);
  const hourDelta = Math.floor((timeStamp / 1000 / 60 / 60) % 24);

  const hourText = hourDelta > 0 ? `${hourDelta}:` : "";
  const minText = `${convertToTwoDigits(minDelta)}:`;
  const secText = convertToTwoDigits(secDelta);

  return `${hourText}${minText}${secText}`;
};
