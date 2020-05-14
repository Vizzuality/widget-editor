import WidgetEditor from "components/widget-editor";

// Exposed callbacks
import {
  publicOnSave,
  AdapterModifier,
  GetAdapterAvailableProps,
} from "exposed-hooks";

export { default as reducers } from "@widget-editor/shared/lib/modules";

export { default as middleware } from "middleware";
export { default as sagas } from "sagas";

export { publicOnSave as getEditorState };

export { AdapterModifier };
export { GetAdapterAvailableProps };

export default WidgetEditor;
