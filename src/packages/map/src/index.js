import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';
import WebMercatorViewport from '@math.gl/web-mercator';
import isEqual from 'react-fast-compare';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import LayerManager from './layer-manager';

const StyledMap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

import {
  DEFAULT_VIEWPORT
} from './constants';

class Map extends PureComponent {
  static propTypes = {
    /** A function that returns the map instance */
    children: PropTypes.func,

    /** Custom CSS class for styling */
    className: PropTypes.string,

    style: PropTypes.shape({}),

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
    */
    viewport: PropTypes.shape({}),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({}),
    }),

    map: PropTypes.shape({
      MAPSTYLES: PropTypes.string,
      VIEWPORT: PropTypes.object,
      providers: PropTypes.object,
      mapboxToken: PropTypes.string
    }),

    /** Providers passed into widget editor, used for layer manager */
    providers: PropTypes.object,

    /** An object that defines how fitting bounds behaves */
    fitBoundsOptions: PropTypes.object,

    /** A string that defines the basemap to display */
    basemap: PropTypes.string,

    /** A string that defines the type of label to display */
    labels: PropTypes.string,

    /** A string that defines if boundaries should be displayed */
    boundaries: PropTypes.bool,

    /** A boolean that allows panning */
    dragPan: PropTypes.bool,

    /** A boolean that allows rotating */
    dragRotate: PropTypes.bool,

    /** A boolean that allows zooming */
    scrollZoom: PropTypes.bool,

    /** A boolean that allows zooming */
    touchZoom: PropTypes.bool,

    /** A boolean that allows touch rotating */
    touchRotate: PropTypes.bool,

    /** A boolean that allows double click zooming */
    doubleClickZoom: PropTypes.bool,

    /** A function that exposes when the map is loaded.
     * It returns and object with the `this.map` and `this.mapContainer`
     * reference. */
    onLoad: PropTypes.func,

    /** function invoked if something is wrong */
    onError: PropTypes.func,

    /** A function that exposes the viewport */
    onViewportChange: PropTypes.func,

    /** A function that exposes the viewport when the map fits bounds */
    onFitBoundsChange: PropTypes.func,

    /** A function that exposes the viewport */
    getCursor: PropTypes.func,
  }

  static defaultProps = {
    children: null,
    className: null,
    style: {},
    viewport: DEFAULT_VIEWPORT,
    basemap: null,
    bounds: {},
    labels: null,
    boundaries: false,
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    doubleClickZoom: true,
    fitBoundsOptions: { transitionDuration: 1500 },

    onViewportChange: () => {},
    onFitBoundsChange: () => {},
    onLoad: () => {},
    onError: null,
    getCursor: ({ isHovering, isDragging }) => {
      if (isHovering) return 'pointer';
      if (isDragging) return 'grabbing';
      return 'grab';
    },
  }

  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.map.viewport,
    },
    layers: [],
    flying: false,
    loaded: false,
  }

  componentDidMount() {
    const { map } = this.props;

    this.setState({
      viewport: {
        ...DEFAULT_VIEWPORT,
        ...map.VIEWPORT
      }
    })
  }

  componentDidUpdate(prevProps) {

    const {
      viewport: prevViewport,
      bounds: prevBounds,
      boundaries: prevBoundaries,
      layerId: prevLayerId,
      mapConfiguration: prevMapConfiguration
    } = prevProps;

    const {
      viewport,
      bounds,
      boundaries,
      layerId,
      layers,
      mapConfiguration
    } = this.props;

    const { viewport: stateViewport } = this.state;
    const basemapChanged = mapConfiguration.basemap.basemap !== prevMapConfiguration.basemap.basemap;
    const labelsChanged = mapConfiguration.basemap.labels !== prevMapConfiguration.basemap.labels;
    const boundariesChanged = mapConfiguration.basemap.boundaries !== prevMapConfiguration.basemap.boundaries;
    const boundsChanged = !isEqual(bounds, prevBounds);

    if (!isEqual(layerId, prevLayerId) && this.map) {
      const activeLayers = layers.filter(l => l.id === layerId);
      this.setState({
        layers: activeLayers
      })
    }

    if (!isEqual(viewport, prevViewport)) {
      this.setState({ // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport,
        },
      });
    }

    if (basemapChanged && this.map) this.setBasemap();
    if (labelsChanged && this.map) this.setLabels();
    if (boundariesChanged && this.map) this.setBoundaries();
    if (!isEmpty(bounds) && boundsChanged) this.fitBounds();
  }

  onLoad = () => {
    const { onLoad, bounds } = this.props;
    this.setState({ loaded: true });

    this.setBasemap();
    this.setLabels();
    this.setBoundaries();

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds();
    }

    onLoad({
      map: this.map,
      mapContainer: this.mapContainer.current,
    });
  }

  onViewportChange = (_viewport) => {
    const { onViewportChange } = this.props;

    this.setState({ viewport: _viewport },
      () => { onViewportChange(_viewport); });
  }

  onResize = (_viewport) => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const newViewport = {
      ...viewport,
      ..._viewport,
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  }

  setBasemap = () => {
    const { basemap } = this.props.mapConfiguration.basemap;
    const BASEMAP_GROUPS = ['basemap'];
    const { layers, metadata } = this.map.getStyle();
    
    const basemapGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];

      const matchedGroups = BASEMAP_GROUPS.map((rgr) => name.toLowerCase().includes(rgr));

      return matchedGroups.some((bool) => bool);
    });

    const basemapsWithMeta = basemapGroups.map((groupId) => ({
      ...metadata['mapbox:groups'][groupId],
      id: groupId,
    }));
    
    const basemapToDisplay = basemapsWithMeta.find((_basemap) => _basemap.name.includes(basemap));

    const basemapLayers = layers.filter((l) => {
      const { metadata: layerMetadata } = l;
      if (!layerMetadata) return false;

      const gr = layerMetadata['mapbox:group'];
      return basemapGroups.includes(gr);
    });

    basemapLayers.forEach((_layer) => {
      const match = _layer.metadata['mapbox:group'] === basemapToDisplay.id;
      if (!match) {
        this.map.setLayoutProperty(_layer.id, 'visibility', 'none');
      } else {
        this.map.setLayoutProperty(_layer.id, 'visibility', 'visible');
      }
    });
  }

  setLabels = () => {
    const { labels } = this.props.mapConfiguration.basemap;

    const LABELS_GROUP = ['labels'];
    const { layers, metadata } = this.map.getStyle();

    const labelGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];

      const matchedGroups = LABELS_GROUP.filter((rgr) => name.toLowerCase().includes(rgr));

      return matchedGroups.some((bool) => bool);
    });

    const labelsWithMeta = labelGroups.map((_groupId) => ({
      ...metadata['mapbox:groups'][_groupId],
      id: _groupId,
    }));
    const labelsToDisplay = labelsWithMeta.find((_basemap) => _basemap.name.includes(labels)) || {};

    const labelLayers = layers.filter((l) => {
      const { metadata: layerMetadata } = l;
      if (!layerMetadata) return false;

      const gr = layerMetadata['mapbox:group'];
      return labelGroups.includes(gr);
    });

    labelLayers.forEach((_layer) => {
      const match = _layer.metadata['mapbox:group'] === labelsToDisplay.id;
      this.map.setLayoutProperty(_layer.id, 'visibility', match ? 'visible' : 'none');
    });

    return true;
  }

  setBoundaries = () => {
    const { boundaries } = this.props.mapConfiguration.basemap;

    const LABELS_GROUP = ['boundaries'];
    const { layers, metadata } = this.map.getStyle();

    const boundariesGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];

      const labelsGroup = LABELS_GROUP.map((rgr) => name.toLowerCase().includes(rgr));

      return labelsGroup.some((bool) => bool);
    });

    const boundariesLayers = layers.filter((l) => {
      const { metadata: layerMetadata } = l;
      if (!layerMetadata) return false;

      const gr = layerMetadata['mapbox:group'];
      return boundariesGroups.includes(gr);
    });

    boundariesLayers.forEach((l) => {
      this.map.setLayoutProperty(l.id, 'visibility', boundaries ? 'visible' : 'none');
    });
  }

  map = createRef();

  mapContainer = createRef();

  fitBounds = () => {
    const { viewport: currentViewport } = this.state;
    const {
      bounds,
      onViewportChange,
      onFitBoundsChange,
      fitBoundsOptions,
      onError,
    } = this.props;
    const { bbox, options } = bounds;

    const viewport = {
      width: this.mapContainer.current.offsetWidth,
      height: this.mapContainer.current.offsetHeight,
      ...currentViewport,
    };

    try {
      const { longitude, latitude, zoom } = new WebMercatorViewport(viewport).fitBounds(
        [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
        options,
      );

      const newViewport = {
        ...currentViewport,
        longitude,
        latitude,
        zoom,
        ...fitBoundsOptions,
      };

      this.setState({
        flying: true,
        viewport: newViewport,
      });

      onFitBoundsChange(newViewport);
      onViewportChange(newViewport);
    } catch (e) {
      if (onError) onError('There was an error fitting bounds. Please, check your bbox values.');
    }

    window.setTimeout(() => {
      this.setState({ flying: false });
    }, currentViewport.transitionDuration || 0);
  };

  render() {
    const {
      className,
      style,
      children,
      getCursor,
      dragPan,
      dragRotate,
      scrollZoom,
      touchZoom,
      touchRotate,
      doubleClickZoom,
      disableEventsOnFly,
      onError,
      map,
      ...mapboxProps
    } = this.props;
    const { viewport, flying, loaded, layers } = this.state;

    return (
      <StyledMap
        ref={this.mapContainer}
      >
        <ReactMapGL
          ref={(_map) => {
            if (_map) this.map = _map.getMap();
          }}
          mapboxApiAccessToken={map.mapboxToken}
          mapStyle={map.MAPSTYLES}
          // CUSTOM PROPS FROM REACT MAPBOX API
          {...mapboxProps}
          // VIEWPORT
          {...viewport}
          width="100%"
          height="100%"
          // INTERACTIVE
          dragPan={!flying && dragPan}
          dragRotate={!flying && dragRotate}
          scrollZoom={!flying && scrollZoom}
          touchZoom={!flying && touchZoom}
          touchRotate={!flying && touchRotate}
          doubleClickZoom={!flying && doubleClickZoom}
          getCursor={getCursor}
          // DEFAULT FUC IMPLEMENTATIONS
          onViewportChange={this.onViewportChange}
          onResize={this.onResize}
          onLoad={this.onLoad}

          transitionInterpolator={new FlyToInterpolator()}
        >
          {loaded && !!this.map && <LayerManager 
            map={this.map}
            providers={map.providers}
            layers={layers}
          />}
          {loaded && !!this.map && typeof children === 'function' && children(this.map.current.getMap())}
        </ReactMapGL>
      </StyledMap>
    );
  }
}

export default Map;
