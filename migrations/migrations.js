require = require('esm')(module); // eslint-disable-line no-global-assign

// Please sort the migrations by their version number (DESC)
module.exports = [
  {
    version: '2.3.0',
    description: 'Update the line charts to support v1\'s way of handling the tooltip',
    needsMigration(widget) {
      const { widgetConfig } = widget.attributes;
      if (!widgetConfig) {
        return false;
      }

      const { we_meta, paramsConfig } = widgetConfig;
      if (we_meta && paramsConfig && paramsConfig.chartType === 'line') {
        return true;
      }

      return false;
    },
    migrate(widget) {
      // TODO
      const { widgetConfig } = widget.attributes;
      return {
        ...widget,
        attributes: {
          ...widget.attributes,
          widgetConfig: {
            ...widgetConfig,
          }
        }
      };
    }
  },
];
