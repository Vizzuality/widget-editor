import { createAction } from "vizzuality-redux-tools";

export const setConfiguration = createAction("CONFIGURATION/setConfiguration");
export const patchConfiguration = createAction(
  "CONFIGURATION/patchConfiguration"
);

export default {
  setConfiguration,
  patchConfiguration
};
