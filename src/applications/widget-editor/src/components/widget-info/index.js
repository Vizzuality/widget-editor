import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import { selectAdvanced } from "@widget-editor/shared/lib/modules/editor/selectors";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import WidgetInfoComponent from "./component";

export default connectState(
  (state) => ({
    advanced: selectAdvanced(state),
    theme: state.theme,
    configuration: state.configuration,
  }),
  { patchConfiguration }
)(WidgetInfoComponent);
