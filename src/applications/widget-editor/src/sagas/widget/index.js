import { takeLatest, put, call, select, cancel } from "redux-saga/effects";

import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import { localOnChangeState } from "exposed-hooks";

import {
  FiltersService,
  constants,
  VegaService,
  StateProxy,
} from "@widget-editor/core";

import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidget } from "@widget-editor/shared/lib/modules/widget/actions";
import { setConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

const stateProxy = new StateProxy();
let adapterConfiguration = null;

const columnsSet = (value, category) => {
  return (
    typeof value === "object" &&
    typeof category === "object" &&
    "name" in value &&
    "name" in category
  );
};

async function getWidgetData(editorState) {
  const {
    configuration,
    filters,
    editor: { dataset },
  } = editorState;
  const { value, category } = configuration;

  if (columnsSet(value, category)) {
    const filtersService = new FiltersService(configuration, filters, dataset);
    const sqlQuery = filtersService.getQuery();

    const { dataEndpoint } = adapterConfiguration;

    const response = await fetch(
      `${dataEndpoint}/${dataset.id}?sql=${sqlQuery}`
    );
    const data = await response.json();

    return data;
  }

  return [];
}

function* storeAdapterConfigInState({ payload }) {
  adapterConfiguration = payload;
  yield cancel();
}

function* preloadData() {
  const {
    widgetEditor: { editor, configuration, theme },
  } = yield select();

  if (!editor.widget) {
    yield cancel();
  }

  const { widgetData } = editor;
  const { widgetConfig } = editor.widget.attributes;

  if (configuration.visualizationType !== "map") {
    if (!editor.advanced) {
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
    } else {
      // XXX: Some properties need to be present for vega
      const ensureVegaProperties = {
        autosize: {
          type: "fit",
        },
        ...editor.widget.attributes.widgetConfig,
      };
      yield put(setWidget(ensureVegaProperties));
    }

    const { widgetEditor } = yield select();

    stateProxy.cacheChart(widgetEditor);
  } else {
    yield cancel();
  }
}

function* resolveWithProxy() {
  const { widgetEditor } = yield select();
  // Check and patch current state based on user configuration
  const proxyResult = yield call([stateProxy, "sync"], widgetEditor);
  // --- Proxy results returns a list of events we call on certain updates
  // --- This makes sure we only update what is nessesary in the editor
  if (proxyResult && proxyResult.length > 0) {
    for (const evnt in proxyResult) {
      yield put({ type: proxyResult[evnt] });
    }
    const state = yield select();
    localOnChangeState(state.widgetEditor);
  }
}

function* updateWidget() {
  const {
    widgetEditor: { editor, configuration, theme },
  } = yield select();
  if (editor.initialized && !editor.widgetData) {
    const fullState = yield select();
    const widgetData = yield call(getWidgetData, fullState.widgetEditor);
    if (widgetData) {
      yield put(setEditor({ widgetData: widgetData.data }));
    }
  }

  if (
    editor.initialized &&
    editor.widgetData &&
    configuration.visualizationType !== "map"
  ) {
    const { widgetData, advanced } = editor;
    const { widgetConfig } = editor.widget.attributes;

    if (!advanced) {
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
    } else {
      // XXX: Some properties need to be present for vega
      const ensureVegaProperties = {
        autosize: {
          type: "fit",
        },
        ...editor.widget.attributes.widgetConfig,
      };
      yield put(setWidget(ensureVegaProperties));
    }
  } else {
    yield cancel();
  }
}

function* updateWidgetData() {
  const { widgetEditor } = yield select();
  const { advanced } = widgetEditor.editor;

  if (widgetEditor.configuration.visualizationType !== "map") {
    let widgetData;

    if (!advanced) {
      widgetData = yield call(getWidgetData, widgetEditor);
    }

    if (widgetData) {
      yield put(setEditor({ widgetData: widgetData.data }));
    }
    yield call(updateWidget);
    if (!widgetEditor.editor.initialized) {
      yield put({ type: constants.sagaEvents.DATA_FLOW_VISUALISATION_READY });
    }
  } else {
    yield call(updateWidget);
    if (!widgetEditor.editor.initialized) {
      yield put({ type: constants.sagaEvents.DATA_FLOW_VISUALISATION_READY });
    }
  }

  yield put(
    setConfiguration({
      visualizationType: widgetEditor.configuration.visualizationType,
      chartType:
        widgetEditor.configuration.visualizationType === "map"
          ? "map"
          : widgetEditor.configuration.chartType,
    })
  );
}

export default function* baseSaga() {
  // --- Triggered once: When we have all nessesary information to render visualization
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALISATION_READY,
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
