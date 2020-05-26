import { createAction } from "helpers/redux";

export const setTheme = createAction("EDITOR/THEME/setTheme");
export const setScheme = createAction("EDITOR/THEME/setScheme");
export const resetTheme = createAction("EDITOR/THEME/resetTheme");

export default {
  setTheme,
  setScheme,
  resetTheme
};
