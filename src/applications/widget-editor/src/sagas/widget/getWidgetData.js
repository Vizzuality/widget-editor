import { select } from "redux-saga/effects";
import { getLocalCache } from "exposed-hooks";

/**
 * @generator getWidgetDataWithAdapter
 * utilising the specified adapter to request widget data
 * @triggers <void>
 */
function* getWidgetDataWithAdapter(editorState) {
  const { adapter } = getLocalCache();

  const columnsSet = (value, category) => {
    const hasCategory = category && typeof category === "object" && "name" in category;
    const hasValue = value && typeof value === "object" && "name" in value;
    return hasCategory && hasValue;
  };

  const { configuration } = editorState;
  const { value, category, color, chartType } = configuration;

  if (columnsSet(value, category, color, chartType)) {
    const { widgetEditor: store } = yield select();
    const data = yield adapter.requestData(store);
    return data;
  }
  yield [];
}

export default getWidgetDataWithAdapter;