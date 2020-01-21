import { Adapter, Payloads } from "@packages/types";

import { DatasetService, WidgetService } from "@packages/core";

import ConfigHelper from "./helpers/config";

export default class RwAdapter implements Adapter {
  endpoint = "https://api.resourcewatch.org/v1";

  config = null;
  datasetService = null;
  widgetService = null;
  datasetId = null;

  constructor(params: object | {}, datasetId: string) {
    console.log('RW adapter', params);
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

  async getFields() {
    const url = `${this.endpoint}/fields/${this.datasetId}`;

    const { fields } = await this.datasetService.fetchData(url);
    return fields;
  }

  async getWidget(dataset: Payloads.Dataset) {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata";

    const widgetId = this.widgetService.fromDataset(dataset).id;
    const url = `${this.endpoint}/widget/${widgetId}?${applications.join(
      ","
    )}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`;

    const { data: widget } = await this.widgetService.fetchWidget(url);

    return widget;
  }

  async getWidgetData(dataset: Payloads.Dataset, widget: Payloads.Widget) {
    const sql = this.widgetService.getDataSqlQuery(dataset, widget);

    const url = `${this.endpoint}/query/${this.datasetId}?sql=${sql}`;

    const { data } = await this.widgetService.fetchWidgetData(url);
    return data;
  }

  async getLayers() {
    const { applications, env, locale } = this.config.getConfig();

    const url = `${this.endpoint}/dataset/${
      this.datasetId
    }/layer?app=${applications.join(",")}&env=${env}&page[size]=9999`;

    const { data } = await this.datasetService.fetchData(url);

    return data;
  }
}
