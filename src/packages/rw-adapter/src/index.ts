import { Adapter } from "@packages/types";

import { DatasetService } from "@packages/core";

import ConfigHelper from "./helpers/config";

export default class RwAdapter implements Adapter {
  endpoint = "https://api.resourcewatch.org/v1";
  includes = "metadata,vocabulary,widget,layer";

  config = null;
  datasetService = null;
  datasetId = null;

  constructor(params: object | {}, datasetId: string) {
    this.config = ConfigHelper(params);
    this.datasetId = datasetId;
    this.datasetService = new DatasetService(this.config);
  }

  async getDataset() {
    const { applications, env, locale } = this.config.getConfig();
    const url = `${this.endpoint}/dataset/${this.datasetId}?${applications.join(
      ","
    )}&env=${env}&language=${locale}&includes=${this.includes}&page[size]=999`;

    const { data: dataset } = await this.datasetService.fetchData(url);
    return dataset;
  }

  getWidget(widgetId: string) {
    return {
      id: null,
      dataset: null
    };
  }

  async getData() {
    // Step 1 get dataaset
    const dataset = await this.getDataset();
    const widget = this.getWidget(null);

    return {
      dataset,
      widget
    };
  }
}
