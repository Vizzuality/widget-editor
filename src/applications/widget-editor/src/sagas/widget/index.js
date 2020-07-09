import { fork, take, takeLatest, put, call, select, cancel, cancelled, takeEvery } from "redux-saga/effects";
import { getAction } from "@widget-editor/shared/lib/helpers/redux";

import { getLocalCache, localOnChangeState } from "exposed-hooks";

import {
  constants,
  VegaService,
  StateProxy,
} from "@widget-editor/core";

import { setEditor, dataInitialized } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidget } from "@widget-editor/shared/lib/modules/widget/actions";
import { setConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

const stateProxy = new StateProxy();

function* getWidgetDataWithAdapter(editorState) {
  const { adapter } = getLocalCache();

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

  const { configuration } = editorState;
  const { value, category } = configuration;

  if (columnsSet(value, category)) {
    const { widgetEditor } = yield select();
    const { configuration, filters, editor: { dataset } } = widgetEditor;
    const data = yield adapter.requestData({ configuration, filters, dataset });
    return data;
  }
  yield [];
}

// This generator updates local state used for our api hooks
// When editor changes or restores this gets called
// Action triggering this is: constants.sagaEvents.DATA_FLOW_UPDATE_HOOK_STATE
function* updateHookState() {
  const state = yield select();
  localOnChangeState(state.widgetEditor);
}

function* initializeData(props) {
  const { widgetEditor } = yield select();

  const widgetData = yield call(getWidgetDataWithAdapter, widgetEditor)

  if (widgetData) {
    yield put(setEditor({ widgetData: widgetData.data }));
  }

  yield put(dataInitialized());
}

function* initializeVega(props) {
  const { widgetEditor: { editor, configuration, theme } } = yield select();
  const { widgetData, advanced } = editor;
  const { widgetConfig } = editor.widget.attributes;

  /**
   * Traditional widgets
   * Using: @core VegaService
   * DataService has figured out how a widget will be configured
   * VegaService utalizes store properties and generates a vega config for us
   */
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
  }

  /**
   * Advanced widgets
   * For these widgets we will grab all properties in widget config and assume;
   * a valid vega configuration.
   * When in advanced mode we save the advanced input into the widgets config.
   */
  if (advanced) {
    const ensureVegaProperties = {
      autosize: {
        type: "fit",
      },
      ...editor.widget.attributes.widgetConfig,
    };
    yield put(setWidget(ensureVegaProperties));
  }

  const { widgetEditor: newEditorState } = yield select();
  stateProxy.update(newEditorState);
}

function* syncEditor() {
  const { widgetEditor } = yield select();
  if (stateProxy.ShouldUpdateData(widgetEditor)) {
    yield fork(initializeData);
  }

  if (stateProxy.ShouldUpdateVega(widgetEditor)) {
    yield fork(initializeVega);
  }

  const { widgetEditor: updatedState } = yield select();
  stateProxy.update(updatedState);
  yield fork(updateHookState);
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALISATION_READY,
    initializeData
  );

  yield takeLatest(getAction('EDITOR/dataInitialized'), initializeVega);

  while(true) {
    yield take(constants.reduxActions.EDITOR_PATCH_CONFIGURATION)
    yield fork(syncEditor)
  }
}
