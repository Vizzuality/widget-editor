import { connectState } from "helpers/redux";
import { setTheme } from "modules/theme/actions";
import ColorShemes from "./component";

export default connectState(
  state => ({
    theme: state.theme
  }),
  { setTheme }
)(ColorShemes);
