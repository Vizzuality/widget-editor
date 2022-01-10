import omit from 'lodash/omit';

/**
 * Specify how to get the data and the layers for this provider
 * @param layerModel Instance of LayerModel
 * @param resolve Object
 * @param reject Function
 */
class WMSProviderMaker {
  /**
   * REQUIRED
   * A name (key) for the provider.
   * Use the same name you will use in your layerSpec object.
   */
  name = 'wms';

  getTilerUrl = (layer) => {
    const source = layer.source;

    if (!source.tiles) throw new Error("A WMS server must be provided in the 'tiles' property");

    const defaultParams = {
      bbox: '{bbox-epsg-3857}',
      request: 'GetMap',
      service: 'WMS',
    };

    const baseURLTiler = new URL(source.tiles[0]);
    const baseURLSearch = new URLSearchParams(baseURLTiler.search);
    const baseURLParams = Object.fromEntries(baseURLSearch);

    const queryParams = new URLSearchParams({
      ...defaultParams,
      ...baseURLParams,
      ...(layer.source.provider?.options || {}),
    });

    return `${baseURLTiler.origin}${baseURLTiler.pathname}?${window.decodeURIComponent(
      queryParams.toString(),
    )}`;
  };

  handleData = (
    // layerModel,
    layer,
    resolve,
    reject,
  ) => {
    try {
      const result = {
        ...layer,
        source: {
          ...omit(layer.source, 'provider'),
          tiles: [this.getTilerUrl(layer)],
        },
      };
      resolve(result);
    } catch (error) {
      reject(error.message);
    }
  };
}

export default WMSProviderMaker;