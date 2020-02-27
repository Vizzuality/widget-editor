import { connect } from "react-redux";

import EditorOptionsComponent from "./component";

import { modifyOptions } from "modules/editor-options/actions";

export default connect(
  state => ({
    editorOptions: state.editorOptions
  }),
  { modifyOptions }
)(EditorOptionsComponent);
