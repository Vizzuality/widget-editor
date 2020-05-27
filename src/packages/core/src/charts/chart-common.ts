import { Vega } from "@widget-editor/types";

export default class ChartCommon {
  wConfig: any;
  schema: Vega.Schema;
  constructor(widgetConfig: any) {
    this.wConfig = widgetConfig;
  }
  isDate() {
    return this.wConfig?.paramsConfig?.category?.type === 'date';
  }
  resolveFormat() {
    const format = this.wConfig?.paramsConfig?.format || "s";
    return format;
  }
}

