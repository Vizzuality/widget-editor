import React from "react";
import Editor from "components/editor";

class WidgetEditor extends React.Component {
  render() {
    const {
      application,
      onSave,
      datasetId,
      widgetId = null,
      adapter,
      theme,
      disable,
      enableSave,
      schemes,
      compact = false,
      areaIntersection,
    } = this.props;

    if (typeof adapter !== "function") {
      throw new Error(
        "Widget editor: Missing prop adapter and adapter needs to be of type Adapter"
      );
    }

    if (!datasetId) {
      throw new Error("Widget editor: Missing prop datasetId of type string");
    }

    return (
      <Editor
        disable={disable}
        application={application}
        onSave={onSave}
        enableSave={enableSave}
        datasetId={datasetId}
        widgetId={widgetId}
        areaIntersection={areaIntersection}
        adapter={adapter}
        adapterInstance={new adapter()}
        schemes={schemes}
        userPassedCompact={compact}
        userPassedTheme={theme}
      />
    );
  }
}

export default WidgetEditor;
