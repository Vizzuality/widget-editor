import { connectState } from "@widget-editor/shared/lib/helpers/redux";

// Components
import FooterComponent from "./component";

export default connectState((state) => ({
  enableSave: state.editor.enableSave,
  enableInfo: state.editor.enableInfo,
}))(FooterComponent);
