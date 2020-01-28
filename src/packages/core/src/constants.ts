export const APP_NAMESPACE: string = "widgetEditor";

export const sagaEvents = {
  DATA_FLOW_DATASET_WIDGET_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/dataset_widget_ready`,
  DATA_FLOW_DATA_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/data_ready`,
  DATA_FLOW_VISUALISATION_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/visualisation_ready`,
  DATA_FLOW_WIDGET_DATA_READY: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/visualisation_ready`,
  DATA_FLOW_PROXY_UPDATE: `${APP_NAMESPACE}/SAGAS/DATA_FLOW/proxy_update`
};

export default {
  APP_NAMESPACE,
  sagaEvents
};
