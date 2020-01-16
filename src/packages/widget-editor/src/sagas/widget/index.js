import { takeLatest, put, select } from "redux-saga/effects";
import sagaEvents from "sagas/events";

import { getAction } from "helpers/redux";

import { WidgetHelper } from "@packages/core";

import { setWidget } from "modules/widget/actions";

function* preloadData() {
  const {
    widgetEditor: { editor, configuration }
  } = yield select();

  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  const widgetHelper = new WidgetHelper(
    widgetConfig,
    widgetData,
    configuration
  );
  const vegaConfig = widgetHelper.getVegaConfig();

  yield put(setWidget(vegaConfig));
}

function* updateWidget() {
  const {
    widgetEditor: { editor, configuration }
  } = yield select();
  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  const widgetHelper = new WidgetHelper(
    widgetConfig,
    widgetData,
    configuration
  );

  const vegaConfig = widgetHelper.getVegaConfig();

  yield put(setWidget(vegaConfig));
}

export default function* baseSaga() {
  yield takeLatest(sagaEvents.DATA_FLOW_VISUALISATION_READY, preloadData);
  yield takeLatest(getAction("CONFIGURATION/patchConfiguration"), updateWidget);
}
