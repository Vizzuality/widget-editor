import { connectState } from "helpers/redux";

import { setFilters } from "modules/filters/actions";

import OrderValuesComponent from "./component";

import * as selectors from "modules/widget/selectors";

export default connectState(
  (state) => ({
    groupBy: state.filters.groupBy,
    columns: selectors.getWidgetColumns(state),
  }),
  { setFilters }
)(OrderValuesComponent);
