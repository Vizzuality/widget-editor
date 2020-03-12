// TODO: This should be its own package
// It should be possible to use the renderer without the editor!
import { connectState } from "helpers/redux";

// Components
import RendererComponent from "./component";

export default connectState(state => ({
  editor: state.editor,
  widget: state.widget,
}))(RendererComponent);
