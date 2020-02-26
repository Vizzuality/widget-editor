import { createAction } from "vizzuality-redux-tools";

export const setAuthToken = createAction("SAMPLE-MODULE/setAuthToken");
export const setDataset = createAction("SAMPLE-MODULE/setDataset");

export default {
  setAuthToken,
  setDataset
};
