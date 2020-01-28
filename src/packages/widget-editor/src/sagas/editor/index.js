import { takeLatest, put, select } from "redux-saga/effects";
import { getAction } from "helpers/redux";
import { constants } from "@packages/core";

import { setConfiguration } from "modules/configuration/actions";

function* preloadData() {
  const {
    widgetEditor: {
      editor: {
        widget: {
          attributes: { widgetConfig }
        }
      }
    }
  } = yield select();

  yield put(setConfiguration(widgetConfig.paramsConfig));
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );
}
