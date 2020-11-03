import isObjectLike from "lodash/isObjectLike";

import { Dataset, Widget, Adapter, Generic } from "@widget-editor/types";

import { setAdapter } from "../helpers/adapter";

import { sagaEvents, reduxActions, ALLOWED_FIELD_TYPES } from "../constants";
import { getDeserializedFilters } from '../filters';

export default class DataService {
  adapter: Adapter.Service;
  dataset: Dataset.Payload;
  widgetId: Widget.Id;
  widget: Widget.Payload;
  widgetData: any;
  cachedState: object;
  allowedFields: any;
  setEditor: Generic.Dispatcher;
  dispatch: Generic.Dispatcher;

  constructor(
    datasetId: Adapter.datasetId,
    widgetId: Widget.Id,
    adapter: Adapter.Service,
    setEditor: Generic.Dispatcher,
    dispatch: Generic.Dispatcher
  ) {
    this.adapter = adapter;
    setAdapter(this.adapter);

    this.setEditor = setEditor;
    this.dispatch = dispatch;
    this.dataset = null;
    this.widgetId = widgetId;
    this.widget = null;
    this.widgetData = null;

    this.adapter.setDatasetId(datasetId);
  }

  async getDatasetAndWidgets() {
    this.dataset = await this.adapter.getDataset();
    this.widget = await this.adapter.getWidget(this.dataset, this.widgetId);

    this.setEditor({ dataset: this.dataset, widget: this.widget });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });
  }

  /**
   * Fetch the dataset's 50 first rows and set it as the table's data
   */
  async getTableData() {
    const { tableName } = this.dataset.attributes;
    try {
      const tableData = await this.adapter.getDatasetData(`SELECT * FROM ${tableName} LIMIT 50`);
      this.setEditor({ tableData });
    } catch (e) {
      console.error("Unable to fetch the dataset's data", e);
    }
  }

  async restoreEditor(datasetId, widgetId, cb = null) {
    this.setEditor({
      restoring: true
    });
    this.dispatch({ type: sagaEvents.DATA_FLOW_RESTORE });

    this.widgetId = widgetId;
    this.adapter.setDatasetId(datasetId);

    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    await this.handleFilters();
    this.handleEndUserFilters();

    this.setEditor({
      widgetData: [],
      advanced: !this.widget?.attributes?.widgetConfig
        ? false
        : !this.widget.attributes.widgetConfig.paramsConfig
    });

    if (this.widget?.attributes?.widgetConfig) {
      this.dispatch({
        type: reduxActions.EDITOR_SET_WIDGETCONFIG,
        payload: this.widget?.attributes?.widgetConfig
      });
    }

    if (cb) {
      cb();
    }

    this.setEditor({ restoring: false });
    this.dispatch({ type: sagaEvents.DATA_FLOW_VISUALIZATION_READY });
    this.dispatch({ type: sagaEvents.DATA_FLOW_RESTORED });
  }

  async handleFilters(restore: boolean = false) {
    if (!this.widget) return null;

    const paramsConfig = this.widget.attributes?.widgetConfig?.paramsConfig;
    const filters = paramsConfig?.filters;
    let orderBy = null;
    let color = null;

    if (filters && Array.isArray(filters) && filters.length > 0) {
      // --- If orderby exists, assign it to stores
      if (isObjectLike(paramsConfig.orderBy)) {
        orderBy = paramsConfig.orderBy;
      }

      if (isObjectLike(paramsConfig.color)) {
        color = paramsConfig.color;
      }

      const deserializedFilters = await getDeserializedFilters(
        this.adapter,
        filters,
        this.allowedFields,
        this.dataset
      );

      if (restore) {
        return deserializedFilters;
      } else {
        this.dispatch({
          type: reduxActions.EDITOR_SET_FILTERS,
          payload: { color, orderBy, list: deserializedFilters },
        });
      }
    }
  }

  handleEndUserFilters(): void {
    if (!this.widget) {
      return;
    }

    const endUserFilters = this.widget.attributes?.widgetConfig?.paramsConfig?.endUserFilters;
    if (endUserFilters) {
      this.dispatch({
        type: reduxActions.EDITOR_SET_END_USER_FILTERS,
        payload: endUserFilters,
      })
    }
  }

  isFieldAllowed(field) {
    const fieldTypeAllowed = ALLOWED_FIELD_TYPES.find(
      (val) => val.name.toLowerCase() === field.type.toLowerCase()
    );
    const isCartodbId = field.columnName === "cartodb_id";
    const result = !isCartodbId && fieldTypeAllowed;
    return result;
  }

  async getFieldsAndLayers() {
    const fields = await this.adapter.getFields();
    const layers = await this.adapter.getLayers();

    const fieldsMetadata = this.dataset?.attributes?.metadata[0]?.attributes?.columns;
    const relevantFields = this.dataset?.attributes?.widgetRelevantProps ?? [];
    this.allowedFields = fields && Object.keys(fields).length > 0
      ? Object.keys(fields)
        .map(field => ({
          ...fields[field],
          columnName: field,
          metadata: fieldsMetadata?.[field] ?? {},
        }))
        .filter(field => (
          this.isFieldAllowed(field)
          && (!relevantFields.length || relevantFields.indexOf(field.columnName) !== -1)
        ))
      : [];

    this.dispatch({ type: sagaEvents.DATA_FLOW_FIELDS_AND_LAYERS_READY });
    this.setEditor({ layers, fields: this.allowedFields });
  }

  async requestWithFilters(store: any) {
    const request = await this.adapter.requestData(store);

    if ("errors" in request) {
      this.setEditor({ errors: ["WIDGET_DATA_UNAVAILABLE"] });
    } else {
      this.setEditor({ widgetData: request });
    }
  }

  async resolveInitialState() {
    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    await this.handleFilters();
    this.getTableData();
    this.handleEndUserFilters();
    this.dispatch({ type: sagaEvents.DATA_FLOW_VISUALIZATION_READY });
    // If this dispatch is not executed, the local state is not set on init
    this.dispatch({ type: sagaEvents.DATA_FLOW_RESTORED });
  }

  /**
   * Return the list of predefined areas the user can filter with
   */
  async getPredefinedAreas(): Promise<{ id: string | number, name: string }[]> {
    try {
      return await this.adapter.getPredefinedAreas();
    } catch (e) {
      console.error("Unable to fetch the predefined areas", e);
      return [];
    }
  }

  /**
   * Return the list of the user's areas
   */
  async getUserAreas(): Promise<{ id: string | number, name: string }[]> {
    try {
      return await this.adapter.getUserAreas();
    } catch (e) {
      console.error("Unable to fetch the user's areas", e);
      return [];
    }
  }
}
