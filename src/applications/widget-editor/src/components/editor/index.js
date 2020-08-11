import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setEditor, resetEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { resetConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import { resetWidgetConfig } from "@widget-editor/shared/lib/modules/widget-config/actions";
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
    widget: state.widgetConfig,
    editorState: state,
  }),
  (dispatch) => {
    return {
      dispatch,
      resetConfiguration: () => dispatch(resetConfiguration()),
      resetTheme: () => dispatch(resetTheme()),
      resetEditor: () => dispatch(resetEditor()),
      resetWidgetConfig: () => dispatch(resetWidgetConfig()),
      resetFilters: () => dispatch(resetFilters()),
      setEditor: (data) => dispatch(setEditor(data)),
      setTheme: (data) => dispatch(setTheme(data)),
      setSchemes: (data) => dispatch(setSchemes(data)),
    };
  }
)(EditorComponent);
