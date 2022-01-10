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
  map,
}) => {
  if (typeof adapter !== "function") {
    throw new Error(
      "Widget editor: Missing prop adapter and adapter needs to be of type Adapter"
    );
  }

  if (!datasetId) {
    throw new Error("Widget editor: Missing prop datasetId of type string");
  }

  if (!map?.mapboxToken) {
    throw new Error("Widget editor: Missing prop map.mapboxToken");
  }
  
  const adapterInstance = useMemo(() => new adapter(), [adapter]);

  if (typeof window !== 'undefined') {
    window.WE_adapter = adapterInstance;
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
      adapterInstance={adapterInstance}
      schemes={schemes}
      userPassedCompact={compact}
      userPassedTheme={theme}
      map={{
        ...map,
        providers: map?.providers || {},
        VIEWPORT: map?.VIEWPORT || {},
        MAPSTYLES: map?.MAPSTYLES || '',
      }}
    />
  );
};

WidgetEditor.propTypes = {
  providers: PropTypes.object,
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
  map: PropTypes.shape({
    MAPSTYLES: PropTypes.string,
    VIEWPORT: PropTypes.object,
    providers: PropTypes.object,
    mapboxToken: PropTypes.string
  })
};

WidgetEditor.defaultProps = {
  areaIntersection: null,
};

export default WidgetEditor;
