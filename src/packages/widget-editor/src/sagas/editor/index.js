import { takeLatest, put, select } from "redux-saga/effects";
import { getAction } from "helpers/redux";
import { constants } from "@packages/core";

import { setConfiguration } from "modules/configuration/actions";

function* preloadData() {
  const {
    widgetEditor: {
      editor: {
        widget: {
          attributes: { name, description, widgetConfig }
        }
      }
    }
  } = yield select();

  const configuration = {
    ...widgetConfig.paramsConfig,
    title: name,
    caption: description
  };

  yield put(setConfiguration(configuration));
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );
}
