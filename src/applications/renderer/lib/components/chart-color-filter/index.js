import { redux } from "@packages/shared";
import { setFilters } from "@packages/shared/lib/modules/filters/actions";
import { patchConfiguration } from "@packages/shared/lib/modules/configuration/actions"; // Components

import ChartColorFilter from "./component";
import * as widgetSelectors from "@packages/shared/lib/modules/widget/selectors";
import * as themeSelectors from "@packages/shared/lib/modules/theme/selectors";
export default redux.connectState(state => ({
  widget: state.widget,
  color: state.filters.color,
  configuration: state.configuration,
  selectedColor: widgetSelectors.getSelectedColor(state),
  columns: widgetSelectors.getWidgetColumns(state, {
    colorDimention: true
  }),
  schemeColor: themeSelectors.getMainThemeColor(state),
  activeScheme: themeSelectors.getActiveScheme(state),
  widgetData: state.widget && state.widget.data ? state.widget.data[0].values : null
}), {
  setFilters,
  patchConfiguration
})(ChartColorFilter);