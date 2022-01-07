import React, { useMemo } from 'react';
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

export default LayerManager;
