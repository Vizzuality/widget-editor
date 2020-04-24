import React from "react";

import LayerManager from "helpers/layer-manager";

import { BASEMAPS, LABELS, BOUNDARIES } from "constants";

import { StyledMapContainer, StyledCaption } from "./styles";

const MAP_CONFIG = {
  minZoom: 2,
  zoomControl: true,
};

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.labels = props.labels || LABELS["none"];
    this.widget = props.widget;

    this.widgetConfig = this.widget.attributes.widgetConfig;

    this.layers = props.layers;
    this.layerGroups = this.createLayerGroups(this.layers, props.layerId);

    if (this.widgetConfig?.basemapLayers?.basemap) {
      this.basemap = BASEMAPS[this.widgetConfig.basemapLayers.basemap];
    } else {
      this.basemap = BASEMAPS.dark;
    }
  }

  createLayerGroups(layers, layerId) {
    return layers.map(({ id, attributes }) => ({
      dataset: attributes.dataset,
      visible: true,
      layers: [
        {
          id: id || attributes.layerConfig.id,
          active: layerId ? id === layerId : attributes.default,
          ...attributes,
        },
      ],
    }));
  }

  getMapOptions() {
    const FROM_PROPS = {
      zoom: this.widgetConfig.zoom || 2,
      lat: this.widgetConfig.lat || 0,
      lng: this.widgetConfig.lng || 0,
    };
    const mapOptions = { ...FROM_PROPS, ...MAP_CONFIG };

    mapOptions.center = [
      this.widgetConfig.lat || 0,
      this.widgetConfig.lng || 0,
    ];

    return mapOptions;
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    this.instantiateMap();

    // If the bounds are not defined, we set them in the store
    if (!this.props?.mapConfig?.bounds) {
      this.onMapChange();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const loadingChanged = this.state.loading !== nextState.loading;
    const captionChanged = this.props.caption !== nextProps.caption;
    return loadingChanged || captionChanged;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.layerId !== this.props.layerId) {
      const expectedLayerGroups = this.createLayerGroups(
        nextProps.layers,
        nextProps.layerId
      );

      const layers = expectedLayerGroups
        .filter((l) => l.visible)
        .map((l) => l.layers.find((la) => la.active))
        .filter(Boolean);

      this.layerManager.removeLayers();
      this.addLayers(layers);
    }
  }

  instantiateMap() {
    if (!this.mapNode) return;
    this.map = L.map(this.mapNode, this.getMapOptions());
    this.map.scrollWheelZoom.disable();

    // If the layer has bounds, we just pan in the
    // area
    if (this.props?.mapConfig?.bounds) {
      this.map.fitBounds(this.props.mapConfig.bounds);
    }

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
      this.map.zoomControl.setPosition("topright");
    }

    this.setBasemap(this.basemap);
    this.setLabels(this.labels);
    this.setBoundaries(this.props?.boundaries || false);

    this.setEventListeners();

    this.instantiateLayerManager();

    const layers = this.layerGroups
      .filter((l) => l.visible)
      .map((l) => l.layers.find((la) => la.active))
      .filter(Boolean);

    this.addLayers(layers);
  }

  instantiateLayerManager() {
    const stopLoading = () => {
      // Don't execute callback if component has been unmounted
      if (!this.hasBeenMounted) return;
      this.setState({ loading: false });
    };

    this.layerManager = new LayerManager(this.map, {
      onLayerAddedSuccess: stopLoading,
      onLayerAddedError: stopLoading,
    });
  }

  setLabels(labels) {
    if (this.labelsLayer) this.labelsLayer.remove();

    if (labels.id !== "none") {
      this.labelsLayer = L.tileLayer(labels.value, labels.options || {})
        .addTo(this.map)
        .setZIndex(this.props.layerGroups.length + 1);
    }
  }

  addLayers(layers) {
    if (!layers) return;

    this.setState({ loading: true });

    layers.forEach((layer) => {
      this.layerManager.addLayer(layer, {
        zIndex: layer.order,
      });
    });
  }

  getMapParams() {
    const bounds = this.map.getBounds();
    const params = {
      zoom: this.map.getZoom(),
      latLng: this.map.getCenter(),
      bounds: [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      ],
    };
    return params;
  }

  onMapChange() {
    this.props.setMapParams(this.getMapParams());
  }

  setEventListeners() {
    if (this.props.setMapParams) {
      this.map.on("zoomend", () => this.onMapChange());
      this.map.on("dragend", () => this.onMapChange());
    }
  }

  setBoundaries(showBoundaries) {
    if (this.boundariesLayer) this.boundariesLayer.remove();

    if (showBoundaries) {
      this.boundariesLayer = L.tileLayer(
        BOUNDARIES.dark.value,
        BOUNDARIES.dark.options || {}
      )
        .addTo(this.map)
        .setZIndex(this.props.layerGroups.length + 2);
    }
  }

  setBasemap(basemap) {
    if (this.tileLayer) this.tileLayer.remove();

    this.tileLayer = L.tileLayer(basemap.value, basemap.options)
      .addTo(this.map)
      .setZIndex(0);
  }

  render() {
    const { caption = null } = this.props;
    return (
      <StyledMapContainer>
        {caption && <StyledCaption>{caption}</StyledCaption>}
        <div
          ref={(node) => {
            this.mapNode = node;
          }}
          className="map-leaflet"
        />
      </StyledMapContainer>
    );
  }
}

export default Map;