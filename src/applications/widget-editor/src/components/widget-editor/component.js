import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Editor from "components/editor";

const WidgetEditor = ({
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
  mapboxToken
}) => {
  if (typeof adapter !== "function") {
    throw new Error(
      "Widget editor: Missing prop adapter and adapter needs to be of type Adapter"
    );
  }

  if (!datasetId) {
    throw new Error("Widget editor: Missing prop datasetId of type string");
  }

  if (!mapboxToken) {
    throw new Error("Widget editor: Missing prop mapboxToken");
  }

  const adapterInstance = useMemo(() => new adapter(), [adapter]);

  return (
    <Editor
      disable={disable}
      mapboxToken={mapboxToken}
      application={application}
      onSave={onSave}
      enableSave={enableSave}
      datasetId={datasetId}
      widgetId={widgetId}
      areaIntersection={areaIntersection}
      adapter={adapter}
      adapterInstance={adapterInstance}
      schemes={schemes}
      userPassedCompact={compact}
      userPassedTheme={theme}
    />
  );
};

WidgetEditor.propTypes = {
  application: PropTypes.string,
  onSave: PropTypes.func,
  datasetId: PropTypes.string,
  widgetId: PropTypes.string,
  adapter: PropTypes.func.isRequired,
  theme: PropTypes.object,
  disable: PropTypes.array,
  enableSave: PropTypes.bool,
  schemes: PropTypes.arrayOf(PropTypes.object),
  compact: PropTypes.any,
  areaIntersection: PropTypes.string,
};

WidgetEditor.defaultProps = {
  areaIntersection: null,
};

export default WidgetEditor;
