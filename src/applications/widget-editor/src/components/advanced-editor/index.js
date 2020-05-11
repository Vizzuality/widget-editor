import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidget } from "@widget-editor/shared/lib/modules/widget/actions";
import AdvancedEditorComponent from "./component";

export default connectState(
  (state) => ({
    editor: state.editor,
  }),
  { setEditor, setWidget }
)(AdvancedEditorComponent);
