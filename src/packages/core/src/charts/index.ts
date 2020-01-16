import { Charts, WidgetHelpers } from "@packages/types";

export default class ChartService implements Charts.Service {
  constructor(config: WidgetHelpers.Schema) {
    console.log("parse me!", config);
  }
}
