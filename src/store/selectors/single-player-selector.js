import {
  GetSinglePlayerLevelDetails,
  GetSinglePlayerAreaDetails,
} from "../../utils/level-details";

export const GetSelectedSinglePlayerLevelId = (state) =>
  state.singlePlayerReducer.selectedLevelId;

export const GetSelectedSinglePlayerAreaId = (state) =>
  state.singlePlayerReducer.selectedAreaId;

export const GetSelectedSinglePlayerLevelDetails = (state) => {
  const areaId = GetSelectedSinglePlayerAreaId(state);
  const levelId = GetSelectedSinglePlayerLevelId(state);

  return GetSinglePlayerLevelDetails({ areaId, levelId });
};

export const GetSelectedSinglePlayerAreaDetails = (state) => {
  const areaId = GetSelectedSinglePlayerAreaId(state);

  return GetSinglePlayerAreaDetails({ areaId });
};
