import { createAction } from "helpers/redux";

export const setEditor = createAction("EDITOR/setEditor");
export const resetEditor = createAction("EDITOR/resetEditor");
export const dataInitialized = createAction('EDITOR/dataInitialized');
export const syncingEditor = createAction('EDITOR/syncing');
export default {
  setEditor,
  resetEditor,
  dataInitialized,
  syncingEditor
};
