import { connectState } from "@packages/shared/lib/helpers/redux";
import { patchConfiguration } from "@packages/shared/lib/modules/configuration/actions";
import WidgetInfoComponent from "./component";
export default connectState(state => ({
  theme: state.theme,
  configuration: state.configuration
}), {
  patchConfiguration
})(WidgetInfoComponent);