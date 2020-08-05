import { createAction } from "helpers/redux";

export const setTheme = createAction("EDITOR/THEME/setTheme");
export const resetTheme = createAction("EDITOR/THEME/resetTheme");
export const setSchemes = createAction("EDITOR/THEME/setSchemes");
export const setSelectedScheme = createAction("EDITOR/THEME/setSelectedScheme");

export default {
  setTheme,
  resetTheme,
  setSchemes,
  setSelectedScheme,
};
