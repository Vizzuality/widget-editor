import { redux } from "@widget-editor/shared";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import * as selectors from "@widget-editor/shared/lib/modules/widget-config/selectors";

import QueryValuesComponent from "./component";

export default redux.connectState(
  (state) => ({
    theme: state.theme,
    configuration: state.configuration,
    columns: selectors.getWidgetColumns(state),
  }),
  { patchConfiguration }
)(QueryValuesComponent);
