import React from "react";
import PropTypes from "prop-types";
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
        adapter={adapter}
        adapterInstance={new adapter()}
        schemes={schemes}
        userPassedCompact={compact}
        userPassedTheme={theme}
      />
    );
  }
}

WidgetEditor.propTypes = {
  application: PropTypes.string,
  onSave: PropTypes.func,
  datasetId: PropTypes.string,
  widgetId: PropTypes.string,
  adapter: PropTypes.object,
  theme: PropTypes.object,
  disable: PropTypes.bool,
  enableSave: PropTypes.bool,
  schemes: PropTypes.arrayOf(PropTypes.object),
  compact: PropTypes.bool
}

export default WidgetEditor;
