import { takeLatest, put, select, all, fork, call, take, cancel } from "redux-saga/effects";
import { constants } from "@widget-editor/core";

import { LABELS, BASEMAPS } from "@widget-editor/map/src/constants";
import { setConfiguration, resetConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import { setEditor, resetEditor } from "@widget-editor/shared/lib/modules/editor/actions";

import { resetWidget } from "@widget-editor/shared/lib/modules/widget/actions";

import { setFilters, resetFilters } from "@widget-editor/shared/lib/modules/filters/actions";

function* restoreEditor() {
  yield put(resetEditor());
  yield put(resetConfiguration());
  yield put(resetWidget());
  yield put(resetFilters());
}

function* setEditorInitialized() {
  yield put(setEditor({ initialized: true }));
}

function* preloadData() {
  const {
    widgetEditor: { editor, configuration: storeConfiguration },
  } = yield select();

  if (editor.widget) {
    const {
      widget: {
        attributes: { name, caption, description, widgetConfig },
      },
    } = editor;

    const mapSpecifics = {
      ...storeConfiguration.map,
      ...(widgetConfig.hasOwnProperty("lat") ? { lat: widgetConfig.lat } : {}),
      ...(widgetConfig.hasOwnProperty("lng") ? { lat: widgetConfig.lng } : {}),
      ...(widgetConfig.hasOwnProperty("bbox")
        ? { bbox: widgetConfig.bbox }
        : {}),
      ...(widgetConfig.hasOwnProperty("basemapLayers")
        ? {
          basemap: {
            basemap: Object.keys(BASEMAPS).indexOf(widgetConfig.basemapLayers.basemap) !== -1
              ? widgetConfig.basemapLayers.basemap
              : "dark",
            labels: Object.keys(LABELS).indexOf(widgetConfig.basemapLayers.labels) !== -1
              ? widgetConfig.basemapLayers.labels
              : "none",
            boundaries: typeof widgetConfig.basemapLayers.boundaries === 'boolean'
              ? widgetConfig.basemapLayers.boundaries
              : false,
          }
        }
        : {
          basemap: "dark",
          labels: "none",
          boundaries: false,
        }),
      ...(widgetConfig.hasOwnProperty("zoom")
        ? { zoom: widgetConfig.zoom }
        : {}),
    };

    const datasetType = editor?.dataset?.attributes?.type;
    const rasterOnly = !!(datasetType && datasetType.match(/raster/));

    // If the dataset is raster, only maps can be done right now
    const isMap = rasterOnly
      || editor?.widget?.attributes?.widgetConfig?.paramsConfig?.visualizationType === "map";

    const paramsConfig = widgetConfig.hasOwnProperty("paramsConfig")
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
      visualizationType: isMap ? "map" : "chart",
      ...(isMap ? { chartType: "map" } : {}),
      map: mapSpecifics,
    };

    const format = widgetConfig?.paramsConfig?.value?.format || "s";

    if (configuration.orderBy) {
      yield put(
        setFilters({
          ...(configuration.orderBy ? { orderBy: configuration.orderBy } : {}),
        })
      );
    }

    if (!paramsConfig) {
      yield put(
        setEditor({ advanced: true, customConfiguration: widgetConfig })
      );
    }

    yield put(setConfiguration({ ...configuration, format }));
  }
}

function* cancelAll() {
  const tasks = yield all([
    fork(preloadData),
    fork(setEditorInitialized)
  ])
  yield cancel([...tasks]);
  yield call(restoreEditor)
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );

  yield takeLatest('WIDGET/EDITOR/RESTORE', restoreEditor);
  yield takeLatest(constants.sagaEvents.DATA_FLOW_VISUALISATION_READY, setEditorInitialized);


  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_UNMOUNT,
    cancelAll
  )

}
