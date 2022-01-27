import omit from 'lodash/omit';

/**
 * Specify how to get the data and the layers for this provider
 * @param layerModel Instance of LayerModel
 * @param resolve Object
 * @param reject Function
 */
class GeeProviderMaker {
  /**
   * REQUIRED
   * A name (key) for the provider.
   * Use the same name you will use in your layerSpec object.
   */
  name = 'gee';

  getTilerUrl = (layer) => {
    if (!layer) throw new Error('layer required to generate tiler URL');
    return `${process.env.REACT_APP_WRI_API_URL}/v1/layer/${layer.id}/tile/gee/{z}/{x}/{y}`;
  };

  handleData = (
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
          tiles: [this.getTilerUrl(layer)],
        },
      };
      resolve(result);
    } catch (error) {
      reject(error.message);
    }
  };
}

export default GeeProviderMaker;