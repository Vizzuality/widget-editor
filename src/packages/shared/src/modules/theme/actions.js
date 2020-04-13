import { createAction } from "helpers/redux";

export const setTheme = createAction("EDITOR/THEME/setTheme");
export const setScheme = createAction("EDITOR/THEME/setScheme");

export default {
  setTheme,
  setScheme
};
