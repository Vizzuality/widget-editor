import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import WidgetInfoComponent from "./component";

export default connectState(
  (state) => ({
    theme: state.theme,
    configuration: state.configuration,
  }),
  { patchConfiguration }
)(WidgetInfoComponent);
