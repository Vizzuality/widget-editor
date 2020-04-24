import { redux } from "@widget-editor/shared";

// Components
import RendererComponent from "./component";

export default redux.connectState((state) => ({
  editor: state.editor,
  widget: state.widget,
  configuration: state.configuration,
  compact: state.theme.compact.isCompact || state.theme.compact.forceCompact,
}))(RendererComponent);
