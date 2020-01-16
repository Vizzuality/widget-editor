import { connectState } from "helpers/redux";

// Components
import ChartComponent from "./component";

export default connectState(state => ({
  editor: state.editor,
  widget: state.widget
}))(ChartComponent);
