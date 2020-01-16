import { takeLatest, put, select } from "redux-saga/effects";
import { getAction } from "helpers/redux";

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
  yield takeLatest(getAction("EDITOR/setEditor"), preloadData);
}
