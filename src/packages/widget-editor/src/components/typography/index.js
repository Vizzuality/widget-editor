import { connectState } from "helpers/redux";
import { setTheme } from "modules/theme/actions";
import Typography from "./component";

export default connectState(
  state => ({
    theme: state.theme
  }),
  { setTheme }
)(Typography);
