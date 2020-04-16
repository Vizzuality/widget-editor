import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import {
  setTheme,
  setScheme,
} from "@widget-editor/shared/lib/modules/theme/actions";

// Components
import EditorComponent from "./component";

export default connectState(
  (state) => ({
    editor: state.editor,
    configuration: state.configuration,
    widget: state.widget,
    editorState: state,
  }),
  (dispatch) => {
    return {
      dispatch,
      setEditor: (data) => dispatch(setEditor(data)),
      setTheme: (data) => dispatch(setTheme(data)),
      setScheme: (data) => dispatch(setScheme(data)),
    };
  }
)(EditorComponent);
