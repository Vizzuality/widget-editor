import { redux } from "@widget-editor/shared";

// Components
import ChartComponent from "./component";

export default redux.connectState((state) => ({
  editor: state.editor,
  widget: state.widgetConfig,
}))(ChartComponent);
