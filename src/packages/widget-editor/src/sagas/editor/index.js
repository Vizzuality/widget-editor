import { takeLatest, put, select } from "redux-saga/effects";
import sagaEvents from "sagas/events";

import { Chart } from "@packages/core";

function* preloadData() {
  const { editor } = yield select();
  console.log("widget data is ready so do something with:", editor);
}

export default function* baseSaga() {
  yield takeLatest(sagaEvents.DATA_FLOW_WIDGET_DATA_READY, preloadData);
}
