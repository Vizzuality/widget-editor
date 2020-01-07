import React from "react";
import styled from "styled-components";

import sagaEvents from "sagas/events";

import Renderer from "components/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";

const StyledContainer = styled.div`
  background: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
`;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.getDatasetAndWidgets();
    this.getFieldsAndLayers();
    this.resolveTheme();
  }

  resolveTheme() {
    const { theme, setTheme } = this.props;
    if (theme) {
      setTheme(theme);
    }
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
    return (
      <StyledContainer>
        <Renderer />
        <EditorOptions />
        <Footer />
      </StyledContainer>
    );
  }
}

export default Editor;
