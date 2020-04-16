import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setTheme } from "@widget-editor/shared/lib/modules/theme/actions";
import ColorShemes from "./component";

export default connectState(
  (state) => ({
    theme: state.theme,
  }),
  { setTheme }
)(ColorShemes);
