import { Adapter } from "@packages/types";

import { DatasetService, WidgetService } from "@packages/core";

import ConfigHelper from "./helpers/config";

export default class RwAdapter implements Adapter {
  endpoint = "https://api.resourcewatch.org/v1";

  config = null;
  datasetService = null;
  widgetService = null;
  datasetId = null;

  constructor(params: object | {}, datasetId: string) {
    this.config = ConfigHelper(params);
    this.datasetId = datasetId;
    this.datasetService = new DatasetService(this.config);
    this.widgetService = new WidgetService(this.config);
  }

  async getDataset() {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata,vocabulary,widget,layer";

    const url = `${this.endpoint}/dataset/${this.datasetId}?${applications.join(
      ","
    )}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`;

    const { data: dataset } = await this.datasetService.fetchData(url);
    return dataset;
  }

  async getWidget(widgetId: string | number) {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata";

    const url = `${this.endpoint}/widget/${widgetId}?${applications.join(
      ","
    )}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`;

    const { data: widget } = await this.widgetService.fetchWidget(url);

    return widget;
  }

  // TODO: pass redux state into this function
  // Then we can restore and verify state is up to date
  async resolveAdapterState() {
    // Step 1: Get dataset and widgets
    const dataset = await this.getDataset();
    const widget = await this.getWidget(
      this.widgetService.fromDataset(dataset).id
    );

    // Step 2: Fetch layers and fields

    return {
      dataset,
      widget
    };
  }
}
