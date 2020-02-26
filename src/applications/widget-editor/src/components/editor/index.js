import { connect } from "react-redux";

import EditorComponent from "./component";

export default connect(
  state => ({
    editorOptions: state.editorOptions
  }),
  {}
)(EditorComponent);
