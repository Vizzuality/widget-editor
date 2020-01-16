import { createAction } from "helpers/redux";

export const setConfiguration = createAction("CONFIGURATION/setConfiguration");
export const patchConfiguration = createAction(
  "CONFIGURATION/patchConfiguration"
);

export default {
  setConfiguration,
  patchConfiguration
};
