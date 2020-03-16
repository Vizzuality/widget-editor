import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";
import { setTheme } from "modules/theme/actions";

// Components
import SelectChartComponent from "./component";

export default connectState(
  state => ({
    options: state.configuration.availableCharts,
    chartType: state.configuration.chartType,
    direction: state.configuration.direction,
    theme: state.theme,
  }),
  { patchConfiguration, setTheme }
)(SelectChartComponent);
