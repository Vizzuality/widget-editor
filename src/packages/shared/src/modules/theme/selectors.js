import { createSelector } from "reselect";

export const getSchemes = state => state.theme.schemes;
const selectedScheme = state => state.theme.selectedScheme;

export const getSelectedScheme = createSelector(
  [getSchemes, selectedScheme],
  (schemes, selectedScheme) => {
    const activeScheme = schemes.find(s => s.name === selectedScheme);
    return activeScheme;
  }
);


export const getSchemeMainColor = createSelector(
  [getSelectedScheme],
  selectedScheme => selectedScheme.mainColor,
);
