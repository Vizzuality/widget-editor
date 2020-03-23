import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import * as selectors from "modules/widget/selectors";

import QueryValuesComponent from "./component";

export default connectState(
  state => ({
    theme: state.theme,
    // value: selectors.getWidgetSelectedColumn(state),
    configuration: state.configuration,
    widgetRelevantProps: state.editor.dataset.attributes.widgetRelevantProps,
    columns: selectors.getWidgetColumns(state)
  }),
  { patchConfiguration }
)(QueryValuesComponent);
