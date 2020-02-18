import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import WidgetInfoComponent from "./component";

export default connectState(
  state => ({
    theme: state.theme,
    configuration: state.configuration
  }),
  { patchConfiguration }
)(WidgetInfoComponent);
