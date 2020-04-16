import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setFilters } from "@widget-editor/shared/lib/modules/filters/actions";

import OrderValuesComponent from "./component";

import * as selectors from "@widget-editor/shared/lib/modules/widget/selectors";

export default connectState(
  (state) => ({
    groupBy: state.filters.groupBy,
    columns: selectors.getWidgetColumns(state),
  }),
  { setFilters }
)(OrderValuesComponent);
