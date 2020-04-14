import { redux } from "@packages/shared";

import { patchConfiguration } from "@packages/shared/lib/modules/configuration/actions";
import { setTheme } from "@packages/shared/lib/modules/theme/actions";

// Components
import SelectChartComponent from "./component";

export default redux.connectState(
  (state) => ({
    options: state.configuration.availableCharts,
    chartType: state.configuration.chartType,
    direction: state.configuration.direction,
    theme: state.theme,
  }),
  { patchConfiguration, setTheme }
)(SelectChartComponent);
