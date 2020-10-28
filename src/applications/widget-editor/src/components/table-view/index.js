import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import { selectWidgetData } from "@widget-editor/shared/lib/modules/editor/selectors";
import {
  selectValue,
  selectCategory,
  selectColor,
  selectAggregateFunction,
} from "@widget-editor/shared/lib/modules/configuration/selectors";

import TableView from "./component";

export default connectState((state) => ({
  widgetData: selectWidgetData(state),
  value: selectValue(state),
  category: selectCategory(state),
  color: selectColor(state),
  aggregateFunction: selectAggregateFunction(state),
}))(TableView);
