import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import * as selectors from "modules/widget/selectors";

import QueryValuesComponent from "./component";

export default connectState(
  state => ({
    theme: state.theme,
    configuration: state.configuration,
    columns: selectors.getWidgetColumns(state)
  }),
  { patchConfiguration }
)(QueryValuesComponent);
