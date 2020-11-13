import { createSelector } from "reselect";

import { getLocalCache } from "@widget-editor/widget-editor/lib/exposed-hooks";
import { selectIsWidgetAdvanced } from "@widget-editor/shared/lib/modules/editor/selectors";
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";

export const selectWidgetConfig = state => state.widgetConfig;

export const selectSerializedWidgetConfig = createSelector(
  [selectWidgetConfig, selectIsWidgetAdvanced, selectScheme],
  (widgetConfig, isAdvancedWidget, scheme) => {
    const { adapter } = getLocalCache();
    const config = { ...(widgetConfig ?? {}) };

    if (isAdvancedWidget) {
      return config;
    }

    // When the user is creating or editing a widget, the data is embedded within the widgetConfig
    // This function replaces it by the URL of the data
    if (config.data && Array.isArray(config.data)) {
      config.data = config.data.map(data => {
        if (data.name === 'table') {
          return {
            name: 'table',
            transform: data.transform ?? null,
            format: {
              // The format property may contain instructions such as parse that tells Vega to parse
              // a column as a date
              ...(data.format ?? {}),
              type: 'json',
              property: 'data',
            },
            url: adapter.getDataUrl(),
          };
        }
        return data;
      });
    }

    // We serialise the selected scheme
    config.config = adapter.getSerializedScheme(scheme);

    return config;
  }
);
