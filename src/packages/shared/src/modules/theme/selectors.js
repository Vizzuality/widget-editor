import { createSelector } from "reselect";

import { selectWidgetScheme } from "../editor/selectors";

export const selectSchemes = state => state.theme.schemes;
const selectSelectedScheme = state => state.theme.selectedScheme;
export const selectThemeColor = state => state.theme.color;

export const selectScheme = createSelector(
  [selectWidgetScheme, selectSelectedScheme, selectSchemes],
  (widgetScheme, selectedScheme, schemes) => {
    // If the user manually picked a scheme, this is the one we want to be shown
    if (selectedScheme) {
      return schemes.find(scheme => scheme.name === selectedScheme);
    }

    // Otherwise, if the widget has an embedded scheme, that's the one we're displaying
    if (widgetScheme) {
      return widgetScheme;
    }

    // As a fallback, we otherwise display the first scheme available
    return schemes[0];
  }
);
