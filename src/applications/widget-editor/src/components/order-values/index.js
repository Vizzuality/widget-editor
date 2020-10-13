import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setFilters } from "@widget-editor/shared/lib/modules/filters/actions";
import { selectColumnOptions } from "@widget-editor/shared/lib/modules/editor/selectors";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import OrderValuesComponent from "./component";


export default connectState(
  (state) => ({
    orderBy: state.filters.orderBy,
    columns: selectColumnOptions(state),
    aggregateFunction: state.configuration.aggregateFunction,
    valueColumn: state.configuration.value,
  }),
  {
    setFilters,
    patchConfiguration,
  },
)(OrderValuesComponent);
