import { fetch } from '@vizzuality/layer-manager-utils';
import omit from 'lodash/omit';

/**
 * Specify how to get the data and the layers for this provider
 * @param layerModel Instance of LayerModel
 * @param resolve Object
 * @param reject Function
 */
class FeatureServiceProviderMaker {
  /**
   * REQUIRED
   * A name (key) for the provider.
   * Use the same name you will use in your layerSpec object.
   */
  name = 'feature-service';

  getGeoJSON = async (
    layer,
    layerModel,
  ) => {
    const { provider } = layer.source;

    const { tiler, ...restOptions } = provider.options;

    if (!tiler) throw new Error("An ArcGIS MapServer must be provided in the 'tiles' property");

    const params = {
      f: 'geojson',
      geometryType: 'esriGeometryEnvelope',
      spatialRel: 'esriSpatialRelIntersects',
      returnGeometry: true,
      returnTrueCurves: false,
      returnIdsOnly: false,
      returnCountOnly: false,
      returnZ: false,
      returnM: false,
      returnDistinctValues: false,
      returnExtentOnly: false,
      where: '1=1',
      ...(restOptions || {}),
    };

    const geojson = await fetch('get', `${tiler}/query`, { params }, layerModel);

    return {
      type: 'geojson',
      data: geojson,
    };
  };

  handleData = async (
    layerModel,
    layer,
    resolve,
    reject,
  ) => {
    try {
      const result = {
        ...layer,
        source: {
          ...omit(layer.source, 'provider'),
        },
      };

      resolve({
        ...result,
        source: (await this.getGeoJSON(layer, layerModel)),
      });
    } catch (error) {
      reject(error.message);
    }
  };
}

export default FeatureServiceProviderMaker;