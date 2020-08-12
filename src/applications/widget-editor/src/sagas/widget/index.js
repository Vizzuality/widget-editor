import { fork, take, takeLatest, put, call, cancel, select } from "redux-saga/effects";

// CORE SERVICES
import {
  constants,
  VegaService,
  StateProxy,
} from "@widget-editor/core";

// SELECTORS
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";

// ACTIONS
import { setEditor, dataInitialized } from "@widget-editor/shared/lib/modules/editor/actions";
import { setWidgetConfig } from "@widget-editor/shared/lib/modules/widget-config/actions";

import getWidgetDataWithAdapter from './getWidgetData';

// EXPOSED HOOKS
import { localOnChangeState } from "exposed-hooks";

// Initialize state proxy so we can store the state of the editor
const stateProxy = new StateProxy();

// This generator updates local state used for our api hooks
// When editor changes or restores this gets called
// Action triggering this is: constants.sagaEvents.DATA_FLOW_UPDATE_HOOK_STATE
function* updateHookState() {
  const state = yield select();
  if (state.widgetEditor.editor.initialized && state.widgetEditor.widgetConfig) {
    localOnChangeState(state.widgetEditor);
  }
}

/**
 * @generator initializeData
 * sets widget data based on configuration
 * @triggers <void>
 */
function* initializeData(props) {
  const { widgetEditor } = yield select();
  const widgetData = yield call(getWidgetDataWithAdapter, widgetEditor)

  if (widgetData) {
    yield put(setEditor({ widgetData: widgetData.data }));
  }

  yield put(dataInitialized());

  if (props?.type === constants.sagaEvents.DATA_FLOW_VISUALIZATION_READY) {
    yield call(initializeVega);
  }
}

/**
 * @generator initializeVega
 * Generates a vega configuration that is displayed within the renderer
 * @triggers <void>
 */
function* initializeVega(props) {
  const { widgetEditor: store } = yield select();
  const { editor, configuration, widgetConfig } = store;
  const { widgetData, advanced } = editor;

  // FIXME
  // We can't execute `yield cancel()` here if `editor.widget` is not defined because the editor
  // may be instantiated with a dataset only
  // If we were to do so, the user wouldn't be able to create a widget (whether advanced or not)
  // because we would exit early in `syncEditor`
  // The downside of this is that as soon as the user interacts with the UI, we will serialise an
  // invalid widget (the local state will contain an incomplete widget) and the default content of
  // the advanced text editor will be that invalid widget
  // We could argue though that if the user decides to save an invalid widget, it's up to them

  /**
   * Traditional widgets
   * Using: @core VegaService
   * DataService has figured out how a widget will be configured
   * VegaService utilizes store properties and generates a vega config for us
   */
  if (!advanced) {
    const vega = new VegaService(
      {
        ...widgetConfig,
        paramsConfig: { ...configuration },
      },
      widgetData,
      configuration,
      editor,
      selectScheme(store),
    );
    yield put(setWidgetConfig(vega.getChart()));
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
      ...widgetConfig,
    };
    yield put(setWidgetConfig(ensureVegaProperties));
  }

  const { widgetEditor: newEditorState } = yield select();
  stateProxy.update(newEditorState);
}

/**
 * @generator syncEditor
 * Validates and checks if we need to update the state of the editor
 * 1. does widget data need to update?
 * 2. does vega configuration need to update?
 * @triggers <void>
 */
function* syncEditor() {
  const { widgetEditor } = yield select();

  if (stateProxy.ShouldUpdateData(widgetEditor)) {
    yield call(initializeData);
  }

  /**
   * Advanced widgets
   * For these widgets we will grab all properties in widget config and assume;
   * a valid vega configuration.
   * When in advanced mode we save the advanced input into the widgets config.
   */

  if (stateProxy.ShouldUpdateVega(widgetEditor)) {
    yield call(initializeVega);
  }

  // Make sure our local state hooks have the latest state
  const { widgetEditor: updatedState } = yield select();
  stateProxy.update(updatedState);
  yield call(updateHookState);
}

function* handleRestore() {
  yield call(initializeData);

  const { widgetEditor } = yield select();
  const { editor } = widgetEditor;
  const { widget } = editor;

  if (!widget) {
    // If the widget-editor is instantiated without a widget, we don't want to restore anything but
    // we still need to initialise the state proxy or else it cannot compare future states
    stateProxy.update(widgetEditor);
    // We cancel early so we don't serialise empty widgets
    yield cancel();
  }

  if (widgetEditor.configuration.visualizationType !== 'map') {
    yield call(initializeVega);
  }

  const { widgetEditor: updatedState } = yield select();
  stateProxy.update(updatedState);
  // Update the local state
  yield call(updateHookState);
}

/**
 * @generator main
 * Runs on load
 * @triggers <void>
 */
export default function* baseSaga() {

  /**
   * Trigger initial data request
   * @sagaEvents DATA_FLOW_VISUALIZATION_READY
   * Will resolve sql query and any editor state requried for rendering a widget
   * @triggers > EDITOR/dataInitialized
   */
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALIZATION_READY,
    initializeData
  );

  /**
   * When editor is restored, sync editor
   * @sagaEvents DATA_FLOW_RESTORED
   * Will resolve sql query and any editor state required for rendering a widget
   * @triggers <void>
   */
  yield takeLatest(constants.sagaEvents.DATA_FLOW_RESTORED, handleRestore);

  /**
   * Runs when app is active, on event sync editor
   * @reduxActions EDITOR_PATCH_CONFIGURATION
   * Whenever a patch gets triggered, we will check for updates on:
   * @widgetData Do we need to update data for a widget?
   * @vegaConfiguration Do we need to update vega configuration?
   * @triggers <void>
   */
  while(true) {
    yield take(constants.reduxActions.EDITOR_PATCH_CONFIGURATION)
    yield fork(syncEditor)
  }
}
