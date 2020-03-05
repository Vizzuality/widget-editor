import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import FilterComponent from "./component";

export default connectState(
  state => ({
    filters: state.configuration.filters,
    fields: state.editor.fields,
  }),
  { patchConfiguration }
)(FilterComponent);

export * from './component';