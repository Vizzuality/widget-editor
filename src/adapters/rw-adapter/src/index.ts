import axios, { AxiosResponse } from 'axios';
import { Adapter, Dataset, Widget, Layer } from "@widget-editor/types";
import { tags } from "@widget-editor/shared";
import { APIDatasetPayload, APILayerPayload, APILayersPayload, APILayerDef, APIFieldsPayload, APIGeostorePayload, APIAreaPayload, APIQueryPayload, APIWidgetPayload } from './types';
import { ALLOWED_FIELD_TYPES } from './constants';

export default class RWAdapter implements Adapter.Service {
  private config = {
    endpoint: "https://api.resourcewatch.org/v1",
    env: "production",
    applications: ["rw"],
    locale: "en",
    userToken: undefined,
  };
  private requestsQueue: { id: string, cancel: () => void }[] = [];
  private isAbortingRequests = false;
  private dataUrl: string;

  private async fetch<T>(url: string, options?: { [key: string]: unknown }): Promise<AxiosResponse<T>> {
    if (this.isAbortingRequests) {
      return null;
    }

    const cancelToken = new axios.CancelToken(source => {
      this.requestsQueue.push({
        id: url,
        cancel: source
      });
    });

    const response = await axios.create().get(url, {
      cancelToken,
      ...options,
    });

    this.requestsQueue = this.requestsQueue.filter(requests => requests.id !== url);

    return response;
  }

  private parseDatasetPayload(dataset: APIDatasetPayload['data']): Dataset.Payload {
    const columnsMetadata = dataset.attributes.metadata.length > 0
      && !!dataset.attributes.metadata[0].attributes.columns
      ? dataset.attributes.metadata[0].attributes.columns
      : null;

    return {
      id: dataset.id,
      name: dataset.attributes.name,
      tableName: dataset.attributes.tableName,
      provider: dataset.attributes.provider,
      type: dataset.attributes.type === 'tabular' ? 'tabular' : 'raster',
      geoInfo: dataset.attributes.geoInfo,
      relevantFields: dataset.attributes.widgetRelevantProps,
      metadata: {
        columns: columnsMetadata
          ? Object.keys(columnsMetadata).map(columnName => ({
            columnName,
            alias: columnsMetadata[columnName].alias,
            description: columnsMetadata[columnName].description,
          }))
          : [],
      },
    };
  }

  private parseWidgetPayload(widget: APIWidgetPayload['data']): Widget.Payload {
    return {
      id: widget.id,
      name: widget.attributes.name,
      description: widget.attributes.description,
      datasetId: widget.attributes.dataset,
      widgetConfig: widget.attributes.widgetConfig,
      metadata: {
        caption: widget.attributes.metadata.length > 0
          ? widget.attributes.metadata[0].attributes.info?.caption
          : undefined,
      },
    };
  }

  private parseLayerPayload(layer: APILayerDef): Layer.Payload {
    return {
      id: layer.id,
      name: layer.attributes.name,
      description: layer.attributes.name,
      datasetId: layer.attributes.dataset,
      provider: layer.attributes.provider,
      default: layer.attributes.default,
      tileUrl: `${this.config.endpoint}/layer/${layer.id}/tile/${layer.attributes.provider}/{z}/{x}/{y}`,
      layerConfig: layer.attributes.layerConfig,
      legendConfig: layer.attributes.legendConfig,
      interactionConfig: layer.attributes.interactionConfig,
    };
  }

  private parseFieldPayload(fields: APIFieldsPayload['fields'], dataset: Dataset.Payload): Dataset.Field[] {
    const isAllowed = (field: string, fieldType: string) => ALLOWED_FIELD_TYPES.findIndex(type => type.name === fieldType) !== -1
      && field !== "cartodb_id";

    const isRelevant = (field: string) => dataset.relevantFields.length === 0
      || dataset.relevantFields.indexOf(field) !== -1;

    const getMetadata = (field: string): Dataset.Field['metadata'] | null => dataset.metadata.columns.find(column => column.columnName === field);

    return Object.keys(fields)
      .filter(field => isAllowed(field, fields[field]?.type) && isRelevant(field))
      .map(field => ({
        columnName: field,
        type: ALLOWED_FIELD_TYPES.find(type => type.name === fields[field].type).type,
        metadata: getMetadata(field)
          ? {
            alias: getMetadata(field).alias,
            description: getMetadata(field).description,
          }
          : {},
      }));
  }

  getName(): string {
    return 'rw-adapter';
  }

  async getDataset(datasetId: string): Promise<Dataset.Payload> {
    const { endpoint, applications, env, locale } = this.config;
    const includes = "metadata,vocabulary,layer";

    const url = tags.oneLineTrim`
      ${endpoint}
      /dataset/
      ${datasetId}?
      application=${applications.join(",")}
      &env=${env}
      &language=${locale}
      &includes=${includes}
      &page[size]=999
    `;

    const { data: { data: dataset } } = await this.fetch(url);

    if (!dataset) {
      return null;
    }

    return this.parseDatasetPayload(dataset);
  }

  async getDatasetFields(datasetId: string, dataset: Dataset.Payload): Promise<Dataset.Field[]> {
    const url = tags.oneLineTrim`${this.config.endpoint}/fields/${datasetId}`;
    const { data: { fields } } = await this.fetch<APIFieldsPayload>(url);
    return this.parseFieldPayload(fields, dataset);
  }

  async getDatasetData(datasetId: string, sql: string, options?: { extraParams?: { geostore?: string; }; saveDataUrl?: boolean; }): Promise<Dataset.Data> {
    const url = `${this.config.endpoint}/query/${datasetId}?sql=${sql}${options?.extraParams?.geostore !== undefined ? `&geostore=${options.extraParams.geostore}` : ''}`;

    if (options?.saveDataUrl) {
      this.dataUrl = url;
    }

    const { data: { data } } = await this.fetch<APIQueryPayload>(url);

    return data;
  }

  async rendererGetData(widget: { id: string }) {
    return await this.getWidget(widget.id)
  }

  getDataUrl(): string {
    return this.dataUrl;
  }

  async getDatasetLayers(datasetId: string): Promise<Layer.Payload[]> {
    const { endpoint, applications, env } = this.config;

    const url = tags.oneLineTrim`
      ${endpoint}
      /dataset/
      ${datasetId}/layer?
      app=${applications.join(",")}
      &env=${env}
      &page[size]=9999
    `;

    const { data: { data } } = await this.fetch<APILayersPayload>(url);

    return data.map(d => this.parseLayerPayload(d));
  }

  async getWidget(widgetId: string): Promise<Widget.Payload> {
    const { endpoint, applications, env, locale } = this.config;

    if (!widgetId) {
      return null;
    }

    const url = tags.oneLineTrim`
      ${endpoint}
      /widget/
      ${widgetId}?
      ${applications.join(",")}
      &env=${env}
      &language=${locale}
      &includes=metadata
      &page[size]=999
    `;

    const { data: { data: widget } } = await this.fetch<APIWidgetPayload>(url);

    return this.parseWidgetPayload(widget);
  }

  async getLayer(layerId: string): Promise<Layer.Payload> {
    const url = `${this.config.endpoint}/layer/${layerId}`;
    const { data: { data } } = await this.fetch<APILayerPayload>(url);

    return this.parseLayerPayload(data);
  }

  async getPredefinedAreas(): Promise<Adapter.Area[]> {
    const url = `${this.config.endpoint}/geostore/admin/list`;
    const { data: { data } } = await this.fetch<APIGeostorePayload>(url);

    return data
      .filter(({ name }) => !!name)
      .map(({ geostoreId: id, name }) => ({
        id,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getUserAreas(): Promise<Adapter.Area[]> {
    const { endpoint, env, applications, userToken } = this.config;

    if (!userToken) {
      return [];
    }

    const url = `${endpoint}/area?application=${applications.join(",")}&env=${env}`;
    const options = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };
    const { data: { data } } = await this.fetch<APIAreaPayload>(url, options);

    return data
      .map(({ attributes: { geostore: id, name } }) => ({
        id,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  extendProperties(props: { [key: string]: unknown; }): void {
    for (const key in props) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = props[key];
      } else {
        throw new Error(`${this.getName()}: can't overwrite property ${key} because it does not exist.`);
      }
    }
  }

  abortRequests(): void {
    this.isAbortingRequests = true;
    this.requestsQueue.forEach(item => item.cancel());
  }
}