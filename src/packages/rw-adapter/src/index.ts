import "isomorphic-fetch";

import { Adapter } from "@packages/types";

import { DatasetService } from "@packages/core";

import ConfigHelper from "./helpers/config";

export default class RwAdapter implements Adapter {
  config = null;
  endpoint = "https://api.resourcewatch.org/v1/";
  datasetService = null;
  constructor(params: object | {}, datasetId: string) {
    this.config = ConfigHelper(params);
    this.datasetService = new DatasetService(datasetId, this.config);
  }
  async getDataset(datasetId: string) {
    return await this.datasetService.getDataset(datasetId);
  }
  getWidget(widgetId: string) {
    return null;
  }
}
