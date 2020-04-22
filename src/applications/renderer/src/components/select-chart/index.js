import { redux } from "@widget-editor/shared";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import { setTheme } from "@widget-editor/shared/lib/modules/theme/actions";

// Components
import SelectChartComponent from "./component";

export default redux.connectState(
  (state) => ({
    options: state.configuration.availableCharts,
    chartType: state.configuration.chartType,
    theme: state.theme,
  }),
  { patchConfiguration, setTheme }
)(SelectChartComponent);
