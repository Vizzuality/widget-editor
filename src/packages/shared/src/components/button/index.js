import { connectState } from "@packages/shared/lib/helpers/redux";

// Components
import ButtonComponent from "./component";

export default connectState((state) => ({
  theme: state.theme,
}))(ButtonComponent);
