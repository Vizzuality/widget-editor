import React from "react";

import sagaEvents from "sagas/events";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.getDatasetAndWidgets();
    this.getFieldsAndLayers();
  }

  async getDatasetAndWidgets() {
    const { adapter, setEditor, dispatch } = this.props;
    const dataset = await adapter.getDataset();
    const widget = await adapter.getWidget(dataset);

    setEditor({ dataset, widget });
    dispatch({ type: sagaEvents.DATA_FLOW_DATASET_WIDGET_READY });

    const widgetData = await adapter.getWidgetData(dataset, widget);

    setEditor({ widgetData });
    dispatch({ type: sagaEvents.DATA_FLOW_WIDGET_DATA_READY });
  }

  async getFieldsAndLayers() {
    const { adapter, setEditor, dispatch } = this.props;

    const fields = await adapter.getFields();
    const layers = await adapter.getLayers();

    setEditor({ layers, fields });
    dispatch({ type: sagaEvents.DATA_FLOW_DATA_READY });
  }

  render() {
    return <p>Im an editor</p>;
  }
}

export default Editor;
