import { connect } from "react-redux";

import ToggleOptionsComponent from "./component";

import { modifyOptions } from "modules/editor-options/actions";

export default connect(
  state => ({
    optionsActive: state.editorOptions.optionsOpen
  }),
  { modifyOptions }
)(ToggleOptionsComponent);
