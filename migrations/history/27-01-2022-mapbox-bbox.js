require = require('esm')(module); // eslint-disable-line no-global-assign

// Please sort the migrations by their version number (DESC)
module.exports = [
  {
    version: '3.0.0',
    description: 'Update map widgets, converting leaflet bbox to mapbox friendly bbox',
    needsMigration(widget) {
      const { widgetConfig } = widget.attributes;
      if (!widgetConfig) {
        return false;
      }

      const { we_meta, paramsConfig } = widgetConfig;
      if (we_meta && paramsConfig?.visualizationType === 'map' && widgetConfig?.bbox) {
        return true;
      }

      return false;
    },
    migrate(widget) {
      const { widgetConfig } = widget.attributes;
      const leafletBBOX = widgetConfig?.bbox;
      const mapboxBBOX = [leafletBBOX[1], leafletBBOX[0], leafletBBOX[3], leafletBBOX[2]]

      return {
        ...widget,
        attributes: {
          ...widget.attributes,
          widgetConfig: {
            ...widgetConfig,
            bbox: mapboxBBOX
          }
        }
      };
    }
  },
];
