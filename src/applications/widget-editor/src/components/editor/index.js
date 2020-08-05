import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setEditor, resetEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { resetConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import { resetWidget } from "@widget-editor/shared/lib/modules/widget/actions";
import { resetFilters } from "@widget-editor/shared/lib/modules/filters/actions";

import {
  setTheme,
  setSchemes,
  resetTheme,
} from "@widget-editor/shared/lib/modules/theme/actions";

// Components
import EditorComponent from "./component";

export default connectState(
  (state) => ({
    editor: state.editor,
    theme: state.theme,
    configuration: state.configuration,
    widget: state.widget,
    editorState: state,
  }),
  (dispatch) => {
    return {
      dispatch,
      resetConfiguration: () => dispatch(resetConfiguration()),
      resetTheme: () => dispatch(resetTheme()),
      resetEditor: () => dispatch(resetEditor()),
      resetWidget: () => dispatch(resetWidget()),
      resetFilters: () => dispatch(resetFilters()),
      setEditor: (data) => dispatch(setEditor(data)),
      setTheme: (data) => dispatch(setTheme(data)),
      setSchemes: (data) => dispatch(setSchemes(data)),
    };
  }
)(EditorComponent);
