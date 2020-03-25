import { takeLatest, put, call, select } from "redux-saga/effects";

import { getAction } from "helpers/redux";

import {
  FiltersService,
  constants,
  VegaService,
  StateProxy
} from "@packages/core";

import { setEditor } from "modules/editor/actions";
import { setWidget } from "modules/widget/actions";

const stateProxy = new StateProxy();
let adapterConfiguration = null;

async function getWidgetData(editorState) {
  const {
    configuration,
    filters,
    editor: {
      dataset: { id }
    }
  } = editorState;
  const filtersService = new FiltersService(configuration, filters, id);
  const sqlQuery = filtersService.getQuery();

  const { dataEndpoint } = adapterConfiguration;

  const response = await fetch(`${dataEndpoint}/${id}?sql=${sqlQuery}`);
  const data = await response.json();

  return data;
}

function* storeAdapterConfigInState({ payload }) {
  adapterConfiguration = payload;
}

function* preloadData() {
  const {
    widgetEditor: { editor, configuration, theme }
  } = yield select();

  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  const vega = new VegaService(widgetConfig, widgetData, configuration, theme);
  yield put(setWidget(vega.getChart()));

  const { widgetEditor } = yield select();
  stateProxy.cacheChart(widgetEditor);
}

function* resolveWithProxy() {
  const { widgetEditor } = yield select();

  // Check and patch current state based on user configuration
  const proxyResult = yield call([stateProxy, "sync"], widgetEditor);

  // --- Proxy results returns a list of events we call on certain updates
  // --- This makes sure we only update what is nessesary in the editor
  if (proxyResult && proxyResult.length > 0) {
    for (event in proxyResult) {
      yield put({ type: proxyResult[event] });
    }
  }
}

function* updateWidget() {
  const {
    widgetEditor: { editor, configuration, theme }
  } = yield select();

  if (editor.initialized) {
    const { widgetData } = editor;
    const { widgetConfig } = editor.widget.attributes;
    const vega = new VegaService(
      widgetConfig,
      widgetData,
      configuration,
      theme
    );
    yield put(setWidget(vega.getChart()));
  }
}

function* updateWidgetData() {
  const { widgetEditor } = yield select();

  const widgetData = yield call(getWidgetData, widgetEditor);

  if (widgetData.data) {
    yield put(setEditor({ widgetData: widgetData.data }));
    yield call(updateWidget);
  }
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALISATION_READY,
    preloadData
  );

  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
    storeAdapterConfigInState
  );

  yield takeLatest(
    getAction("CONFIGURATION/patchConfiguration"),
    resolveWithProxy
  );

  yield takeLatest(constants.sagaEvents.DATA_FLOW_UPDATE_WIDGET, updateWidget);
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_CONFIGURATION_UPDATE,
    updateWidgetData
  );

  yield takeLatest(getAction("EDITOR/THEME/setTheme"), updateWidget);
}
