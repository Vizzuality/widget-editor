import { Vega, Generic } from "@widget-editor/types";

export default class ChartCommon {
  wConfig: any;
  wData: Generic.ObjectPayload = [];
  schema: Vega.Schema;

  constructor(widgetConfig: any, widgetData: Generic.ObjectPayload) {
    this.wConfig = widgetConfig;
    this.wData = widgetData || [];
  }

  isDate() {
    return this.wConfig?.paramsConfig?.category?.type === 'date';
  }

  resolveFormat(axis: 'x' | 'y') {
    // The Y axis is 100% determined by the format the user choose in the UI
    if (axis === 'y') {
      return this.wConfig?.paramsConfig?.format || 's';
    }

    // The X axis' format depends on the type of the column
    if (this.wConfig?.paramsConfig?.category?.type === 'date') {
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
    } else if (this.wConfig?.paramsConfig?.category?.type === 'number') {
      const allIntegers = this.wData.length && this.wData.every((d: any) => parseInt(d.x, 10) === d.x);
      if (allIntegers) {
        return 'd';
      }
    }

    return '.2f';
  }
}

