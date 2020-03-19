import { Dataset, Widget, Adapter, Generic } from "@packages/types";

import FiltersService from "./filters";
import VegaService from "./vega";

import { sagaEvents, reduxActions, ALLOWED_FIELD_TYPES } from "../constants";

export default class DataService {
  adapter: Adapter.Service;
  dataset: Dataset.Payload;
  widget: Widget.Payload;
  widgetData: any;
  cachedState: object;
  setEditor: Generic.Dispatcher;
  dispatch: Generic.Dispatcher;

  constructor(
    datasetId: Adapter.datasetId,
    adapter: Adapter.Service,
    setEditor: Generic.Dispatcher,
    dispatch: Generic.Dispatcher
  ) {
    this.adapter = adapter;
    this.setEditor = setEditor;
    this.dispatch = dispatch;
    this.dataset = null;
    this.widget = null;
    this.widgetData = null;

    this.adapter.setDatasetId(datasetId);
  }

  async getDatasetAndWidgets() {
    this.dataset = await this.adapter.getDataset();
    this.widget = await this.adapter.getWidget(this.dataset);

    this.setEditor({ dataset: this.dataset, widget: this.widget });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });
  }

  async restoreEditor(datasetId) {
    this.setEditor({ restoring: true });

    this.adapter.setDatasetId(datasetId);

    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    await this.handleFilters();

    this.setEditor({ restoring: false });
  }

  async handleFilters() {
    const { filters } = this.widget.attributes.widgetConfig.paramsConfig;

    const normalizeFilters = await this.adapter.filterUpdate(
      filters,
      this.allowedFields,
      this.widget
    );

    this.dispatch({
      type: reduxActions.EDITOR_SET_FILTERS,
      payload: { list: normalizeFilters }
    });
  }

  isFieldAllowed(field) {
    const fieldTypeAllowed = ALLOWED_FIELD_TYPES.find(
      val => val.name.toLowerCase() === field.type.toLowerCase()
    );
    const isCartodbId = field.columnName === "cartodb_id";
    const result = !isCartodbId && fieldTypeAllowed;
    return result;
  }

  async getFieldsAndLayers() {
    const fields = await this.adapter.getFields();
    const layers = await this.adapter.getLayers();

    // Get field aliases from Dataset
    const { columns } = this.dataset.attributes.metadata[0].attributes;
    // Filter on allowed field types
    this.allowedFields = [];

    Object.keys(fields).forEach(field => {
      const f = {
        ...fields[field],
        columnName: field,
        metadata: columns[field]
      };
      if (this.isFieldAllowed(f)) {
        this.allowedFields.push(f);
      }
    });

    this.setEditor({ layers, fields: this.allowedFields });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATA_READY });
  }

  async requestWithFilters(filters: any, configuration: any) {
    const serialized = this.adapter.filterSerializer(filters);
    const filtersService = new FiltersService(
      { ...configuration },
      filters,
      this.dataset
    );

    const request = await this.adapter.requestData(
      filtersService.getQuery(),
      this.dataset
    );

    if (!request.data || "errors" in request) {
      this.setEditor({ errors: ["WIDGET_DATA_UNAVAILABLE"] });
    } else {
      this.setEditor({ widgetData: request.data });
      this.dispatch({ type: sagaEvents.DATA_FLOW_WIDGET_DATA_READY });
    }
  }

  async resolveInitialState() {
    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    await this.handleFilters();

    this.setEditor({ initialized: true });
  }
}
