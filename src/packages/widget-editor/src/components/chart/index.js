import { connect } from "react-redux";

// Components
import ChartComponent from "./component";

export default connect(state => ({
  editor: state.editor
}))(ChartComponent);
