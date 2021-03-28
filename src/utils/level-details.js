import { levelInfo } from "../asset/level-info";

export const GetSinglePlayerAreaDetails = ({ areaId }) => ({
  id: areaId,
  name: `area-${areaId}`,
});

export const GetSinglePlayerLevelDetails = ({ areaId, levelId }) => ({
  ...levelInfo.find(
    (entry) => entry.areaId === areaId && entry.levelId === levelId
  ),
  areaId,
  levelId,
  areaName: `area-${areaId}`,
  levelName: `title-${areaId}-${levelId}`,
  description: `description-${areaId}-${levelId}`,
});
