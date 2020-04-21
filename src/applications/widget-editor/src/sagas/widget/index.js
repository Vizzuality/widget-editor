import { takeLatest, put, call, select } from "redux-saga/effects";

import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import {
  FiltersService,
  constants,
  VegaService,
  StateProxy,
} from "@widget-editor/core";

import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidget } from "@widget-editor/shared/lib/modules/widget/actions";

const stateProxy = new StateProxy();
let adapterConfiguration = null;

async function getWidgetData(editorState) {
  const {
    configuration,
    filters,
    editor: { dataset },
  } = editorState;
  const filtersService = new FiltersService(configuration, filters, dataset);
  const sqlQuery = filtersService.getQuery();

  const { dataEndpoint } = adapterConfiguration;

  const response = await fetch(`${dataEndpoint}/${dataset.id}?sql=${sqlQuery}`);
  const data = await response.json();

  return data;
}

function* storeAdapterConfigInState({ payload }) {
  adapterConfiguration = payload;
}

function* preloadData() {
  const {
    widgetEditor: { editor, configuration, theme },
  } = yield select();

  if (editor.widget) {
    const { widgetData } = editor;
    const { widgetConfig } = editor.widget.attributes;

    const vega = new VegaService(
      {
        ...widgetConfig,
        paramsConfig: { ...widgetConfig.paramsConfig, ...configuration },
      },
      widgetData,
      configuration,
      theme
    );
    yield put(setWidget(vega.getChart()));

    const { widgetEditor } = yield select();
    stateProxy.cacheChart(widgetEditor);
  }
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
    widgetEditor: { editor, configuration, theme },
  } = yield select();

  if (editor.initialized && editor.widgetData) {
    const { widgetData } = editor;
    const { widgetConfig } = editor.widget.attributes;

    const vega = new VegaService(
      {
        ...widgetConfig,
        paramsConfig: { ...widgetConfig.paramsConfig, ...configuration },
      },
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
    if (!widgetEditor.editor.initialized) {
      yield put({ type: constants.sagaEvents.DATA_FLOW_VISUALISATION_READY });
    }
  }
}

export default function* baseSaga() {
  // --- Triggered once: When we have all nessesary information to render visualization
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_FIELDS_AND_LAYERS_READY,
    updateWidgetData
  );

  // --- Triggered once: When we have all nessesary information to render visualization
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALISATION_READY,
    preloadData
  );

  // --- Triggered once: When App initializes, we store adapter configuration localy
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
    storeAdapterConfigInState
  );

  // --- Triggered multiple: When Configuration or data updates we update the widget
  yield takeLatest(constants.sagaEvents.DATA_FLOW_UPDATE_WIDGET, updateWidget);

  // --- Triggered multiple: When configuration updates, we update widget data
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_CONFIGURATION_UPDATE,
    updateWidgetData
  );

  // --- Triggered multiple: When configuration gets modified, we check with our state
  // --- proxy if we have updates, if thats the case we update the editors state based on response
  yield takeLatest(
    getAction("CONFIGURATION/patchConfiguration"),
    resolveWithProxy
  );

  // --- Triggered multiple: If theme gets modified we update our widget
  yield takeLatest(getAction("EDITOR/THEME/setTheme"), updateWidget);
}
