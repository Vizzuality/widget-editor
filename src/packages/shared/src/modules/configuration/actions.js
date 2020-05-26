import { createAction } from "helpers/redux";

export const resetConfiguration = createAction("CONFIGURATION/resetConfiguration");
export const setConfiguration = createAction("CONFIGURATION/setConfiguration");
export const patchConfiguration = createAction(
  "CONFIGURATION/patchConfiguration"
);
export const saveConfiguration = createAction(
  "CONFIGURATION/saveConfiguration"
);

export default {
  resetConfiguration,
  saveConfiguration,
  setConfiguration,
  patchConfiguration
};
