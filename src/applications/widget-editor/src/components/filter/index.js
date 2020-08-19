import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setFilters } from "@widget-editor/shared/lib/modules/filters/actions";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import FilterComponent from "./component";

export default connectState(
  (state) => ({
    dataset: state.editor.dataset,
    filters: state.filters.list,
    fields: state.editor.fields,
  }),
  { setFilters, patchConfiguration }
)(FilterComponent);

export * from "./component";
