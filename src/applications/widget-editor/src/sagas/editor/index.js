import { takeLatest, put, select } from "redux-saga/effects";
import { constants } from "@widget-editor/core";
import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import { setConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

function* preloadData() {
  const {
    widgetEditor: { editor },
  } = yield select();

  if (editor.widget) {
    const {
      widget: {
        attributes: { name, description, widgetConfig },
      },
    } = editor;

    const configuration = {
      ...widgetConfig.paramsConfig,
      title: name,
      caption: description,
    };

    const format = widgetConfig?.paramsConfig?.value?.format || "s";

    yield put(setConfiguration({ ...configuration, format }));
  }
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );
}
