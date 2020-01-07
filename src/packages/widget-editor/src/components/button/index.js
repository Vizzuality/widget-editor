import { connect } from "react-redux";

// Components
import ButtonComponent from "./component";

export default connect(state => ({
  theme: state.theme
}))(ButtonComponent);
