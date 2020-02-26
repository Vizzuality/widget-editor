import { connect } from "react-redux";

import EditorOptionsComponent from "./component";

import { setAuthToken, setDataset } from "modules/sample-module/actions";

export default connect(
  state => ({
    sampleModule: state.sampleModule
  }),
  { setAuthToken, setDataset }
)(EditorOptionsComponent);
