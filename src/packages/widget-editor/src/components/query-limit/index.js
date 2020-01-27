import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import QueryLimitComponent from "./component";

export default connectState(
  state => ({
    theme: state.theme,
    limit: state.configuration.limit
  }),
  { patchConfiguration }
)(QueryLimitComponent);
