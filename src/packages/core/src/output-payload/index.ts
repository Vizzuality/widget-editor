import { Generic, Adapter, Widget } from '@widget-editor/types';
import getEditorMeta from '@widget-editor/shared/lib/editor-meta';
import {
  selectTitle,
  selectDescription,
  selectVisualizationType,
  selectLimit,
  selectValue,
  selectCategory,
  selectColor,
  selectSize,
  selectOrderBy,
  selectAggregateFunction,
  selectChartType,
  selectAreaIntersection,
  selectBand,
  selectDonutRadius,
  selectSliceCount,
  selectLayer,
  selectCaption,
} from '@widget-editor/shared/lib/modules/configuration/selectors';
import { selectSerializedWidgetConfig } from '@widget-editor/shared/lib/modules/widget-config/selectors';
import {
  selectAdvanced,
  selectZoom,
  selectLat,
  selectLng,
  selectBounds,
  selectBbox,
  selectBasemap,
} from '@widget-editor/shared/lib/modules/editor/selectors';
import { selectFiltersList } from '@widget-editor/shared/lib/modules/filters/selectors';
import { selectEndUserFilters } from '@widget-editor/shared/lib/modules/end-user-filters/selectors';
import { getSerializedFilters } from '../filters';

/**
 * Return the serialized widgetConfig object
 * @param store Redux store
 * @param adapter Instance of the adapter
 */
const getSerializedWidgetConfig = (
  store: Generic.ReduxStore,
  adapter: Adapter.Service,
): Widget.WidgetConfig => {
  // reason
  const advanced = selectAdvanced(store);

  const serializedWidgetConfig: { [key: string]: any } = {};

  if (selectVisualizationType(store) !== 'map') {
    const widgetConfig = selectSerializedWidgetConfig(store);
    Object.keys(widgetConfig).forEach((key) => {
      serializedWidgetConfig[key] = widgetConfig[key];
    });

    // $schema must be removed because the RW API doesn't support keys that start with the $ symbol
    // This should probably live in the adapter, but it's safe to remove for all of the adapters
    if (serializedWidgetConfig.$schema) {
      delete serializedWidgetConfig.$schema;
    }

    if (!advanced) {
      serializedWidgetConfig.paramsConfig = {
        visualizationType: selectVisualizationType(store),
        limit: selectLimit(store),
        value: selectValue(store),
        category: selectCategory(store),
        color: selectColor(store),
        size: selectSize(store),
        orderBy: selectOrderBy(store),
        aggregateFunction: selectAggregateFunction(store),
        chartType: selectChartType(store),
        filters: getSerializedFilters(selectFiltersList(store)),
        endUserFilters: selectEndUserFilters(store),
        areaIntersection: selectAreaIntersection(store),
        band: selectBand(store),
        donutRadius: selectDonutRadius(store),
        sliceCount: selectSliceCount(store),
      };
    }
  } else {
    serializedWidgetConfig.type = 'map';
    serializedWidgetConfig.layer_id = selectLayer(store);
    serializedWidgetConfig.zoom = selectZoom(store);
    serializedWidgetConfig.lat = selectLat(store);
    serializedWidgetConfig.lng = selectLng(store);
    serializedWidgetConfig.bounds = selectBounds(store);
    serializedWidgetConfig.bbox = selectBbox(store);

    if (selectBasemap(store)) {
      serializedWidgetConfig.basemapLayers = selectBasemap(store);
    }

    serializedWidgetConfig.paramsConfig = {
      visualizationType: selectVisualizationType(store),
      layer: selectLayer(store),
    };
  }

  serializedWidgetConfig.we_meta = getEditorMeta(adapter.getName(), advanced);

  return serializedWidgetConfig;
};


/**
 * Return the output of the widget-editor
 * @param store Redux store
 * @param adapter Instance of the adapter
 */
const getOutputPayload = (
  store: Generic.ReduxStore,
  adapter: Adapter.Service,
): Generic.OutputPayload => {
  return {
    name: selectTitle(store),
    description: selectDescription(store),
    widgetConfig: getSerializedWidgetConfig(store, adapter),
    metadata: {
      // NOTE: the output doesn't contain *all* of the widget's metadata, but only what the editor
      // cares about
      caption: selectCaption(store),
    }
  };
};

export default getOutputPayload;