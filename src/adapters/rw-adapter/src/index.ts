import { Adapter, Dataset, Widget, Config } from "@widget-editor/types";
import { getEditorMeta, tags } from "@widget-editor/shared";

import {
  DatasetService,
  WidgetService,
  FiltersService,
} from "@widget-editor/core";

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
  // Some generic setup for
  applications = ["rw"];
  env = "production";
  locale = "en";

  constructor() {
    const asConfig: Config.Payload = {
      applications: this.applications,
      env: this.env,
      locale: this.locale,
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
    const includes = "metadata,vocabulary,widget,layer";

    const url = tags.oneLineTrim`
      ${this.endpoint}
      /dataset/
      ${this.datasetId}?
      ${applications.join(",")}
      &env=${env}
      &language=${locale}
      &includes=${includes}
      &page[size]=999
    `;

    const { data: dataset } = await this.datasetService.fetchData(url);

    this.tableName = dataset?.attributes?.tableName || null;

    // -- Serialize widgets
    // -- We dont want to expose widgets where { published: true }
    // -- These are user created widgets

    const serializeDataset = {
      ...dataset,
      attributes: {
        ...dataset.attributes,
        widget: dataset.attributes.widget.filter(
          (w) => !!w.attributes.published
        ),
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

  async getWidget(dataset: Dataset.Payload, widgetId: Widget.Id) {
    const { applications, env, locale } = this.config.getConfig();
    const includes = "metadata";

    const resolveWidgetId = !widgetId
      ? this.widgetService.fromDataset(dataset)?.id
      : widgetId;

    if (!resolveWidgetId) {
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
      ${resolveWidgetId}?
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

    let widgetConfig = widget;
    if (widgetConfig) {
      delete widgetConfig.$schema;
      delete widgetConfig.signals;
      delete widgetConfig.autosize;
    
      widgetConfig.paramsConfig = {
        visualizationType: editorState.configuration.visualizationType,
        caption: editorState.configuration.caption || null,
        chartType: editorState.configuration.chartType,
        value: editorState.configuration.value || null,
        category: editorState.configuration.category || null,
        limit: editorState.configuration.limit || 50,
        slizeCount: editorState.configuration.slizeCount,
        donutRadius: editorState.configuration.donutRadius,
        color: editorState.configuration.color,
        size: editorState.configuration.size,
        orderBy: editorState.configuration.orderBy,
        aggregateFunction: editorState.configuration.aggregateFunction,
        areaIntersection: editorState.configuration.areaIntersection,
        band: editorState.configuration.band,
        ...(editorState.configuration.visualizationType !== "map"
          ? { filters: this.filterSerializer(editorFilters) }
          : { filters: [] }),
        ...widgetConfig,
      };

      if (editorState.configuration.visualizationType === "map") {
        widgetConfig = {
          paramsConfig: {
            caption: editorState.configuration.caption || null,
            value: null,
            category: null,
            color: null,
            orderBy: null,
            aggregateFunction: null,
            areaIntersection: null,
            band: null,
            visualizationType: editorState.configuration.visualizationType,
            chartType: editorState.configuration.chartType,
            layer: editorState.configuration.layer,
          },
          ...(editorState.configuration.map.basemap
            ? {
                basemap: {
                  basemap: editorState.configuration.map.basemap.basemap,
                  labels: editorState.configuration.map.basemap.labels,
                  boundaries: false,
                },
              }
            : {
                basemap: {
                  basemap: "dark",
                  labels: "Dark",
                  boundaries: false,
                },
              }),
          zoom: editorState.configuration.map.zoom,
          lat: editorState.configuration.map.lat,
          lng: editorState.configuration.map.lng,
          bounds: editorState.configuration.map.bounds,
          bbox: editorState.configuration.map.bbox,
        };
      }
      
    }
    if (editorState.editor.advanced) {
      delete widgetConfig.paramsConfig;
    }

    const out = {
      id: editorState?.editor?.widget?.id || null,
      type: "widget",
      name: configuration.title || null,
      description: configuration.description || null,
      application: [application],
      widgetConfig: {
        we_meta: {
          ...getEditorMeta("rw-adapter", editorState.editor.advanced || false),
        },
        ...widgetConfig,
      },
    };

    consumerOnSave(out);
  }

  // Called when filters are updated
  // Its up to the adapter to serialize these in a format the api wants
  filterSerializer(filters: any) {
    const serialize = filters.map((filter) => ({
      value:
        filter.indicator === "FILTER_ON_VALUES"
          ? filter.filter.values.map((v) => v.value)
          : filter.filter.values,
      type: filter.dataType,
      name: filter.column,
      datasetID: this.datasetId,
      tableName: this.tableName,
      alias: filter.column, // TODO: Fix me
    }));

    // If any of these props are empty, dont apply the filter
    const REQUIRED_PROPS = ["value", "type", "datasetID", "tableName"];

    const validateProperty = (prop) => {
      if (Array.isArray(prop) && prop.length === 0) {
        return false;
      }
      if (typeof prop === "string" && prop.length === 0) {
        return false;
      }
      return prop === null ? false : true;
    };

    return serialize.filter(
      (f) =>
        [...REQUIRED_PROPS].filter((prop) => validateProperty(f[prop]))
          .length === REQUIRED_PROPS.length
    );
  }

  async requestData(sql: string, dataset: Dataset.Payload) {
    const response = await fetch(
      tags.oneLineTrim`
        https://api.resourcewatch.org/v1/query/
        ${dataset.id}?
        sql=${sql}
      `
    );
    const data = await response.json();
    return data;
  }

  async filterUpdate(
    filters: any,
    fields: any,
    widget: Widget.Payload,
    dataset: Dataset.Payload
  ) {
    if (!filters || !Array.isArray(filters) || filters.length === 0) {
      return [];
    }

    const {
      attributes: { name, description, widgetConfig },
    } = widget;

    const configuration = {
      ...widgetConfig.paramsConfig,
      title: name,
      caption: description,
    };

    const out = await FiltersService.handleFilters(
      filters,
      {
        column: "name",
        values: "value",
        type: "type",
      },
      { configuration, dataset, fields, widget }
    );

    return out;
  }
}
