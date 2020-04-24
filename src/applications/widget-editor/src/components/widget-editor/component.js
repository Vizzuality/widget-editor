import React from "react";
import Editor from "components/editor";

class WidgetEditor extends React.Component {
  render() {
    const {
      authenticated,
      application,
      onSave,
      datasetId,
      widgetId = null,
      adapter,
      theme,
      disable,
      schemes,
      compact = true,
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
        authenticated={authenticated}
        disable={disable}
        application={application}
        onSave={onSave}
        datasetId={datasetId}
        widgetId={widgetId}
        adapter={new adapter()}
        schemes={schemes}
        userPassedCompact={compact}
        userPassedTheme={theme}
      />
    );
  }
}

export default WidgetEditor;
