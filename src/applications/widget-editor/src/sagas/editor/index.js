import { takeLatest, put, select } from "redux-saga/effects";
import sagaEvents from "sagas/events";

import { Chart } from "@packages/core";

console.log(sagaEvents.DATA_FLOW_DATA_READY);

function* preloadData() {
  const {
    editor: { dataset, widget, fields, layers }
  } = yield select();
  const chart = new Chart();

  console.log(
    "Widget editor is ready to render",
    chart.getVisualisation(dataset, widget, fields, layers)
  );
}

export default function* data() {
  yield takeLatest(sagaEvents.DATA_FLOW_DATA_READY, preloadData);
}
