import { connectState } from "@packages/shared/lib/helpers/redux";
import { setTheme } from "@packages/shared/lib/modules/theme/actions";
import Typography from "./component";
export default connectState(state => ({
  theme: state.theme
}), {
  setTheme
})(Typography);