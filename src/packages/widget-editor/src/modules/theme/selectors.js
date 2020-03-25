import { createSelector } from "reselect";

const getSchemes = state => state.theme.schemes;
const selectedScheme = state => state.theme.selectedScheme;

export const getMainThemeColor = createSelector(
  [getSchemes, selectedScheme],
  (schemes, selectedScheme) => {
    const activeScheme = schemes.find(s => s.name === selectedScheme);
    return activeScheme.mainColor;
  }
);

export const getActiveScheme = createSelector(
  [getSchemes, selectedScheme],
  (schemes, selectedScheme) => {
    const activeScheme = schemes.find(s => s.name === selectedScheme);
    return activeScheme;
  }
);
