import { connectState } from "helpers/redux";

import { setFilters } from "modules/filters/actions";

import OrderValuesComponent from "./component";

import * as selectors from "modules/widget/selectors";

export default connectState(
  state => ({
    orderBy: state.filters.orderBy,
    columns: selectors.getWidgetColumns(state)
  }),
  { setFilters }
)(OrderValuesComponent);
