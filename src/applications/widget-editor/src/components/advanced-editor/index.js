import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import {
  selectAdvanced,
  selectIsEditing,
  selectIsWidgetAdvanced,
  selectCustomWidgetConfig,
} from "@widget-editor/shared/lib/modules/editor/selectors";
import { selectThemeColor } from "@widget-editor/shared/lib/modules/theme/selectors";
import { selectSerializedWidgetConfig } from "@widget-editor/shared/lib/modules/widget-config/selectors";
import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidgetConfig } from "@widget-editor/shared/lib/modules/widget-config/actions";
import AdvancedEditorComponent from "./component";

export default connectState(
  (state) => ({
    advanced: selectAdvanced(state),
    isEditing: selectIsEditing(state),
    isWidgetAdvanced: selectIsWidgetAdvanced(state),
    themeColor: selectThemeColor(state),
    serializedWidgetConfig: selectSerializedWidgetConfig(state),
    customWidgetConfig: selectCustomWidgetConfig(state),
    editor: state.editor,
  }),
  { setEditor, setWidgetConfig }
)(AdvancedEditorComponent);
