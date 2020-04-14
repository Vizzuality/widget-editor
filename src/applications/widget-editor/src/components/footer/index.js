import { connectState } from "@packages/shared/lib/helpers/redux";

// Components
import FooterComponent from "./component";

export default connectState((state) => ({
  authenticated: state.editor.authenticated,
}))(FooterComponent);
