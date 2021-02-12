import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import has from 'lodash/has';
import styled from 'styled-components';

import { Icons } from 'vizzuality-components';

import LayerManager from 'helpers/layer-manager';

import { LABELS, BOUNDARIES, BASEMAPS } from 'constants';

import chroma from 'chroma-js';

import { COLOR_WHITE } from '@widget-editor/shared/lib/styles/style-constants';

import { Legend, LegendListItem, LegendItemTypes } from 'vizzuality-components';

import { StyledMapContainer } from './styles';

const DEFAULT_MAP_PROPERTIES = {
  zoom: 2,
  lat: 0,
  lng: 0,
  bbox: undefined,
  basemap: {
    basemap: 'dark'
  }
};

const MAP_CONFIG = {
  minZoom: 2,
  zoomControl: true
};

const StyledLegend = styled.div`
  position: absolute;
  bottom: 35px;
  right: 30px;
  width: 80%;
  max-width: 400px;
  background: ${COLOR_WHITE};
  border-radius: 4px;
`;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      legendOpen: true
    };

    this.mapConfiguration = props?.mapConfiguration
      ? props.mapConfiguration
      : DEFAULT_MAP_PROPERTIES;

    this.layers = props.layers;
    this.layerGroups = this.createLayerGroups(this.layers, props.layerId);

    if (this.mapConfiguration.basemap) {
      this.basemap = BASEMAPS[this.mapConfiguration.basemap.basemap];
    } else {
      this.basemap = BASEMAPS.dark;
    }

    if (this.mapConfiguration.basemap?.labels) {
      this.labels = LABELS[this.mapConfiguration.basemap.labels];
    } else {
      this.labels = LABELS['none'];
    }
  }

  createLayerGroups(layers, layerId) {
    if (!layers?.length) {
      return [];
    }
    return layers.map(({ id, dataset, ...rest }) => ({
      dataset,
      visible: true,
      layers: [
        {
          id,
          active: layerId ? id === layerId : rest.default,
          ...rest
        }
      ]
    }));
  }

  getMapOptions() {
    const FROM_PROPS = {
      zoom: this.mapConfiguration.zoom || 2,
      lat: this.mapConfiguration.lat || 0,
      lng: this.mapConfiguration.lng || 0,
      bbox: this.mapConfiguration.bbox
    };

    const mapOptions = { ...FROM_PROPS, ...MAP_CONFIG };

    mapOptions.center = [
      this.mapConfiguration.lat || 0,
      this.mapConfiguration.lng || 0
    ];

    return mapOptions;
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    this.instantiateMap();
    const mapOptions = this.getMapOptions();

    if (!has(mapOptions, 'bbox')) {
      this.onMapChange();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const loadingChanged = this.state.loading !== nextState.loading;
    const legendToggleChanged = this.state.legendOpen !== nextState.legendOpen;
    const basemapChanged = !isEqual(
      nextProps.mapConfiguration.basemap,
      this.props.mapConfiguration.basemap
    );
    const bboxChanged = !isEqual(
      nextProps.mapConfiguration.bbox,
      this.props.mapConfiguration.bbox
    );

    return loadingChanged
      || legendToggleChanged
      || basemapChanged
      || bboxChanged;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.layerId !== this.props.layerId) {
      const expectedLayerGroups = this.createLayerGroups(
        nextProps.layers,
        nextProps.layerId
      );

      const layers = expectedLayerGroups
        .filter(l => l.visible)
        .map(l => l.layers.find(la => la.active))
        .filter(Boolean);

      this.layerManager.removeLayers();
      this.addLayers(layers);
    }

    if (
      this.props.mapConfiguration?.basemap?.labels !==
      nextProps.mapConfiguration?.basemap?.labels
    ) {
      this.setLabels(LABELS[nextProps.mapConfiguration.basemap.labels]);
    }

    if (
      this.props.mapConfiguration?.basemap?.boundaries !==
      nextProps.mapConfiguration?.basemap?.boundaries
    ) {
      this.setBoundaries(nextProps.mapConfiguration.basemap.boundaries);
    }
  }

  componentDidUpdate() {
    const { mapConfiguration } = this.props;
    if (!isEqual(this.basemap.basemap, mapConfiguration?.basemap?.basemap)) {
      this.basemap = BASEMAPS[mapConfiguration.basemap.basemap];
      this.setBasemap(this.basemap);
    }
  }

  isNullSetBBox(mapOptions) {
    return mapOptions.lat === 0 && mapOptions.lng === 0;
  }

  instantiateMap() {
    if (!this.mapNode) return;
    const mapOptions = this.getMapOptions();
    this.map = L.map(this.mapNode, mapOptions);
    this.map.scrollWheelZoom.disable();

    // Disable interaction if necessary
    if (!this.props.interactionEnabled) {
      this.map.dragging.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
    }

    this.map.attributionControl.addAttribution(
      '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    );

    if (this.map.zoomControl) {
      this.map.zoomControl.setPosition('topright');
    }

    this.setBasemap(this.basemap);

    this.setEventListeners();
    this.instantiateLayerManager();

    const layers = this.layerGroups
      .filter(l => l.visible)
      .map(l => l.layers.find(la => la.active))
      .filter(Boolean);

    this.activeLayers = layers;
    this.addLayers(layers);

    this.setLabels(this.labels);
    this.setBoundaries(
      this.props.mapConfiguration?.basemap?.boundaries || false
    );

    // In version 2 of the editor we are storing the bbox
    // This is so in the future we can migrate to for example mapbox
    // If we have a BBOX, this is automatically saved in the new editor
    // We pan to it if present
    // NOTE: the bbox format is still Leaflet's
    if (mapOptions.bbox && Array.isArray(mapOptions.bbox)) {
      const [SWLat, SWLon, NELat, NELon] = mapOptions.bbox;
      this.map.fitBounds(
        [
          [SWLat, SWLon],
          [NELat, NELon]
        ],
        { animate: false }
      );
    }
  }

  instantiateLayerManager() {
    const stopLoading = () => {
      // Don't execute callback if component has been unmounted
      if (!this.hasBeenMounted) return;
      this.setState({ loading: false });
    };

    this.layerManager = new LayerManager(this.map, {
      adapter: this.props.adapter,
      onLayerAddedSuccess: stopLoading,
      onLayerAddedError: stopLoading
    });
  }

  /**
   * Set the map's labels
   * @param {Label} labels Labels
   */
  setLabels(labels) {
    if (labels && this.labelsLayer) this.labelsLayer.remove();
    if (labels && labels.id !== 'none') {
      this.labelsLayer = L.tileLayer(labels.value, labels.options || {})
        .addTo(this.map)
        .setZIndex(this.activeLayers.length + 1);
    }
  }

  addLayers(layers) {
    if (!layers) return;

    this.setState({ loading: true });
    layers.forEach(layer => {
      this.layerManager.addLayer(layer, {
        zIndex: layer.order
      });
    });
  }

  getMapParams() {
    const bounds = this.map.getBounds();
    const params = {
      zoom: this.map.getZoom(),
      latLng: this.map.getCenter(),
      basemap: this.props.mapConfiguration.basemap,
      labels: this.props.mapConfiguration.labels,
      bounds: [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
      ]
    };
    return params;
  }

  onMapChange() {
    const { onChange } = this.props;

    if (onChange) {
      const mapParams = this.getMapParams();
      const { zoom } = mapParams;
      const { lat, lng } = mapParams.latLng;
      const [bbox1, bbox2] = mapParams.bounds;

      onChange({
        lat,
        lng,
        zoom,
        basemap: mapParams.basemap,
        bounds: mapParams.bounds,
        bbox: [...bbox1, ...bbox2]
      });
    }
  }

  setEventListeners() {
    this.map.on('zoomend', () => this.onMapChange());
    this.map.on('dragend', () => this.onMapChange());
  }

  setBoundaries(showBoundaries) {
    if (this.boundariesLayer) this.boundariesLayer.remove();
    if (showBoundaries && this.activeLayers) {
      this.boundariesLayer = L.tileLayer(
        BOUNDARIES.dark.value,
        BOUNDARIES.dark.options || {}
      )
        .addTo(this.map)
        .setZIndex(this.activeLayers.length + 2);
    }
  }

  setBasemap(basemap) {
    if (this.tileLayer) this.tileLayer.remove();
    this.tileLayer = L.tileLayer(basemap.value, basemap.options)
      .addTo(this.map)
      .setZIndex(0);
  }

  getLegendLayerTitle(legendConfig, lc) {
    if (legendConfig.type === 'gradient') {
      return lc.unit;
    }
    if (legendConfig.type === 'choropleth') {
      return lc.name;
    }
  }

  generateGradient(items) {
    const scale = items.map(i => i.color);
    const domain = items.map(i => i.value);
    return chroma.scale(scale).domain(domain).colors(items.length);
  }

  render() {
    const { thumbnail = false, layerId } = this.props;
    return (
      <StyledMapContainer>
        <Icons />
        {!thumbnail && (
          <StyledLegend>
            <Legend maxHeight={140} sortable={false}>
              {this.layerGroups
                .filter(lg => lg.layers.find(l => l.id === layerId))
                .map((lg, i) => (
                  <LegendListItem index={i} key={lg.dataset} layerGroup={lg}>
                    <LegendItemTypes />
                  </LegendListItem>
                ))}
            </Legend>
          </StyledLegend>
        )}
        <div
          ref={node => {
            this.mapNode = node;
          }}
          className="map-leaflet"
        />
      </StyledMapContainer>
    );
  }
}

Map.propTypes = {
  adapter: PropTypes.object.isRequired,
  interactionEnabled: PropTypes.bool,
  thumbnail: PropTypes.bool,
  layerId: PropTypes.string,
  onChange: PropTypes.func,
  layers: PropTypes.any,
  mapConfiguration: PropTypes.shape({
    labels: PropTypes.any,
    bbox: PropTypes.arrayOf(PropTypes.number),
    basemap: PropTypes.shape({
      labels: PropTypes.string,
      boundaries: PropTypes.any,
      basemap: PropTypes.string
    })
  })
};

export default Map;
