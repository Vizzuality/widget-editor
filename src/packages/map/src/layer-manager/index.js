import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { LayerManager as VizzLayerManager, Layer } from '@vizzuality/layer-manager-react';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';

import { parseLayers } from './utils';

const LayerManager = ({ layers, map, providers }) => {
  const parsedLayers = useMemo(() => parseLayers(layers), [layers]);
  
  return (
    <VizzLayerManager map={map} plugin={PluginMapboxGl} providers={providers}>
      {parsedLayers.map((_layer) => (
        <Layer
          key={_layer.id}
          {..._layer}
          // {...(_layer.decodeParams &&
          //   CANVAS_DECODERS[_layer.layerConfig.decoder] && {
          //     decodeFunction: CANVAS_DECODERS[_layer.layerConfig.decoder],
          //   })}
        />
      ))}
    </VizzLayerManager>
  );
};

LayerManager.propTypes = {
  layers: PropTypes.array,
  providers: PropTypes.shape({}),
  map: PropTypes.shape({
    MAPSTYLES: PropTypes.string,
    VIEWPORT: PropTypes.object,
    providers: PropTypes.object,
    mapboxToken: PropTypes.string
  })
};


export default LayerManager;
