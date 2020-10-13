import { redux } from "@widget-editor/shared";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import { selectColumnOptions } from "@widget-editor/shared/lib/modules/editor/selectors";

import QueryValuesComponent from "./component";

export default redux.connectState(
  (state) => ({
    theme: state.theme,
    configuration: state.configuration,
    columns: selectColumnOptions(state),
  }),
  { patchConfiguration }
)(QueryValuesComponent);
