import pick from 'lodash/pick';

export const parseLayers = (layers) => {
  return layers.map((layer) => {
    const { id, layerConfig } = layer;
    const layerProps = pick(layerConfig, [
      'deck',
      'decodeParams',
      'decodeFunction',
      'images',
      'interactivity',
      'opacity',
      'params',
      'sqlParams',
      'source',
      'type',
      'render',
      'visibility',
      'zIndex',
    ]);

    return {
      id,
      ...layerProps,
    };
  });
};

export default {
  parseLayers,
};

