import React from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Renderer from "@widget-editor/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";
import { DataService, getOutputPayload } from "@widget-editor/core";
import { constants } from "@widget-editor/core";
import { StyledContainer, StyleEditorContainer } from "./style";

import { localGetEditorState, setReduxCache } from "exposed-hooks";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    const {
      datasetId,
      widgetId,
      adapterInstance,
      setEditor,
      dispatch,
      userPassedTheme,
      schemes,
    } = this.props;

    this.onSave = this.onSave.bind(this);

    this.dataService = new DataService(
      datasetId,
      widgetId,
      adapterInstance,
      setEditor,
      dispatch
    );

    this.dataService.resolveInitialState();

    this.resolveTheme(userPassedTheme);
    this.resolveSchemes(schemes);

    props.dispatch({
      type: constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
      payload: adapterInstance,
    });

    // XXX: Initialize editor hooks apis
    setReduxCache(dispatch)
    localGetEditorState({ adapter: adapterInstance, dataService: this.dataService });
  }

  UNSAFE_componentWillMount() {
    const { authenticated } = this.props;
    if (authenticated) {
      this.resolveAuthentication(authenticated);
    }

    this.resolveEditorFunctionality();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: constants.sagaEvents.DATA_FLOW_UNMOUNT
    });
    this.resetEditor();
  }


  componentDidUpdate(prevProps) {
    const {
      datasetId: prevDatasetId,
      widgetId: prevWidgetId,
      userPassedTheme: prevUserPassedTheme,
      schemes: prevSchemes,
    } = prevProps;
    const { datasetId, widgetId, userPassedTheme, schemes } = this.props;

    // When datasetId changes, we need to restore the editor itself
    if (
      !isEqual(datasetId, prevDatasetId) ||
      !isEqual(widgetId, prevWidgetId)
    ) {
      this.initializeRestoration(datasetId, widgetId);
    }

    if (!isEqual(userPassedTheme, prevUserPassedTheme)) {
      this.resolveTheme(userPassedTheme);
    }

    if (!isEqual(schemes, prevSchemes)) {
      this.resolveSchemes(schemes);
    }
  }

  resetEditor() {
    const {
      resetEditor,
      resetConfiguration,
      resetWidgetConfig,
      resetFilters,
      resetTheme
    } = this.props;
    resetEditor();
    resetConfiguration();
    resetWidgetConfig();
    resetFilters();
    resetTheme();
  }

  resolveEditorFunctionality() {
    const {
      setEditor,
      disable,
      enableSave = true,
    } = this.props;

    setEditor({
      enableSave,
      ...(disable !== undefined && disable !== null
        ? {disabledFeatures: disable }
        : {}
      ),
    });
  }

  initializeRestoration = debounce((datasetId, widgetId) => {
    const { resetFilters, dispatch } = this.props;
    resetFilters();
    this.dataService.restoreEditor(datasetId, widgetId, () => {
      dispatch({ type: constants.sagaEvents.DATA_FLOW_UPDATE_HOOK_STATE });
    });
  }, 1000);

  // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client
  resolveTheme = debounce((userPassedTheme) => {
    const { setTheme, userPassedCompact } = this.props;
    setTheme({
      ...userPassedTheme,
      compact: {
        ...this.props.theme.compact,
        forceCompact: userPassedCompact || false,
      },
    });
  }, 1000);

  resolveSchemes = debounce((schemes) => {
    const { setSchemes } = this.props;
    if (Array.isArray(schemes) && schemes.length > 0) {
      setSchemes(schemes);
    }
  }, 1000);

  onSave() {
    const { onSave, dispatch, editorState, adapterInstance } = this.props;
    if (typeof onSave === "function") {
      const outputPayload = getOutputPayload(editorState, adapterInstance);
      onSave(outputPayload);
    }
    dispatch({ type: constants.sagaEvents.EDITOR_SAVE });
  }

  render() {
    const {
      adapter,
      adapterInstance,
      theme: { compact },
    } = this.props;
    return (
      <StyledContainer {...compact}>
        <StyleEditorContainer>
          <Renderer adapter={adapter} standalone={false} />
          <EditorOptions adapter={adapterInstance} dataService={this.dataService} />
        </StyleEditorContainer>
        <Footer onSave={this.onSave} />
      </StyledContainer>
    );
  }
}

export default Editor;
