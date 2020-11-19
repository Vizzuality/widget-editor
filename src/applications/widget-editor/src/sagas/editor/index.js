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

    const { axes } = widgetConfig;

    // The horizontal bar charts have their axes inverted: the one named 'x' is based on the value
    // and the one named 'y' is based on the category
    const chartsWithInversedAxes = ['bar-horizontal', 'stacked-bar-horizontal'];
    const xAxisName = chartsWithInversedAxes.includes(paramsConfig?.chartType) ? 'y' : 'x';
    const yAxisName = chartsWithInversedAxes.includes(paramsConfig?.chartType) ? 'x' : 'y';

    const xAxis = axes?.find(axis => axis.scale === xAxisName);
    const yAxis = axes?.find(axis => axis.scale === yAxisName);

    const categoryName = paramsConfig?.category?.alias ?? paramsConfig?.category?.name;
    const valueName = paramsConfig?.value?.alias ?? paramsConfig?.value?.name;

    // There are two ways an axis can get a title: either the user manually give it one, or by
    // default, the title is the alias/name of the field the axis is based on
    // When we're restoring a widget, we want to restore the axes text fields (the “overwrite axis
    // title” inputs), only if the user has manually entered titles
    // If we would always restore them, when the user would change the category or value fields, the
    // axes titles would stay with the names of the previous fields
    // There's no easy way to detect if the titles were set manually or automatically, apart from
    // checking if they equal the alias/name of the fields used at serialization time
    const xAxisTitle = xAxis?.title && (!categoryName || categoryName !== xAxis.title)
      ? xAxis.title
      : null;
    const yAxisTitle = yAxis?.title && (!valueName || valueName !== yAxis.title)
      ? yAxis.title
      : null;

    const configuration = {
      ...(paramsConfig ? { ...paramsConfig } : {}),
      title: name,
      description,
      caption,
      xAxisTitle,
      yAxisTitle,
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
