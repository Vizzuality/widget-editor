import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LayerManager as VizzLayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

// TODO: The decoders should be passed into the editor???? i think so
import CANVAS_DECODERS from './canvas-decoders';

class LayerManager extends PureComponent {
  static propTypes = {
    map: PropTypes.object.isRequired,
    layers: PropTypes.array,
  }

  static defaultProps = { layers: [] }

  render() {
    const {
      map,
      layers,
    } = this.props;

    return (
      <VizzLayerManager
        map={map}
        plugin={PluginMapboxGl}
      >
        {layers.map((_layer) => (
          <Layer
            key={_layer.id}
            {..._layer}
            {...(_layer?.layerConfig?.decoder && CANVAS_DECODERS[_layer.layerConfig.decoder])
              && { decodeFunction: CANVAS_DECODERS[_layer.layerConfig.decoder] }}
          />
        ))}
      </VizzLayerManager>
    );
  }
}

export default LayerManager;
