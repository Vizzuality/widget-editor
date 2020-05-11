import corePackage from "@widget-editor/core/package.json";
import widgetEditorPackage from "@widget-editor/widget-editor/package.json";
import rendererPackage from "@widget-editor/renderer/package.json";

const ws_meta = {
  core: corePackage.version,
  editor: widgetEditorPackage.version,
  renderer: rendererPackage.version,
};

const getEditorMeta = (adapter = "", advanced = false) => {
  return {
    ...ws_meta,
    adapter,
    advanced,
  };
};

export default getEditorMeta;
