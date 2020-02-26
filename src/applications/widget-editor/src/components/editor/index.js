import { connect } from "react-redux";

import EditorComponent from "./component";

export default connect(
  state => ({
    sampleModule: state.sampleModule
  }),
  {}
)(EditorComponent);
