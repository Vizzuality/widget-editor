import { select } from "redux-saga/effects";
import { getLocalCache } from "exposed-hooks";

/**
 * @generator getWidgetDataWithAdapter
 * utilizing the specified adapter to request widget data
 * @triggers <void>
 */
function* getWidgetDataWithAdapter(editorState) {
  const { adapter } = getLocalCache();

  const columnsSet = (value, category) => {
    return (
      value &&
      category &&
      typeof value === "object" &&
      typeof category === "object" &&
      "name" in value &&
      "name" in category
    );
  };

  const { configuration } = editorState;
  const { value, category } = configuration;

  if (columnsSet(value, category)) {
    const { widgetEditor } = yield select();
    const { configuration, filters, editor: { dataset } } = widgetEditor;
    const data = yield adapter.requestData({ configuration, filters: filters.list, dataset });
    return data;
  }
  yield [];
}

export default getWidgetDataWithAdapter;