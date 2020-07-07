import { takeLatest, put, call, select, cancel, cancelled, takeEvery } from "redux-saga/effects";
import isEqual from 'lodash/isEqual';
import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import { getLocalCache, localOnChangeState } from "exposed-hooks";

import {
  constants,
  VegaService,
  StateProxy,
} from "@widget-editor/core";

import { setEditor } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidget } from "@widget-editor/shared/lib/modules/widget/actions";
import { setConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

const stateProxy = new StateProxy();

const columnsSet = (value, category) => {
  return (
    value &&
    category &&
    typeof value === "object" &&
    typeof category === "object" &&
    "name" in value &&
    "name" in category
  );
};

function* getWidgetDataWithAdapter(editorState) {
  const { adapter } = getLocalCache();

  const { configuration } = editorState;
  const { value, category } = configuration;

  if (columnsSet(value, category)) {
    const { widgetEditor } = yield select();
    const { configuration, filters, editor: { dataset } } = widgetEditor;
    return yield adapter.requestData({ configuration, filters, dataset });
  }

  return yield [];
}

// This generator updates local state used for our api hooks
// When editor changes or restores this gets called
// Action triggering this is: constants.sagaEvents.DATA_FLOW_UPDATE_HOOK_STATE
function* updateHookState() {
  const state = yield select();
  localOnChangeState(state.widgetEditor);
}

// Called when our services have initialized data required to render chart
// Sets up our visualization using @core/VegaService
function* initializeWidget({ payload }) {
  const {
    widgetEditor: { editor, configuration, theme, widget },
  } = yield select();

  // Action should only run on initialization "one run"
  // If this is not the case we simply cancel it
  if (
    !payload.hasOwnProperty('initialized') ||
    payload.initialized === false ||
    !editor.initialized) {
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
        editor,
        theme
      );

      const generatedWidget = vega.getChart();
      if (!isEqual(generatedWidget, widget)) {
        yield put(setWidget(generatedWidget));
      }

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

// Called multiple, checks if we need to update data
// Using @core/stateProxy
// If no updates required we yield cancel
function* checkWithProxyIfShouldUpdate(payload) {
  const { widgetEditor } = yield select();
  // We only want to resolve proxy if the editor itself is initialized
  if (!widgetEditor.editor.initialized) {
    yield cancel();
  }

  // State proxy checks editor state if any data updates are required.
  // state proxy returns array of actions that we call to update the editor
  const proxyResult = yield call([stateProxy, "sync"], widgetEditor, payload.type);
  if (proxyResult && proxyResult.length > 0) {
    for (const evnt in proxyResult) {
      yield put({ type: proxyResult[evnt] });
    }
    yield call(updateHookState);
  } else  {
    yield cancel();
  }
}

function* updateWidget() {
  const {
    widgetEditor: { editor, configuration, theme },
  } = yield select();
  if (editor.initialized && (!editor.widgetData || typeof editor.widgetData === 'undefined')) {
    const fullState = yield select();
    const widgetData = yield call(getWidgetDataWithAdapter, fullState.widgetEditor);

    // XXX: Important!! only set widget data if we have it
    // Some widgets especialy maps will return an empty array or simply nothing
    // This will cause the editor to try and re render until we have resolved the data
    // As our sagas will try to refetch data we will simply not call this and let the sagas cancel
    if (widgetData && Array.isArray(widgetData) && widgetData.length > 0) {
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
        editor,
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

  if (!widgetEditor.editor.initialized) {
    yield cancel();
  }

  if (widgetEditor.configuration.visualizationType !== "map") {
    let widgetData;

    if (!advanced) {
      widgetData = yield call(getWidgetDataWithAdapter, widgetEditor);
    }

    // XXX: Important!! only set widget data if we have it
    // Some widgets especialy maps will return an empty array or simply nothing
    // This will cause the editor to try and re render until we have resolved the data
    // As our sagas will try to refetch data we will simply not call this and let the sagas cancel themself
    if (widgetData && Array.isArray(widgetData) && widgetData.length > 0) {
      yield put(setEditor({ widgetData: widgetData.data }));
    }

    yield call(updateWidget);
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

  // --- Triggered multiple: When configuration updates, we update widget data
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_CONFIGURATION_UPDATE,
    updateWidgetData
  );

  // --- Triggered once: When we have all nessesary information to render visualization
  yield takeLatest(
    getAction("EDITOR/setEditor"),
    initializeWidget
  );

  // --- Triggered multiple: When Configuration or data updates we update the widget
  yield takeLatest(constants.sagaEvents.DATA_FLOW_UPDATE_WIDGET, updateWidget);

  // --- Triggered multiple: When configuration gets modified, we check with our state
  // --- proxy if we have updates, if thats the case we update the editors state based on response

  yield takeLatest(
    [
      getAction("CONFIGURATION/patchConfiguration"),
      getAction("EDITOR/THEME/setTheme"),
      getAction('WIDGET/setWidget'),
      getAction("EDITOR/setEditor")
    ],
    checkWithProxyIfShouldUpdate
  );

  // --- Update local hook state
  yield takeLatest(constants.sagaEvents.DATA_FLOW_UPDATE_HOOK_STATE, updateHookState)

  // --- Triggered multiple: If theme gets modified we update our widget
  yield takeLatest(getAction("EDITOR/THEME/setTheme"), updateWidget);
}
