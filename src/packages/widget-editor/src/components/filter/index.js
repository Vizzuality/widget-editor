import { connectState } from "helpers/redux";

import { setFilters } from "modules/filters/actions";

import FilterComponent from "./component";

export default connectState(
  state => ({
    configuration: state.configuration,
    datasetId: state.editor.dataset.id,
    filters: state.filters.list,
    fields: state.editor.fields
  }),
  { setFilters }
)(FilterComponent);

export * from "./component";
