import { redux } from "@packages/shared";

import { patchConfiguration } from "@packages/shared/lib/modules/configuration/actions";

import * as selectors from "@packages/shared/lib/modules/widget/selectors";

import QueryValuesComponent from "./component";

export default redux.connectState(
  (state) => ({
    theme: state.theme,
    configuration: state.configuration,
    columns: selectors.getWidgetColumns(state),
  }),
  { patchConfiguration }
)(QueryValuesComponent);
