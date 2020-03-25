import { connectState } from "helpers/redux";

// Components
import ChartColorFilter from "./component";

export default connectState(state => ({
  editor: state.editor,
  widget: state.widget
}))(ChartColorFilter);
