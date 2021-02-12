import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Renderer from '@widget-editor/renderer';
import Map from "@widget-editor/map";
import { JSTypes } from "@widget-editor/types";

import Legend from "components/legend";
import SelectChart from "components/select-chart";
import ColumnSelections from "components/column-selections";

import {
  StyledContainer,
  RestoringWidget,
  RestoringWidgetTitle,
  StyledChartTitle,
  StyledMapTitle,
  StyledMessage,
  StyledChartContainer,
  StyledMapContainer,
} from "./style";

const Visualization = ({
  editor,
  configuration,
  widgetConfig,
  compact,
  adapter,
  editorSyncMap,
  patchConfiguration,
}) => {
  const { advanced, widgetData, restoring, initialized } = editor;

  const isMap = configuration.visualizationType === "map";

  const adapterInstance = useMemo(() => new adapter(), [adapter]);

  const chartDataAvailable = useMemo(
    () => advanced || (widgetData && widgetData.length > 0),
    [advanced, widgetData],
  );

  const canChartBeRendered = advanced || (!!configuration.category && !!configuration.value);

  const chartWidgetConfig = useMemo(
    () => {
      const res = { ...widgetConfig };

      if (!advanced) {
        delete res.legends;
      }

      // We remove the legend so that the renderer doesn't display it
      delete res.legend;

      // We remove the axes titles in the editor
      if (!advanced) {
        res.axes = res.axes ? [...res.axes] : [];
        res.axes?.forEach((axis, index) => {
          if (axis.title) {
            res.axes[index] = { ...axis };
            delete res.axes[index].title;
          }
        });
      }

      return res;
    },
    [widgetConfig, advanced],
  );

  if (restoring || !initialized) {
    return (
      <StyledContainer>
        <RestoringWidget>
          <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
        </RestoringWidget>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <SelectChart advanced={advanced} />

      {!isMap && (
        <>
          <StyledChartTitle>{configuration.title}</StyledChartTitle>
          <StyledChartContainer
            hasYAxis={configuration.chartType !== "pie" && configuration.chartType !== "donut"}
            advanced={advanced}
          >
            {!canChartBeRendered && (
              <StyledMessage>Select value and category to get started</StyledMessage>
            )}
            {canChartBeRendered && chartDataAvailable && (
              <Renderer adapter={adapter} widgetConfig={chartWidgetConfig} />
            )}
            {!advanced && <ColumnSelections compact={compact} />}
          </StyledChartContainer>
        </>
      )}

      {isMap && !!editor.layers && (
        <StyledMapContainer>
          {!!configuration.title && <StyledMapTitle>{configuration.title}</StyledMapTitle>}
          <Map
            adapter={adapterInstance}
            layerId={configuration.layer}
            layers={editor.layers}
            mapConfiguration={configuration.map}
            interactionEnabled
            onChange={state => {
              editorSyncMap(state);
              patchConfiguration();
            }}
          />
        </StyledMapContainer>
      )}

      {!isMap && <Legend compact={compact} />}
    </StyledContainer>
  );
};

Visualization.propTypes = {
  editor: PropTypes.shape({
    widgetData: PropTypes.array,
    advanced: PropTypes.bool,
    restoring: PropTypes.bool,
    initialized: PropTypes.bool,
    layers: PropTypes.array,
  }),
  configuration: JSTypes.configuration,
  compact: PropTypes.any,
  widgetConfig: PropTypes.object,
  adapter: PropTypes.func,
  editorSyncMap: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

export default Visualization;