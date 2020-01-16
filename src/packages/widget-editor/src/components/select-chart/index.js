import { connect } from "react-redux";

import { patchConfiguration } from "modules/configuration/actions";

// Components
import SelectChartComponent from "./component";

export default connect(
  state => ({
    options: state.configuration.availableCharts,
    value: state.configuration.chartType
  }),
  { patchConfiguration }
)(SelectChartComponent);
