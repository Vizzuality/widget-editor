import {
  takeLatest,
  put,
  select,
  all,
  fork,
  call,
  take,
  delay,
  race,
  cancel
} from 'redux-saga/effects';
import has from 'lodash/has';
import { constants } from '@widget-editor/core';

import { LABELS, BASEMAPS } from '@widget-editor/map/lib/constants';
import {
  setConfiguration,
  resetConfiguration
} from '@widget-editor/shared/lib/modules/configuration/actions';
import {
  setEditor,
  resetEditor
} from '@widget-editor/shared/lib/modules/editor/actions';

import {
  setWidgetConfig,
  resetWidgetConfig
} from '@widget-editor/shared/lib/modules/widget-config/actions';

import {
  setFilters,
  resetFilters
} from '@widget-editor/shared/lib/modules/filters/actions';

import { getLocalCache } from 'exposed-hooks';

function* restoreEditor() {
  yield put(resetEditor());
  yield put(resetConfiguration());
  yield put(resetWidgetConfig());
  yield put(resetFilters());
}

function* setEditorInitialized() {
  yield put(setEditor({ initialized: true }));
}

function* preloadData() {
  const {
    widgetEditor: { editor, configuration: storeConfiguration }
  } = yield select();

  if (editor.widget) {
    const {
      widget: {
        attributes: { name, metadata, description, widgetConfig }
      }
    } = editor;

    const mapSpecifics = {
      ...storeConfiguration.map,
      ...(has(widgetConfig, 'lat') ? { lat: widgetConfig.lat } : {}),
      ...(has(widgetConfig, 'lng') ? { lat: widgetConfig.lng } : {}),
      ...(has(widgetConfig, 'bbox') ? { bbox: widgetConfig.bbox } : {}),
      ...(has(widgetConfig, 'basemapLayers')
        ? {
            basemap: {
              basemap:
                Object.keys(BASEMAPS).indexOf(
                  widgetConfig.basemapLayers.basemap
                ) !== -1
                  ? widgetConfig.basemapLayers.basemap
                  : 'dark',
              labels:
                Object.keys(LABELS).indexOf(
                  widgetConfig.basemapLayers.labels
                ) !== -1
                  ? widgetConfig.basemapLayers.labels
                  : 'none',
              boundaries:
                typeof widgetConfig.basemapLayers.boundaries === 'boolean'
                  ? widgetConfig.basemapLayers.boundaries
                  : false
            }
          }
        : {
            basemap: {
              basemap: 'dark',
              labels: 'none',
              boundaries: false
            }
          }),
      ...(has(widgetConfig, 'zoom') ? { zoom: widgetConfig.zoom } : {})
    };

    const relevantMetadata = metadata?.[0];
    const caption = relevantMetadata?.attributes.info?.caption ?? '';

    const datasetType = editor?.dataset?.attributes?.type;
    const rasterOnly = !!(datasetType && datasetType.match(/raster/));

    // If the dataset is raster, only maps can be done right now
    const isMap =
      rasterOnly ||
      editor?.widget?.attributes?.widgetConfig?.paramsConfig
        ?.visualizationType === 'map';

    const paramsConfig = has(widgetConfig, 'paramsConfig')
      ? widgetConfig.paramsConfig
      : null;

    // The “none” option is equal to having no aggregation at all but might cause issues when
    // generating the SQL query, that's why it is removed
    // This is an old value from v1
    if (paramsConfig?.aggregateFunction === 'none') {
      paramsConfig.aggregateFunction = null;
    }

    const configuration = {
      ...(paramsConfig ? { ...paramsConfig } : {}),
      title: name,
      description,
      caption,
      rasterOnly,
      visualizationType: isMap ? 'map' : 'chart',
      ...(isMap ? { chartType: 'map' } : {}),
      map: mapSpecifics
    };

    const format = widgetConfig?.paramsConfig?.value?.format || 's';

    if (configuration.orderBy) {
      yield put(
        setFilters({
          ...(configuration.orderBy ? { orderBy: configuration.orderBy } : {})
        })
      );
    }

    if (!paramsConfig) {
      yield put(setEditor({ advanced: true }));
      yield put(setWidgetConfig(widgetConfig));
    }

    yield put(setConfiguration({ ...configuration, format }));
  }
}

function* cancelAll() {
  const { adapter } = getLocalCache();
  adapter.abortRequests();
  const tasks = yield all([fork(preloadData), fork(setEditorInitialized)]);
  yield cancel([...tasks]);
  yield call(restoreEditor);
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );

  yield takeLatest(constants.sagaEvents.DATA_FLOW_RESTORE, restoreEditor);
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_VISUALIZATION_READY,
    setEditorInitialized
  );

  yield takeLatest(constants.sagaEvents.DATA_FLOW_UNMOUNT, cancelAll);

  /*
    When we patch configuration, set filters as loading
    race makes it possible to IF dataInitialized is never called,
    after 5 seconds we will still resolve loading: false for filters.
    This is so we don't block the interface if something unrelated went wrong.
  */
  while (yield take('widgetEditor/CONFIGURATION/patchConfiguration')) {
    yield put(setFilters({ loading: true }));
    yield race({
      token: take('widgetEditor/EDITOR/dataInitialized'),
      timeout: delay(3000)
    });
    yield put(setFilters({ loading: false }));
  }
}
