import { createAction } from "helpers/redux";

export const setFilters = createAction("EDITOR/setFilters");
export const resetFilters = createAction("EDITOR/resetFilters");

export default {
  setFilters,
  resetFilters
};
