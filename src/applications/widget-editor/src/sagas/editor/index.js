import { takeLatest, put, select } from "redux-saga/effects";
import { constants } from "@widget-editor/core";

import { setConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

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

    const configuration = {
      ...widgetConfig.paramsConfig,
      title: name,
      description,
      caption,
      rasterOnly,
      ...(isMap ? { chartType: "map" } : {}),
      map: mapSpecifics,
    };

    const format = widgetConfig?.paramsConfig?.value?.format || "s";

    yield put(setConfiguration({ ...configuration, format }));
  }
}

export default function* baseSaga() {
  yield takeLatest(
    constants.sagaEvents.DATA_FLOW_DATASET_WIDGET_READY,
    preloadData
  );
}
