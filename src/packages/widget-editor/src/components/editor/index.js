import { connectState } from "helpers/redux";

import { setEditor } from "modules/editor/actions";
import { setTheme, setScheme } from "modules/theme/actions";

// Components
import EditorComponent from "./component";

export default connectState(
  state => ({
    editor: state.editor,
    configuration: state.configuration,
    widget: state.widget,
    editorState: state
  }),
  dispatch => {
    return {
      dispatch,
      setEditor: data => dispatch(setEditor(data)),
      setTheme: data => dispatch(setTheme(data)),
      setScheme: data => dispatch(setScheme(data))
    };
  }
)(EditorComponent);
