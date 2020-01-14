import { takeLatest, put, select } from "redux-saga/effects";

import { setConfiguration } from "modules/configuration/actions";

function* preloadData() {
  const {
    editor: {
      widget: {
        attributes: { widgetConfig }
      }
    }
  } = yield select();

  yield put(setConfiguration(widgetConfig.paramsConfig));
}

export default function* baseSaga() {
  yield takeLatest("EDITOR/setEditor", preloadData);
}
