import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import {
  selectAdvanced,
  selectIsEditing,
  selectIsWidgetAdvanced,
} from "@widget-editor/shared/lib/modules/editor/selectors";
import { selectThemeColor } from "@widget-editor/shared/lib/modules/theme/selectors";
import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidget } from "@widget-editor/shared/lib/modules/widget/actions";
import AdvancedEditorComponent from "./component";

export default connectState(
  (state) => ({
    advanced: selectAdvanced(state),
    isEditing: selectIsEditing(state),
    isWidgetAdvanced: selectIsWidgetAdvanced(state),
    themeColor: selectThemeColor(state),
    editor: state.editor,
  }),
  { setEditor, setWidget }
)(AdvancedEditorComponent);
