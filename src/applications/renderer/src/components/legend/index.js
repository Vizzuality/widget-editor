import { redux } from "@widget-editor/shared";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

// Components
import ChartColorFilter from "./component";

import * as widgetSelectors from "@widget-editor/shared/lib/modules/widget/selectors";
import * as themeSelectors from "@widget-editor/shared/lib/modules/theme/selectors";

export default redux.connectState(
  (state) => ({
    advanced: state.editor.advanced,
    widget: state.widget,
    configuration: state.configuration,
    selectedColor: widgetSelectors.getSelectedColor(state),
    columns: widgetSelectors.getWidgetColumns(state, { colorDimention: true }),
    schemeColor: themeSelectors.getMainThemeColor(state),
  }),
  { patchConfiguration }
)(ChartColorFilter);
