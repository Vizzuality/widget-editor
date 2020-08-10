import { createAction } from "helpers/redux";

export const setEditor = createAction("EDITOR/setEditor");
export const resetEditor = createAction("EDITOR/resetEditor");

export default {
  setEditor,
  resetEditor
};
