import { takeLatest, put, call, select } from "redux-saga/effects";

import { getAction } from "helpers/redux";

import { VegaService } from "@packages/core";
import { constants } from "@packages/core";

import { setWidget } from "modules/widget/actions";

function* preloadData() {
  const {
    widgetEditor: { editor, configuration }
  } = yield select();

  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  const vega = new VegaService(widgetConfig, widgetData, configuration);
  yield put(setWidget(vega.getChart()));
}

function* updateWidget() {
  const {
    widgetEditor: { editor, configuration }
  } = yield select();
  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  const vega = new VegaService(widgetConfig, widgetData, configuration);
  yield put(setWidget(vega.getChart()));
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALISATION_READY,
    preloadData
  );
  yield takeLatest(getAction("CONFIGURATION/patchConfiguration"), updateWidget);
}
