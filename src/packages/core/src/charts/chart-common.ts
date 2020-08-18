import { Vega } from "@widget-editor/types";
import { getLocalCache } from "@widget-editor/widget-editor/lib/exposed-hooks"
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";

export default class ChartCommon {
  protected schema: Vega.Schema;

  constructor(protected store: any) { }

  isDate() {
    const { configuration } = this.store;
    return configuration.category?.type === 'date';
  }

  resolveName(axis: 'x' | 'y' | 'color') {
    const { configuration, editor } = this.store;
    const { xAxisTitle, yAxisTitle } = configuration;

    if (axis === 'x' && xAxisTitle) {
      return xAxisTitle;
    }

    if (axis === 'y' && yAxisTitle) {
      return yAxisTitle;
    }

    let fieldIdentifier;
    if (axis === 'x') {
      fieldIdentifier = 'category';
    } else if (axis === 'y') {
      fieldIdentifier = 'value';
    } else {
      fieldIdentifier = 'color';
    }

    const fieldName = configuration[fieldIdentifier]?.name;
    const field = editor.fields?.find(f => f.columnName === fieldName);

    const name = field?.metadata?.alias
      ? field.metadata.alias
      : fieldName;

    if (axis === 'y' && configuration.aggregateFunction) {
      return `${name} (${configuration.aggregateFunction})`;
    }

    return name;
  }

  resolveFormat(axis: 'x' | 'y') {
    const { configuration, editor: { widgetData } } = this.store;

    // The Y axis is 100% determined by the format the user choose in the UI
    if (axis === 'y') {
      return configuration.format || 's';
    }

    // The X axis' format depends on the type of the column
    if (configuration.category?.type === 'date') {
      const timestamps = widgetData.map((d: any) => +(new Date(d.x)));

      const min = Math.min(...timestamps);
      const max = Math.max(...timestamps);

      // If some of the dates couldn't be parsed, we return null
      if (Number.isNaN(min) || Number.isNaN(max)) {
        return null;
      }

      // Number of milliseconds in a...
      const day = 1000 * 60 * 60 * 24;
      const month = 31 * day;
      const year = 12 * month;

      if (max - min <= 2 * day) {
        return '%H:%M'; // ex: 10:00
      } else if (max - min <= 2 * month) {
        return '%d %b'; // ex: 20 Jul
      } else if (max - min <= 2 * year) {
        return '%b %Y'; // ex: Jul 2017
      }

      return '%Y'; // ex: 2017
    } else if (configuration.category?.type === 'number') {
      const allIntegers = widgetData.length
        && widgetData.every((d: any) => parseInt(d.x, 10) === d.x);
      if (allIntegers) {
        return 'd';
      }
    }

    return '.2f';
  }

  resolveScheme() {
    const scheme = selectScheme(this.store);
    return getLocalCache().adapter.getSerializedScheme(scheme);
  }

  async resolveSignals(): Promise<any[]> {
    return [];
  }
}

