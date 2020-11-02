import axios from 'axios';
import { Adapter, Dataset, Widget, Config, Filters, Generic } from "@widget-editor/types";
import { tags } from "@widget-editor/shared";

import {
  DatasetService,
  WidgetService,
  FiltersService,
  getDefaultTheme,
} from "@widget-editor/core";

import ConfigHelper from "./helpers/config";
import { SerializedScheme } from "./types";

export default class RwAdapter implements Adapter.Service {
  endpoint = "https://api.resourcewatch.org/v1";

  /**
   * URL of the widget's raw data
   */
  private dataUrl: string = null;

  config = null;
  datasetService = null;
  widgetService = null;
  datasetId = null;
  tableName = null;
  AUTH_TOKEN = null;
  // Some generic setup for
  applications = ["rw"];
  env = "production";
  locale = "en";
  requestHandler = null;
  requestQue = [];
  isAborting = false;

  constructor() {
    const asConfig: Config.Payload = {
      applications: this.applications,
      env: this.env,
      locale: this.locale,
    };

    this.requestHandler = axios.create();

    this.config = ConfigHelper(asConfig);
    this.datasetService = new DatasetService(this);
    this.widgetService = new WidgetService(this);
  }

  // XXX: If we are using the AdapterModifier hook
  // We need to re-initialize our services with any passed properties
  extendProperties(props: any) {
    Object.keys(props).forEach((prop) => {
      if (this.hasOwnProperty(prop)) {
        this[prop] = props[prop];
      } else {
        throw new Error(
          `Adapter modifier, error ${prop} does not exsist on adapter`
        );
      }
    });
    const asConfig: Config.Payload = {
      applications: this.applications,
      env: this.env,
      locale: this.locale,
    };
    this.config = ConfigHelper(asConfig);
  }

  // Used when saving data
  // This will be grabbed and put into onSave on any request
  payload() {
    return {
      applications: this.applications,
      env: this.env,
    };
  }

  setDatasetId(datasetId: Adapter.datasetId) {
    if (!datasetId) {
      console.error("Error: datasetId is required");
    }
    this.datasetId = datasetId;
  }

  setTableName(tableName: string) {
    if (!tableName) {
      console.error("Error: datasetId is required");
    }
    this.tableName = tableName;
  }

  getName(): string {
    return 'rw-adapter';
  }

  async getDataset() {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata,vocabulary,layer";

    const url = tags.oneLineTrim`
      ${this.endpoint}
      /dataset/
      ${this.datasetId}?
      application=${applications.join(",")}
      &env=${env}
      &language=${locale}
      &includes=${includes}
      &page[size]=999
    `;

    const { data: dataset } = await this.datasetService.fetchData(url);

    if (!dataset) {
      return {};
    }

    this.tableName = dataset?.attributes?.tableName || null;

    // -- Serialize widgets
    // -- We dont want to expose widgets where { published: true }
    // -- These are user created widgets
    const serializeDataset = {
      ...dataset,
      attributes: {
        ...dataset?.attributes,
      },
    };

    return serializeDataset;
  }

  async getFields() {
    const url = tags.oneLineTrim`
      ${this.endpoint}/fields/
      ${this.datasetId}
    `;

    const { fields } = await this.datasetService.fetchData(url);
    return fields;
  }

  handleDefaultWidgetConf(dataset: Dataset.Payload) {
    return {
      paramsConfig: {
        visualizationType: "chart",
        limit: 50,
        orderBy: null,
        aggregateFunction: null,
        chartType: "bar",
        filters: [],
        areaIntersection: null,
        band: null,
        layer: null,
        value: {
          tableName: this.tableName,
          datasetID: dataset.id,
        },
        category: {
          tableName: this.tableName,
          datasetID: dataset.id,
        },
      },
    };
  }

  async abortRequests() {
    this.isAborting = true;
    this.requestQue.forEach(item => {
      item.cancel();
    })
  }

  async prepareRequest(url: string) {
    const self = this;
    if (this.isAborting) {
      return null;
    }
    const cancelToken = new axios.CancelToken(function executor(source) {
      // An executor function receives a cancel function as a parameter
      self.requestQue.push({
        id: url,
        cancel: source
      });
    });

    const response = await this.requestHandler.get(url, {
      cancelToken
    });

    this.requestQue = this.requestQue.filter(q => q.id !== url);

    return response;
  }

  async getWidget(dataset: Dataset.Payload, widgetId: Widget.Id) {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata";

    if (!widgetId) {
      return null;
    }

    const url = tags.oneLineTrim`
      ${this.endpoint}
      /widget/
      ${widgetId}?
      ${applications.join(",")}
      &env=${env}
      &language=${locale}
      &includes=${includes}
      &page[size]=999
    `;

    const { data: widget } = await this.widgetService.fetchWidget(url);

    return widget;
  }

  async getLayers() {
    const { applications, env } = this.config.getConfig();

    const url = tags.oneLineTrim`
      ${this.endpoint}
      /dataset/
      ${this.datasetId}/layer?
      app=${applications.join(",")}
      &env=${env}
      &page[size]=9999
    `;

    const { data } = await this.datasetService.fetchData(url);

    return data;
  }

  async getLayer(layerId) {
    const url = `${this.endpoint}/layer/${layerId}`;
    const { data: { data } } = await this.prepareRequest(url);

    return data;
  }

  /**
   * Return the URL of the tiles of the layer
   * @param layerId ID of the layer
   * @param provider Provider of the layer
   */
  getLayerTileUrl(layerId, provider) {
    // NOTE: this is only implemented for the providers nexgddp and gee
    return `${this.endpoint}/layer/${layerId}/tile/${provider}/{z}/{x}/{y}`;
  }

  /**
   * Return the result of the SQL query run against the dataset
   * @param sql SQL query
   */
  async getDatasetData(sql) {
    const url = `${this.endpoint}/query/${this.datasetId}?sql=${sql}`;
    const { data: { data } } = await this.prepareRequest(url);

    return data;
  }

  /**
   * Return the URL of the widget's raw data
   */
  getDataUrl() {
    return this.dataUrl;
  }

  async requestData(store: any) {
    const filtersService = new FiltersService(store, this);

    // We save the URL of the data so it is exposed by the public method getDataUrl
    // This is the reason why we don't use getDatasetData to fetch the data
    this.dataUrl = `${this.endpoint}/query/${this.datasetId}?sql=${filtersService.getQuery()}${filtersService.getAdditionalParams()}`;
    const { data: { data } } = await this.prepareRequest(this.dataUrl);

    return data
  }

  /**
   * Return the serialized scheme (`config` object)
   * @param scheme Scheme used by the widget
   */
  getSerializedScheme(scheme: Widget.Scheme): SerializedScheme {
    return {
      ...getDefaultTheme(),
      name: scheme.name,
      range: Object.assign({}, getDefaultTheme().range, {
        category20: scheme.category
      }),
      mark: Object.assign({}, getDefaultTheme().mark, {
        fill: scheme.mainColor
      }),
      symbol: Object.assign({}, getDefaultTheme().symbol, {
        fill: scheme.mainColor
      }),
      rect: Object.assign({}, getDefaultTheme().rect, {
        fill: scheme.mainColor
      }),
      line: Object.assign({}, getDefaultTheme().line, {
        stroke: scheme.mainColor
      })
    };
  }

  /**
   * Return the scheme from the `config` object
   * @param config config object of the widget
   */
  getDeserializedScheme(config: SerializedScheme): Widget.Scheme {
    if (!config?.range?.category20 || config.range.category20.length === 0) {
      return null;
    }

    return {
      name: config.name ?? 'user-custom',
      mainColor: config.range.category20[0],
      category: config.range.category20,
    };
  }

  async getPredefinedAreas(): Promise<{ id: string, name: string }[]> {
    const url = `${this.endpoint}/geostore/admin/list`;
    const { data: { data } } = await this.prepareRequest(url);

    return data
      .filter(({ name }) => !!name)
      .map(({ geostoreId: id, name }) => ({
        id,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
