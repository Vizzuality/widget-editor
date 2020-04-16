import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setFilters } from "@widget-editor/shared/lib/modules/filters/actions";

import FilterComponent from "./component";

export default connectState(
  (state) => ({
    configuration: state.configuration,
    dataset: state.editor.dataset,
    filters: state.filters.list,
    fields: state.editor.fields,
  }),
  { setFilters }
)(FilterComponent);

export * from "./component";
