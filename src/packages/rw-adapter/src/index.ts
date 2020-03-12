import { Adapter, Dataset, Widget, Config } from "@packages/types";

import { DatasetService, WidgetService, FiltersService } from "@packages/core";

import ConfigHelper from "./helpers/config";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default class RwAdapter implements Adapter.Service {
  endpoint = "https://api.resourcewatch.org/v1";

  config = null;
  datasetService = null;
  widgetService = null;
  datasetId = null;
  AUTH_TOKEN = null;

  // Some generic setup for
  applications = ["rw"];
  env = "production";
  locale = "en";

  // What params are we interested in when saving our widget?
  widget_params = [
    "chartType",
    "visualizationType",
    "limit",
    "value",
    "category",
    "color",
    "size",
    "orderBy",
    "aggregateFunction",
    "filters",
    "areaIntersection",
    "band",
    "layer"
  ];

  constructor() {
    const asConfig: Config.Payload = {
      applications: this.applications,
      env: this.env,
      locale: this.locale
    };

    this.config = ConfigHelper(asConfig);
    this.datasetService = new DatasetService(this.config);
    this.widgetService = new WidgetService(this.config);
  }

  // Used when saving data
  // This will be grabbed and put into onSave on any request
  payload() {
    return {
      applications: this.applications,
      env: this.env
    };
  }

  private async saveWidgetRW() {
    const url = `${this.endpoint}/dataset/${this.datasetId}/widget`;
    if (this.AUTH_TOKEN) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.AUTH_TOKEN}`
          }
        });
        return await response.json();
      } catch (error) {
        console.error("Cant save widget", error);
      }
    } else {
      console.error("Missing auth token for saveWidget (RW)");
    }
  }

  private hasAuthToken() {
    return !!this.AUTH_TOKEN;
  }

  setDatasetId(datasetId: Adapter.datasetId) {
    if (!datasetId) {
      console.error("Error: datasetId is required");
    }
    this.datasetId = datasetId;
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

  async getWidget(dataset: Dataset.Payload) {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata";

    const widgetId = this.widgetService.fromDataset(dataset).id;
    const url = `${this.endpoint}/widget/${widgetId}?${applications.join(
      ","
    )}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`;

    const { data: widget } = await this.widgetService.fetchWidget(url);

    return widget;
  }

  async getWidgetData(dataset: Dataset.Payload, widget: Widget.Payload) {
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

  // This method translates any filters returned from RW to
  // A data structure the editor understands
  // WORK IN PROGRESS
  async handleFilters(filters, fields, widget, datasetId) {
    if (!filters || !Array.isArray(filters) || filters.length === 0) {
      return [];
    }

    const {
      attributes: { name, description, widgetConfig }
    } = widget;

    const configuration = {
      ...widgetConfig.paramsConfig,
      title: name,
      caption: description
    };

    const out = [];

    await asyncForEach(filters, async (filter, index) => {
      if (filter.type === "number" || filter.type === "date") {
        const generateFilter = FiltersService.baseFilter(
          filter.value,
          filter.name,
          filter.type,
          index
        );

        // Patch filter with all their nessesary meta info
        const patch = await FiltersService.patchFilters(
          [generateFilter],
          {
            id: generateFilter.id,
            type: "columns",
            values: generateFilter.filter.values
          },
          configuration,
          datasetId,
          fields
        );

        console.log("PATCHED", patch);

        out.push([...patch]);
      }
    });

    return out;
  }
}
