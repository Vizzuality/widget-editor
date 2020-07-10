import { takeLatest, put, select } from "redux-saga/effects";
import { constants } from "@widget-editor/core";

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
        ? { basemap: widgetConfig.basemapLayers }
        : {}),
      ...(widgetConfig.hasOwnProperty("zoom")
        ? { zoom: widgetConfig.zoom }
        : {}),
    };

    const datasetType = editor?.dataset?.attributes?.type;
    const rasterOnly = datasetType && datasetType.match(/raster/);

    const isMap =
      editor?.widget?.attributes?.widgetConfig?.paramsConfig
        ?.visualizationType === "map";

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
      ...(isMap ? { chartType: "map" } : {}),
      map: mapSpecifics,
    };

    const format = widgetConfig?.paramsConfig?.value?.format || "s";

    if (configuration.orderBy || configuration.groupBy) {
      yield put(
        setFilters({
          ...(configuration.orderBy ? { orderBy: configuration.orderBy } : {}),
          ...(configuration.groupBy ? { groupBy: configuration.groupBy } : {}),
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

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );

  yield takeLatest(constants.sagaEvents.DATA_FLOW_RESTORE, restoreEditor);
  yield takeLatest(constants.sagaEvents.DATA_FLOW_VISUALISATION_READY, setEditorInitialized);
}
