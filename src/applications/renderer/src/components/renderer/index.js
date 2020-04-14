import { redux } from "@packages/shared";

// Components
import RendererComponent from "./component";

export default redux.connectState((state) => ({
  editor: state.editor,
  widget: state.widget,
}))(RendererComponent);
