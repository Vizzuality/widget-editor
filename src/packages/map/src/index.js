import React from "react";

import { redux } from "@widget-editor/shared";
import isEqual from "lodash/isEqual";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import BASEMAPS from "@widget-editor/shared/lib/constants/basemaps";

import LayerManager from "helpers/layer-manager";

import { LABELS, BOUNDARIES } from "constants";

import chroma from "chroma-js";

import {
  StyledMapContainer,
  StyledCaption,
  StyledLegend,
  StyledLegendTitle,
  StyledLegendConfig,
  StyledLegendLayerWrapper,
  StyledConfigItemColor,
  StyledLegendConfigItem,
  StyledGradientUnits,
  StyledLegendToggle,
  StyledClosedLegend,
  StyledGradient,
} from "./styles";

import CloseIcon from "./close-icon";

const DEFAULT_MAP_PROPERTIES = {
  zoom: 2,
  lat: 0,
  lng: 0,
  bbox: [0, 0, 0, 0],
  basemap: {
    basemap: "dark",
  },
};

const MAP_CONFIG = {
  minZoom: 2,
  zoomControl: true,
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      legendOpen: true,
    };

    this.renderLegend = this.renderLegend.bind(this);

    this.labels = props.labels || LABELS["none"];
    this.widget = props.widget;

    this.mapConfiguration = props?.mapConfiguration
      ? props.mapConfiguration
      : DEFAULT_MAP_PROPERTIES;

    this.widgetConfig = this.widget.attributes.widgetConfig;

    this.layers = props.layers;
    this.layerGroups = this.createLayerGroups(this.layers, props.layerId);

    if (this.mapConfiguration.basemap) {
      this.basemap = BASEMAPS[this.mapConfiguration.basemap.basemap];
    } else {
      this.basemap = BASEMAPS.dark;
    }
  }

  createLayerGroups(layers, layerId) {
    if (!layers || !layers.reduce(Boolean)) {
      return [];
    }
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
      zoom: this.mapConfiguration.zoom || 2,
      lat: this.mapConfiguration.lat || 0,
      lng: this.mapConfiguration.lng || 0,
      bbox: this.mapConfiguration.bbox || [0, 0, 0, 0],
    };

    const mapOptions = { ...FROM_PROPS, ...MAP_CONFIG };

    mapOptions.center = [
      this.mapConfiguration.lat || 0,
      this.mapConfiguration.lng || 0,
    ];

    return mapOptions;
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    this.instantiateMap();
    const mapOptions = this.getMapOptions();

    // If the bounds are not defined, we set them in the store
    if (!this.props?.mapConfig?.bounds || !mapOptions.hasOwnProperty("bbox")) {
      this.onMapChange();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const loadingChanged = this.state.loading !== nextState.loading;
    const captionChanged = this.props.caption !== nextProps.caption;
    const legendToggleChanged = this.state.legendOpen !== nextState.legendOpen;
    const basemapChanged = !isEqual(
      nextProps.mapConfiguration.basemap,
      this.props.mapConfiguration.basemap
    );

    return (
      loadingChanged || captionChanged || legendToggleChanged || basemapChanged
    );
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
      this.map.zoomControl.setPosition("topright");
    }

    this.setBasemap(this.basemap);
    this.setLabels(this.labels);
    this.setBoundaries(!!this.props?.mapConfiguration?.bbox || false);

    this.setEventListeners();
    this.instantiateLayerManager();

    const layers = this.layerGroups
      .filter((l) => l.visible)
      .map((l) => l.layers.find((la) => la.active))
      .filter(Boolean);

    this.activeLayers = layers;
    this.addLayers(layers);
    
    // In version2 of the editor we are storing the bbox
    // This is so in the future we can migrate to for example mapbox
    // If we have a bbox, this is automaticly saved in the new editor
    // We pan to it if present
    if (mapOptions.bbox && Array.isArray(mapOptions.bbox)) {
      const [b0,b1,b2,b3] = mapOptions.bbox;
      this.map.fitBounds([
        [b1, b0],
        [b3, b2]
      ], { animate: false })
    } else if (this.props?.mapConfig?.bounds) {
      // Legacy editor stores "bounds"
      // Apply them instead if present
      this.map.fitBounds(this.props.mapConfig.bounds, { animate: false });
    }

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
    const { patchConfiguration = null } = this.props;
    if (patchConfiguration) {
      const mapParams = this.getMapParams();
      const { zoom } = mapParams;
      const { lat, lng } = mapParams.latLng;
      const [bbox1, bbox2] = mapParams.bounds;

      patchConfiguration({
        map: {
          lat,
          lng,
          zoom,
          bounds: mapParams.bounds,
          bbox: [...bbox1, ...bbox2],
        },
      });
    }
  }

  setEventListeners() {
    this.map.on("zoomend", () => this.onMapChange());
    this.map.on("dragend", () => this.onMapChange());
  }

  setBoundaries(showBoundaries) {
    if (this.boundariesLayer) this.boundariesLayer.remove();
    if (showBoundaries && this.props.layerGroups) {
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

  getLegendLayerTitle(legendConfig, lc) {
    if (legendConfig.type === "gradient") {
      return lc.unit;
    }
    if (legendConfig.type === "choropleth") {
      return lc.name;
    }
  }

  generateGradient(items) {
    const scale = items.map((i) => i.color);
    const domain = items.map((i) => i.value);
    return chroma.scale(scale).domain(domain).colors(items.length);
  }

  renderLegend() {
    const { legendOpen } = this.state;
    if (!this.activeLayers) {
      return null;
    }

    return (
      <StyledLegend>
        <StyledLegendToggle
          role="button"
          type="button"
          legendOpen={legendOpen}
          onClick={() => this.setState({ legendOpen: !legendOpen })}
        >
          <CloseIcon />
        </StyledLegendToggle>
        <StyledLegendLayerWrapper>
          {legendOpen &&
            this.activeLayers.map((lg, i) => (
              <StyledLegendConfig key={`${lg.name}-${i}`}>
                <StyledLegendTitle>{lg.name}</StyledLegendTitle>

                {lg.legendConfig.type === "gradient" && (
                  <React.Fragment>
                    <StyledGradient
                      items={this.generateGradient(lg.legendConfig.items)}
                    />
                    <StyledGradientUnits>
                      {lg.legendConfig.items.map((lc, i) => {
                        return (
                          <StyledLegendConfigItem
                            key={`${lc.name}-gratient-unit-${i}`}
                          >
                            {lc.value}
                          </StyledLegendConfigItem>
                        );
                      })}
                    </StyledGradientUnits>
                    <StyledLegendConfigItem>
                      {lg.legendConfig.unit}
                    </StyledLegendConfigItem>
                  </React.Fragment>
                )}

                {lg.legendConfig.type === "choropleth" &&
                  lg.legendConfig.items.map((lc, i) => {
                    return (
                      <StyledLegendConfigItem
                        key={`${lc.name}-config-item-${i}`}
                      >
                        <StyledConfigItemColor hexCode={lc.color} />
                        {lc.name}
                      </StyledLegendConfigItem>
                    );
                  })}
              </StyledLegendConfig>
            ))}
          {!legendOpen && <StyledClosedLegend>Legend</StyledClosedLegend>}
        </StyledLegendLayerWrapper>
      </StyledLegend>
    );
  }

  render() {
    const { caption = null, thumbnail = false } = this.props;
    return (
      <StyledMapContainer>
        {caption && <StyledCaption>{caption}</StyledCaption>}
        {!thumbnail && this.renderLegend()}
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

export default redux.connectState(
  (state) => ({
    configuration: state.configuration,
  }),
  { patchConfiguration }
)(Map);
