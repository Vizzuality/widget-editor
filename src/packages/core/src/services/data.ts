import isObjectLike from "lodash/isObjectLike";

import { Dataset, Widget, Adapter, Generic } from "@widget-editor/types";

import FiltersService from "./filters";
import VegaService from "./vega";

import { setAdapter } from "../helpers/adapter";

import { sagaEvents, reduxActions, ALLOWED_FIELD_TYPES } from "../constants";

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

  async restoreEditor(datasetId, widgetId, cb = null) {
    this.setEditor({
      restoring: true
    });
    this.dispatch({ type: sagaEvents.DATA_FLOW_RESTORE });

    this.widgetId = widgetId;
    this.adapter.setDatasetId(datasetId);

    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    const filters = await this.handleFilters(true);

    if (
      this.widget.attributes?.widgetConfig?.paramsConfig &&
      this.widget.attributes?.widgetConfig?.value &&
      this.widget.attributes?.widgetConfig?.category
    ) {
      await this.requestWithFilters(filters, this.widget.attributes?.widgetConfig?.paramsConfig);
    } else {
      this.setEditor({
        widgetData: null,
        advanced: !this.widget?.attributes?.widgetConfig?.paramsConfig
      });
    }

    if (cb) {
      cb();
    }

    this.setEditor({ restoring: false });
    this.dispatch({ type: sagaEvents.DATA_FLOW_RESTORED });
    this.dispatch({ type: sagaEvents.DATA_FLOW_VISUALISATION_READY });
  }

  async handleFilters(restore: boolean = false) {
    if (!this.widget) return null;

    const paramsConfig = this.widget.attributes?.widgetConfig?.paramsConfig;
    const filters = paramsConfig?.filters;
    let orderBy = null;
    let color = null;

    if (filters && Array.isArray(filters) && filters.length > 0) {
      // --- If orderby exsists, assign it to stores
      if (isObjectLike(paramsConfig.orderBy)) {
        orderBy = paramsConfig.orderBy;
      }

      if (isObjectLike(paramsConfig.color)) {
        color = paramsConfig.color;
      }

      const normalizeFilters = await this.adapter.filterUpdate(
        filters,
        this.allowedFields,
        this.widget,
        this.dataset
      );

      if (restore) {
        return normalizeFilters;
      } else {
        this.dispatch({
          type: reduxActions.EDITOR_SET_FILTERS,
          payload: { color, orderBy, list: normalizeFilters },
        });
      }
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

    // Get field aliases from Dataset
    const columns = this.dataset?.attributes?.metadata[0]?.attributes?.columns;
    // Filter on allowed field types
    this.allowedFields = [];
    if (fields && Object.keys(fields).length > 0) {
      Object.keys(fields).forEach((field) => {
        const f = {
          ...fields[field],
          columnName: field,
          metadata: columns?.[field] ?? {},
        };
        if (this.isFieldAllowed(f)) {
          this.allowedFields.push(f);
        }
      });
    }

    this.dispatch({ type: sagaEvents.DATA_FLOW_FIELDS_AND_LAYERS_READY });
    this.setEditor({ layers, fields: this.allowedFields });
  }

  async requestWithFilters(filters: any, configuration: any) {
    const filtersService = new FiltersService(
      { ...configuration },
      filters,
      this.dataset
    );

    const request = await this.adapter.requestData({
      configuration, filters,
      dataset: this.dataset
    });

    if (!request.data || "errors" in request) {
      this.setEditor({ errors: ["WIDGET_DATA_UNAVAILABLE"] });
    } else {
      this.setEditor({ widgetData: request.data });
    }
  }

  async resolveInitialState() {
    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    await this.handleFilters();
    this.dispatch({ type: sagaEvents.DATA_FLOW_VISUALISATION_READY });
  }
}
