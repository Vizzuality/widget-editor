import React from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Renderer from "@packages/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";
import { DataService } from "@packages/core";
import { constants } from "@packages/core";
import { StyledContainer } from "./style";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    const {
      datasetId,
      widgetId,
      adapter,
      setEditor,
      dispatch,
      theme,
      schemes,
    } = this.props;

    this.onSave = this.onSave.bind(this);

    this.dataService = new DataService(
      datasetId,
      widgetId,
      adapter,
      setEditor,
      dispatch
    );

    this.dataService.resolveInitialState();
    this.resolveTheme(theme);
    this.resolveSchemes(schemes);

    props.dispatch({
      type: constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
      payload: adapter,
    });
  }

  componentWillMount() {
    const { authenticated, disabled } = this.props;
    if (authenticated) {
      this.resolveAuthentication();
    }

    this.resolveEditorFunctionality();
  }

  componentDidUpdate(prevProps) {
    const {
      datasetId: prevDatasetId,
      widgetId: prevWidgetId,
      theme: prevTheme,
      schemes: prevSchemes,
      authenticated: prevAuthenticated,
    } = prevProps;
    const { datasetId, widgetId, theme, schemes, authenticated } = this.props;

    // When datasetId changes, we need to restore the editor itself
    if (
      !isEqual(datasetId, prevDatasetId) ||
      !isEqual(widgetId, prevWidgetId)
    ) {
      this.initializeRestoration(datasetId, widgetId);
    }

    if (!isEqual(theme, prevTheme)) {
      this.resolveTheme(theme);
    }

    if (!isEqual(schemes, prevSchemes)) {
      this.resolveSchemes(schemes);
    }

    if (!isEqual(authenticated, prevAuthenticated)) {
      this.resolveAuthentication(authenticated);
    }
  }

  // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client
  resolveAuthentication = debounce((authenticated) => {
    const { setEditor } = this.props;
    setEditor({ authenticated });
  }, 1000);

  resolveEditorFunctionality() {
    const { setEditor, disable } = this.props;
    if (disable && Array.isArray(disable)) {
      setEditor({ disabledFeatures: disable });
    }
  }

  initializeRestoration = debounce((datasetId, widgetId) => {
    this.dataService.restoreEditor(datasetId, widgetId);
  }, 1000);

  // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client
  resolveTheme = debounce((theme) => {
    const { setTheme } = this.props;
    setTheme(theme);
  }, 1000);

  resolveSchemes = debounce((schemes) => {
    const { setScheme } = this.props;
    setScheme(schemes);
  }, 1000);

  onSave() {
    const { onSave, dispatch, editorState, adapter, application } = this.props;
    if (typeof onSave === "function") {
      adapter.handleSave(onSave, this.dataService, application, editorState);
    }
    dispatch({ type: constants.sagaEvents.EDITOR_SAVE });
  }

  render() {
    const {
      configuration,
      adapter,
      theme: { compact },
    } = this.props;
    return (
      <StyledContainer {...compact}>
        <Renderer />
        {configuration.limit && (
          <EditorOptions adapter={adapter} dataService={this.dataService} />
        )}
        <Footer onSave={this.onSave} />
      </StyledContainer>
    );
  }
}

export default Editor;
