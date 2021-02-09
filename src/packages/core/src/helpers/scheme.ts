import { Widget } from "@widget-editor/types";
import getDefaultTheme from "../charts/theme";

/**
 * Return the serialized scheme (`config` object)
 * @param scheme Scheme used by the widget
 */
export const getSerializedScheme = (scheme: Widget.Scheme): Widget.SerializedScheme => {
  return {
    ...getDefaultTheme(),
    name: scheme.name,
    range: Object.assign({}, getDefaultTheme().range, {
      category20: scheme.category
    }),
    mark: Object.assign({}, getDefaultTheme().mark, {
      fill: scheme.mainColor
    }),
    symbol: Object.assign({}, getDefaultTheme().symbol, {
      fill: scheme.mainColor
    }),
    rect: Object.assign({}, getDefaultTheme().rect, {
      fill: scheme.mainColor
    }),
    line: Object.assign({}, getDefaultTheme().line, {
      stroke: scheme.mainColor
    })
  };
};

/**
 * Return the scheme from the `config` object
 * @param config config object of the widget
 */
export const getDeserializedScheme = (config: Widget.SerializedScheme): Widget.Scheme => {
  if (!config?.range?.category20 || config.range.category20.length === 0) {
    return null;
  }

  return {
    name: config.name ?? 'user-custom',
    mainColor: config.range.category20[0],
    category: config.range.category20,
  };
};
