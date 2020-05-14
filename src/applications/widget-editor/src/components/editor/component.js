import React from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Renderer from "@widget-editor/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";
import { DataService } from "@widget-editor/core";
import { constants } from "@widget-editor/core";
import { StyledContainer, StyleEditorContainer } from "./style";

import { localGetEditorState } from "exposed-hooks";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    const {
      datasetId,
      widgetId,
      adapter,
      setEditor,
      dispatch,
      userPassedTheme,
      schemes,
    } = this.props;

    // XXX: Bind editor properties to exported callbacks
    // These functions can get called indipendent of the editor

    this.onSave = this.onSave.bind(this);

    this.dataService = new DataService(
      datasetId,
      widgetId,
      adapter,
      setEditor,
      dispatch
    );

    this.dataService.resolveInitialState();

    this.resolveTheme(userPassedTheme);
    this.resolveSchemes(schemes);

    props.dispatch({
      type: constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
      payload: adapter,
    });

    localGetEditorState({ adapter, dataService: this.dataService });
  }

  componentWillMount() {
    const { authenticated } = this.props;
    if (authenticated) {
      this.resolveAuthentication(authenticated);
    }

    this.resolveEditorFunctionality();
  }

  componentWillUnmount() {
    const { setEditor } = this.props;
    setEditor({ initialized: false });
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

  resolveEditorFunctionality() {
    const {
      setEditor,
      disable = [],
      enableSave = true,
      enableInfo = true,
    } = this.props;

    setEditor({
      disabledFeatures: disable,
      enableSave,
      enableInfo,
    });
  }

  initializeRestoration = debounce((datasetId, widgetId) => {
    this.dataService.restoreEditor(datasetId, widgetId);
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
    const { setScheme } = this.props;
    if (typeof schemes === "object") {
      setScheme(schemes);
    }
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
      adapter,
      theme: { compact },
    } = this.props;
    return (
      <StyledContainer {...compact}>
        <StyleEditorContainer>
          <Renderer standalone={false} />
          <EditorOptions adapter={adapter} dataService={this.dataService} />
        </StyleEditorContainer>
        <Footer onSave={this.onSave} />
      </StyledContainer>
    );
  }
}

export default Editor;
