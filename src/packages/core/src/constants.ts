export const APP_NAMESPACE: string = "widgetEditor";

export const ALLOWED_FIELD_TYPES = [
  // --- NUMBER ----
  { name: "esriFieldTypeSmallInteger", type: "number", provider: "esri" },
  { name: "esriFieldTypeInteger", type: "number", provider: "esri" },
  { name: "esriFieldTypeSingle", type: "number", provider: "esri" },
  { name: "esriFieldTypeDouble", type: "number", provider: "esri" },
  { name: "numeric", type: "number", provider: "psql" },
  { name: "number", type: "number", provider: "carto" },
  { name: "int", type: "number", provider: "psql" },
  { name: "integer", type: "number", provider: "psql" },
  { name: "float", type: "number", provider: "sql" },
  { name: "long", type: "number", provider: "sql" },
  { name: "double", type: "number", provider: "sql" },
  { name: "real", type: "number", provider: "sql" },
  { name: "decimal", type: "number", provider: "sql" },
  // ----- TEXT -----
  { name: "string", type: "string", provider: "sql" },
  { name: "char", type: "string", provider: "sql" },
  { name: "varchar", type: "string", provider: "sql" },
  { name: "esriFieldTypeString", type: "string", provider: "esri" },
  { name: "text", type: "string", provider: "elastic" },
  // ----- DATE ----
  { name: "esriFieldTypeDate", type: "date", provider: "esri" },
  { name: "date", type: "date", provider: "sql" },
  { name: "time", type: "date", provider: "sql" },
  { name: "timestamp", type: "date", provider: "sql" },
  { name: "interval", type: "date", provider: "sql" },
  // ------ BOOLEAN -----
  { name: "boolean", type: "boolean", provider: "sql" },
  // ------ ARRAY -------
  { name: "array", type: "array", provider: "sql" }
];

export const sagaEvents = {
  DATA_FLOW_STORE_ADAPTER_CONFIG: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/adapter_configuration`,
  DATA_FLOW_DATASET_WIDGET_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/dataset_widget_ready`,
  DATA_FLOW_DATA_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/data_ready`,
  DATA_FLOW_VISUALISATION_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/visualisation_ready`,
  DATA_FLOW_WIDGET_DATA_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/visualisation_ready`,
  DATA_FLOW_PROXY_UPDATE: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/proxy_update`,
  EDITOR_SAVE: `${APP_NAMESPACE}/CONFIGURATION/saveConfiguration`,
  DATA_FLOW_UPDATE_WIDGET: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/updateWidget`,
  DATA_FLOW_CONFIGURATION_UPDATE: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/configurationUpdate`
};

export const reduxActions = {
  EDITOR_SET_CONFIGURATION: `${APP_NAMESPACE}/CONFIGURATION/setConfiguration`,
  EDITOR_SET_WIDGET: `${APP_NAMESPACE}/WIDGET/setWidget`,
  EDITOR_SET_FILTERS: `${APP_NAMESPACE}/EDITOR/setFilters`
};

export default {
  APP_NAMESPACE,
  sagaEvents,
  reduxActions
};
