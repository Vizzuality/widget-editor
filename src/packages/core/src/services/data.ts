import isObjectLike from "lodash/isObjectLike";

import { Dataset, Widget, Adapter, Generic } from "@widget-editor/types";

import { setAdapter } from "../helpers/adapter";

import { sagaEvents, reduxActions } from "../constants";
import { getDeserializedFilters } from '../filters';
import FiltersService from './filters';

export default class DataService {
  adapter: Adapter.Service;
  dataset: Dataset.Payload;
  datasetId: Dataset.Id;
  widgetId: Widget.Id;
  widget: Widget.Payload;
  fields: Dataset.Field[];
  setEditor: Generic.Dispatcher;
  dispatch: Generic.Dispatcher;

  constructor(
    datasetId: Dataset.Id,
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
    this.datasetId = datasetId;
    this.widgetId = widgetId;
    this.widget = null;
  }

  async getDatasetAndWidgets() {
    this.dataset = await this.adapter.getDataset(this.datasetId);
    this.widget = await this.adapter.getWidget(this.widgetId);

    this.setEditor({ dataset: this.dataset, widget: this.widget });
    this.dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });
  }

  /**
   * Fetch the dataset's 50 first rows and set it as the table's data
   */
  async getTableData() {
    const { tableName } = this.dataset;
    try {
      const tableData = await this.adapter.getDatasetData(
        this.datasetId,
        `SELECT * FROM ${tableName} LIMIT 50`
      );
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

    this.datasetId = datasetId;
    this.widgetId = widgetId;

    await this.getDatasetAndWidgets();
    await this.getFieldsAndLayers();
    await this.handleFilters();
    this.handleEndUserFilters();
    this.handleGeoFilter();
    this.getTableData();

    this.setEditor({
      widgetData: [],
      advanced: !this.widget?.widgetConfig
        ? false
        : !this.widget.widgetConfig.paramsConfig
    });

    if (this.widget?.widgetConfig) {
      this.dispatch({
        type: reduxActions.EDITOR_SET_WIDGETCONFIG,
        payload: this.widget?.widgetConfig
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
    if (
      !this.widget
      // Case of an advanced widget
      || !this.widget.widgetConfig.paramsConfig
      // Case of a map widget
      || this.widget.widgetConfig.paramsConfig.visualizationType === 'map'
    ) {
      return null;
    }

    const paramsConfig = (this.widget.widgetConfig as Widget.ChartWidgetConfig).paramsConfig;
    const filters = paramsConfig.filters;
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
        this.fields,
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
    if (
      !this.widget
      // Case of an advanced widget
      || !this.widget.widgetConfig.paramsConfig
      // Case of a map widget
      || this.widget.widgetConfig.paramsConfig.visualizationType === 'map'
    ) {
      return null;
    }

    const { endUserFilters } = (this.widget.widgetConfig as Widget.ChartWidgetConfig).paramsConfig;
    if (endUserFilters) {
      this.dispatch({
        type: reduxActions.EDITOR_SET_END_USER_FILTERS,
        payload: endUserFilters,
      })
    }
  }

  handleGeoFilter(): void {
    if (
      !this.widget
      // Case of an advanced widget
      || !this.widget.widgetConfig.paramsConfig
      // Case of a map widget
      || this.widget.widgetConfig.paramsConfig.visualizationType === 'map'
    ) {
      return null;
    }

    const { areaIntersection } = (this.widget.widgetConfig as Widget.ChartWidgetConfig).paramsConfig;
    if (areaIntersection) {
      this.dispatch({
        type: reduxActions.EDITOR_SET_FILTERS,
        payload: { areaIntersection },
      })
    }
  }

  async getFieldsAndLayers() {
    const fields = await this.adapter.getDatasetFields(this.datasetId, this.dataset);
    const layers = await this.adapter.getDatasetLayers(this.datasetId);
    this.fields = fields;

    this.dispatch({ type: sagaEvents.DATA_FLOW_FIELDS_AND_LAYERS_READY });
    this.setEditor({ layers, fields });
  }

  async requestWithFilters(store: any) {
    try {
      const filtersService = new FiltersService(store, this.adapter);
      const widgetData = await this.adapter.getDatasetData(
        this.datasetId,
        filtersService.getQuery(),
        {
          extraParams: filtersService.getAdditionalParams(),
          saveDataUrl: true,
        }
      );

      this.setEditor({ widgetData });
    } catch (e) {
      this.setEditor({ errors: ["WIDGET_DATA_UNAVAILABLE"] });
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
