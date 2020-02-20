import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import OrderValuesComponent from "./component";

export default connectState(
  state => ({
    orderBy: state.configuration.orderBy
  }),
  { patchConfiguration }
)(OrderValuesComponent);
