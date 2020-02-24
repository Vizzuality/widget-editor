import React from "react";
import Editor from "components/editor";

class WidgetEditor extends React.Component {
  render() {
    const { authenticated, onSave, datasetId, adapter, theme } = this.props;

    if (typeof adapter !== "function") {
      throw new Error(
        "Widget editor: Missing prop adapter and adapter needs to be of type Adapter"
      );
    }

    return (
      <Editor
        authenticated={authenticated}
        onSave={onSave}
        datasetId={datasetId}
        adapter={new adapter()}
        theme={theme}
      />
    );
  }
}

export default WidgetEditor;
