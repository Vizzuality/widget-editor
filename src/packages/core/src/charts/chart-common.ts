import { Vega, Generic } from "@widget-editor/types";
import { getLocalCache } from "@widget-editor/widget-editor/lib/exposed-hooks"

export default class ChartCommon {
  configuration: any;
  editor: any;
  wData: Generic.ObjectPayload = [];
  schema: Vega.Schema;
  scheme: any;

  constructor(configuration: any, editor: any, widgetData: Generic.ObjectPayload, scheme: any) {
    this.configuration = configuration;
    this.editor = editor;
    this.wData = widgetData || [];
    this.scheme = scheme;
  }

  isDate() {
    return this.configuration.category?.type === 'date';
  }

  resolveName(axis: 'x' | 'y' | 'color') {
    const { xAxisTitle, yAxisTitle } = this.configuration;

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

    const fieldName = this.configuration[fieldIdentifier]?.name;
    const field = this.editor.fields?.find(f => f.columnName === fieldName);

    const name = field?.metadata?.alias
      ? field.metadata.alias
      : fieldName;

    if (axis === 'y' && this.configuration.aggregateFunction) {
      return `${name} (${this.configuration.aggregateFunction})`;
    }

    return name;
  }

  resolveFormat(axis: 'x' | 'y') {
    // The Y axis is 100% determined by the format the user choose in the UI
    if (axis === 'y') {
      return this.configuration.format || 's';
    }

    // The X axis' format depends on the type of the column
    if (this.configuration.category?.type === 'date') {
      const timestamps = this.wData.map((d: any) => +(new Date(d.x)));

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
    } else if (this.configuration.category?.type === 'number') {
      const allIntegers = this.wData.length && this.wData.every((d: any) => parseInt(d.x, 10) === d.x);
      if (allIntegers) {
        return 'd';
      }
    }

    return '.2f';
  }

  resolveScheme() {
    return getLocalCache().adapter.getSerializedScheme(this.scheme);
  }
}

