import { connectState } from "@packages/shared/lib/helpers/redux";

import { setFilters } from "@packages/shared/lib/modules/filters/actions";

import OrderValuesComponent from "./component";

import * as selectors from "@packages/shared/lib/modules/widget/selectors";

export default connectState(
  (state) => ({
    groupBy: state.filters.groupBy,
    columns: selectors.getWidgetColumns(state),
  }),
  { setFilters }
)(OrderValuesComponent);
