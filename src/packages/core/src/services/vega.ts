import { Charts, Vega } from "@widget-editor/types";

import Pie from "../charts/pie";
import Bars from "../charts/bars";
import GroupedBars from "../charts/bars-grouped";
import BarsStacked from "../charts/bars-stacked";
import BarsHorizontal from "../charts/bars-horizontal";
import GroupedBarsHorizontal from "../charts/bars-grouped-horizontal";
import BarsStackedHorizontal from "../charts/bars-stacked-horizontal";
import Line from "../charts/line";
import MultiLine from "../charts/line-multi";
import Scatter from "../charts/scatter";

import { SUPPORTED_CHARTS } from "../charts/constants";
import { defaultVegaSchema } from "../helpers/wiget-helper/constants";

export default class VegaService implements Charts.Service {
  private schema: Vega.Schema = defaultVegaSchema();

  constructor(private store: any) { }

  async resolveChart() {
    const { configuration } = this.store;
    const { chartType } = configuration;

    let Chart;
    switch (chartType) {
      case "pie":
      case "donut":
        Chart = Pie;
        break;

      case "bar-horizontal":
        Chart = configuration.color?.name ? GroupedBarsHorizontal : BarsHorizontal;
        break;

      case "stacked-bar-horizontal":
        Chart = configuration.color?.name ? BarsStackedHorizontal : BarsHorizontal;
        break;

      case "bar":
        Chart = configuration.color?.name ? GroupedBars : Bars;
        break;

      case "stacked-bar":
        Chart = configuration.color?.name ? BarsStacked : Bars;
        break;

      case "line":
        Chart = configuration.color?.name ? MultiLine : Line;
        break;

      case "scatter":
        Chart = Scatter;
        break;

      default:
        throw new Error(
          `Chart of type: ${chartType} is not supported. we support: (${SUPPORTED_CHARTS.join(
            "|"
          )})`
        );
    }

    const chart = await new Chart(this.store).getChart();

    this.schema = {
      ...this.schema,
      ...chart,
    };
  }

  setConfig() {
    const { widgetConfig } = this.store;

    this.schema = {
      ...this.schema,
      config: {
        ...this.schema.config,
        ...(widgetConfig?.config ?? {}),
      },
    };
  }

  async getChart() {
    this.setConfig();
    await this.resolveChart();
    return this.schema;
  }
}
