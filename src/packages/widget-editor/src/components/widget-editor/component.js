import React from "react";
import Editor from "components/editor";

class WidgetEditor extends React.Component {
  render() {
    const {
      authenticated,
      application,
      onSave,
      datasetId,
      adapter,
      theme,
      schemes,
      compact = true
    } = this.props;

    if (typeof adapter !== "function") {
      throw new Error(
        "Widget editor: Missing prop adapter and adapter needs to be of type Adapter"
      );
    }

    return (
      <Editor
        authenticated={authenticated}
        application={application}
        onSave={onSave}
        datasetId={datasetId}
        adapter={new adapter()}
        schemes={schemes}
        theme={{
          ...theme,
          compact: {
            isCompact: compact,
            isOpen: false
          }
        }}
      />
    );
  }
}

export default WidgetEditor;
