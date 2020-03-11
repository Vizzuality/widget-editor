import { Dataset, Widget, Adapter, Generic } from "@packages/types";

import FiltersService from "./filters";
import VegaService from "./vega";

import { sagaEvents, ALLOWED_FIELD_TYPES } from "../constants";

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
    await this.getWidgetData();

    this.setEditor({ restoring: false });
  }

  async getWidgetData() {
    const {
      attributes: {
        widgetConfig: { paramsConfig }
      }
    } = this.widget;

    // Construct correct SQL query based on widgetConfig
    const filtersService = new FiltersService(paramsConfig, this.dataset.id);
    this.widgetData = await filtersService.requestWidgetData();

    this.setEditor({ widgetData: this.widgetData.data });
    this.dispatch({ type: sagaEvents.DATA_FLOW_WIDGET_DATA_READY });
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
    const allowedFields = [];

    Object.keys(fields).forEach(field => {
      const f = {
        ...fields[field],
        columnName: field,
        metadata: columns[field]
      };
      if (this.isFieldAllowed(f)) {
        allowedFields.push(f);
      }
    });

    this.setEditor({ layers, fields: allowedFields });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATA_READY });
  }

  // TODO: add generic types for configuration and widget
  resolveUpdates(configuration: any, widget: any) {
    let widgetParams = {};

    // Resolve adapter specific fields as params in payload
    this.adapter.widget_params.forEach(param => {
      if (param in configuration) {
        widgetParams = { ...widgetParams, [param]: configuration[param] };
      } else {
        // This can be displayed as info
        // As the user might just have miss-spelled a property.
        // We will inform them with a warning instead of throwing error
        // as the initial script will still work to populate params
        console.warn(
          `Widget Editor: Param(${param}) does not exsist in widget, make sure adapter.widget_params has fields that match with your API widget payload. Refer to documentation for adapter.widget_params for aditional information.`
        );
      }
    });

    // Build payload that the consumer will need to save the state of the editor
    const payload = {
      ...this.adapter.payload(),
      title: configuration.title || null,
      description: configuration.description || null,
      widget: {
        params: widgetParams,
        data: widget.data || null,
        scales: widget.scales || null,
        axes: widget.axes || null,
        marks: widget.marks || null,
        interaction_config: widget.interaction_config || null,
        config: widget.config || null
      }
    };

    return payload;
  }

  async resolveInitialState() {
    await this.getDatasetAndWidgets();
    await this.getWidgetData();
    await this.getFieldsAndLayers();
    this.setEditor({ initialized: true });
  }
}
