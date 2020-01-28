import { takeLatest, put, call, select } from "redux-saga/effects";

import { getAction } from "helpers/redux";

import { VegaService, stateProxy } from "@packages/core";
import { constants } from "@packages/core";

import { setEditor } from "modules/editor/actions";
import { setWidget } from "modules/widget/actions";

function* preloadData() {
  const {
    widgetEditor: { editor, configuration }
  } = yield select();

  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  const vega = new VegaService(widgetConfig, widgetData, configuration);
  yield put(setWidget(vega.getChart()));
  stateProxy.cache(configuration);
}

function* resolveWithProxy() {
  const {
    widgetEditor: { configuration }
  } = yield select();

  // Check and patch current state based on user configuration
  const proxyResult = yield call(stateProxy.sync, configuration);

  if (proxyResult.hasUpdates) {
    if (!!proxyResult.widgetData) {
      yield put(setEditor({ widgetData: proxyResult.widgetData }));
      yield call(updateWidget);
    }
  }
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
  yield takeLatest(
    getAction("CONFIGURATION/patchConfiguration"),
    resolveWithProxy
  );
  yield takeLatest(constants.sagaEvents.DATA_FLOW_PROXY_UPDATE, updateWidget);
}

// SELECT primary_fuel as x, SUM(estimated_generation_gwh) as y FROM powerwatch_data_20180102 GROUP BY x ORDER BY y desc LIMIT 2
// SELECT primary_fuel as x, SUM(estimated_generation_gwh) as y FROM powerwatch_data_20180102 GROUP BY x ORDER BY y desc LIMIT 2
