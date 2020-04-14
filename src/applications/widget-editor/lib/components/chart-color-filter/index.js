import { connectState } from "../../helpers/redux";
import { setFilters } from "../../modules/filters/actions";
import { patchConfiguration } from "../../modules/configuration/actions"; // Components

import ChartColorFilter from "./component";
import * as widgetSelectors from "../../modules/widget/selectors";
import * as themeSelectors from "../../modules/theme/selectors";
export default connectState(state => ({
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