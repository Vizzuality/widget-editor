import { redux } from "@widget-editor/shared";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import { setTheme } from "@widget-editor/shared/lib/modules/theme/actions";
import {
  selectChartOptions,
  selectChartType,
} from "@widget-editor/shared/lib/modules/configuration/selectors";

// Components
import SelectChartComponent from "./component";

export default redux.connectState(
  (state) => ({
    options: selectChartOptions(state),
    chartType: selectChartType(state),
    theme: state.theme,
  }),
  { patchConfiguration, setTheme }
)(SelectChartComponent);
