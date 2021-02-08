import { select } from "redux-saga/effects";
import { getLocalCache } from "exposed-hooks";
import { FiltersService } from "@widget-editor/core";
import { selectDataset } from '@widget-editor/shared/lib/modules/editor/selectors';

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
  const { value, category } = configuration;

  if (columnsSet(value, category)) {
    const { widgetEditor: store } = yield select();
    const filtersService = new FiltersService(store, adapter);

    const data = yield adapter.getDatasetData(
      selectDataset(store).id,
      filtersService.getQuery(),
      {
        extraParams: filtersService.getAdditionalParams(),
        saveDataUrl: true,
      });

    return data;
  }
  yield [];
}

export default getWidgetDataWithAdapter;