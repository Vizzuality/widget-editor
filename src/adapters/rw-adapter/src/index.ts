import axios from 'axios';
import { Adapter, Dataset, Widget, Config, Filters, Generic } from "@widget-editor/types";
import { getEditorMeta, tags } from "@widget-editor/shared";

import {
  DatasetService,
  WidgetService,
  FiltersService,
} from "@widget-editor/core";

import { SerializedFilter } from './types';
import defaultWidget from "./default-widget";

import ConfigHelper from "./helpers/config";

export default class RwAdapter implements Adapter.Service {
  endpoint = "https://api.resourcewatch.org/v1";
  dataEndpoint = "https://api.resourcewatch.org/v1/query";

  config = null;
  datasetService = null;
  widgetService = null;
  datasetId = null;
  tableName = null;
  AUTH_TOKEN = null;
  SQL_STRING = null;
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
    const cancelToken =  new axios.CancelToken(function executor(source) {
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
      return {
        ...defaultWidget,
        attributes: {
          ...defaultWidget.attributes,
          dataset: dataset.id,
          widgetConfig: this.handleDefaultWidgetConf(dataset),
        },
      };
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

  // Triggered when widget is atempting to be saved
  handleSave(consumerOnSave, dataService, application = "rw", editorState) {
    const {
      configuration,
      widget,
      editor,
      filters: { list: editorFilters },
    } = editorState;
    const {
      dataset: {
        id,
        attributes: { tableName },
      },
    } = dataService;

    this.setDatasetId(id);
    this.setTableName(tableName);

    let vegaConfiguration = widget;
    let output = {};

    if (editorState.configuration.visualizationType !== "map") {
      output = {
        paramsConfig: {
          visualizationType: editorState.configuration.visualizationType,
          limit: editorState.configuration.limit || 50,
          value: editorState.configuration.value || null,
          category: editorState.configuration.category || null,
          color: editorState.configuration.color,
          size: editorState.configuration.size,
          orderBy: editorState.configuration.orderBy,
          aggregateFunction: editorState.configuration.aggregateFunction,
          chartType: editorState.configuration.chartType,
          filters: this.getSerializedFilters(editorFilters ?? []),
          areaIntersection: editorState.configuration.areaIntersection,
          band: editorState.configuration.band,
          donutRadius: editorState.configuration.donutRadius,
          sliceCount: editorState.configuration.sliceCount,
          layer: null
        },
        data: vegaConfiguration.data.map(d => {
          if (d.name === 'table') {
            return {
              name: 'table',
              transform: d.transform,
              format: {
                type: 'json',
                property: 'data',
              },
              url: this.getDataUrl()
            }
          }
          return d;
        }),
        scales: vegaConfiguration.scales,
        axes: vegaConfiguration.axes,
        marks: vegaConfiguration.marks,
        interaction_config: vegaConfiguration.interaction_config,
        config: vegaConfiguration.config,
        legend: vegaConfiguration.legend ?? null,
      };

    }

    if (editorState.configuration.visualizationType === "map") {
      output = {
        type: 'map',
        layer_id: editorState.configuration.layer,
        zoom: editorState.editor.map?.zoom,
        lat: editorState.editor.map?.lat,
        lng: editorState.editor.map?.lng,
        bounds: editorState.editor.map?.bounds,
        bbox: editorState.editor.map?.bbox,
        ...(editorState.configuration.map.basemap
          ? {
            basemapLayers: {
              basemap: editorState.configuration.map.basemap.basemap,
              labels: editorState.configuration.map?.basemap?.labels || null,
              boundaries: editorState.configuration.map?.basemap?.boundaries || false,
            },
          }
          : {}
        ),
        paramsConfig: {
          visualizationType: editorState.configuration.visualizationType,
          layer: editorState.configuration.layer,
        },
        config: vegaConfiguration.config
      };
    }

    const out = {
      id: editorState?.editor?.widget?.id || null,
      type: "widget",
      attributes: {
        name: configuration.title || null,
        dataset: editor.dataset.id || null,
        description: configuration.description || null,
        application: [application],
        widgetConfig: {
          we_meta: {
            ...getEditorMeta("rw-adapter", editorState.editor.advanced || false),
          },
          ...output,
        },
      }
    };

    consumerOnSave(out);
  }

  getDataUrl() {
    return tags.oneLineTrim`
      https://api.resourcewatch.org/v1/query/
      ${this.datasetId}?
      sql=${this.SQL_STRING}
    `
  }

  async requestData({ configuration, filters, dataset }) {
    const adapterInstance = this;
    const filtersService = new FiltersService(configuration, filters, dataset, adapterInstance);
    this.SQL_STRING = filtersService.getQuery();
    const response = await this.prepareRequest(this.getDataUrl())
    return response.data;
  }

  /**
   * Serialize the editor's filters for the widgetConfig
   * @param filters Filters
   */
  private getSerializedFilters(filters: Filters.Filter[]): SerializedFilter[] {
    const getSerializedValue = ({ type, value }) => {
      if (type === 'date') {
        if (Array.isArray(value)) {
          return value.map(date => date.toISOString());
        }

        return value.toISOString();
      }

      return value;
    }

    return filters
      .filter(filter => filter.value !== undefined && filter.value !== null)
      .map(filter => ({
        name: filter.column,
        type: filter.type,
        operation: filter.operation,
        value: getSerializedValue(filter),
        notNull: filter.notNull,
      }));
  }

  /**
   * Deserialize the filters for for the widget-editor's application
   * @param filters Serialized filters
   * @param fields Dataset's fields
   * @param dataset Dataset object
   */
  async getDeserializedFilters(
    filters: SerializedFilter[],
    fields: Generic.Array,
    dataset: Dataset.Payload
  ): Promise<Filters.Filter[]> {
    if (!filters || !Array.isArray(filters) || filters.length === 0) {
      return [];
    }

    return await FiltersService.getDeserializedFilters(filters, fields, dataset);
  }
}
