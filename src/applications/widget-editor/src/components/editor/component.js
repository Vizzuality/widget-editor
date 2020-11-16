import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Renderer from "@widget-editor/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";

import { JSTypes } from "@widget-editor/types";
import { DataService, getOutputPayload } from "@widget-editor/core";
import { constants } from "@widget-editor/core";

import {
  StyledContainer,
  StyleEditorContainer,
  StyledRendererContainer,
  StyledOptionsContainer,
} from "./style";

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
      areaIntersection,
    } = this.props;

    this.onSave = this.onSave.bind(this);

    this.dataService = new DataService(
      datasetId,
      widgetId,
      adapterInstance,
      setEditor,
      dispatch
    );

    this.dataService.resolveInitialState()
      .then(() => {
        // We wait for the filters to be restored before setting the default geo filter
        this.resolveAreaIntersection(areaIntersection);
      });

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
      areaIntersection: prevAreaIntersection
    } = prevProps;
    const {
      datasetId,
      widgetId,
      userPassedTheme,
      schemes,
      areaIntersection
    } = this.props;

    // When datasetId changes, we need to restore the editor itself
    if (
      !isEqual(datasetId, prevDatasetId) ||
      !isEqual(widgetId, prevWidgetId)
    ) {
      this.initializeRestoration(datasetId, widgetId);
    }

    if (!isEqual(areaIntersection, prevAreaIntersection)) {
      this.resolveAreaIntersection(areaIntersection);
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
    const { areaIntersection, resetFilters, dispatch } = this.props;
    resetFilters();
    this.dataService.restoreEditor(datasetId, widgetId, () => {
      this.resolveAreaIntersection(areaIntersection);
      dispatch({ type: constants.sagaEvents.DATA_FLOW_UPDATE_HOOK_STATE });
    });
  }, 1000);

  // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client
  resolveTheme = (userPassedTheme) => {
    const { setTheme, userPassedCompact } = this.props;
    setTheme({
      ...userPassedTheme,
      compact: {
        ...this.props.theme.compact,
        forceCompact: userPassedCompact || false,
      },
    });
  };

  resolveSchemes = debounce((schemes) => {
    const { setSchemes } = this.props;
    if (Array.isArray(schemes) && schemes.length > 0) {
      setSchemes(schemes);
    }
  }, 1000);

  resolveAreaIntersection(areaIntersection) {
    const {
      setFilters,
      hasGeoInfo,
    } = this.props;
    const { areaIntersection: prevAreaIntersection } = this.props.editorState.filters;

    if (areaIntersection && hasGeoInfo) {
      setFilters({ areaIntersection });
    } else if (!areaIntersection && prevAreaIntersection && prevAreaIntersection.length > 0) {
      // If we get no intersection from parent but we have one present, reset intersection selection
      setFilters({ areaIntersection: "" });
    }
  }

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
          <StyledRendererContainer {...compact}>
            <Renderer adapter={adapter} standalone={false} />
          </StyledRendererContainer>
          <StyledOptionsContainer {...compact}>
            <EditorOptions adapter={adapterInstance} dataService={this.dataService} />
          </StyledOptionsContainer>
        </StyleEditorContainer>
        <Footer onSave={this.onSave} />
      </StyledContainer>
    );
  }
}

Editor.propTypes = {
  userPassedCompact: PropTypes.bool,
  authenticated: PropTypes.bool,
  enableSave: PropTypes.bool,
  setSchemes: PropTypes.func,
  onSave: PropTypes.func,
  editorState: PropTypes.object,
  adapter: PropTypes.func.isRequired,
  resetEditor: PropTypes.func,
  resetConfiguration: PropTypes.func,
  resetWidgetConfig: PropTypes.func,
  setTheme: PropTypes.func,
  resetFilters: PropTypes.func,
  resetTheme: PropTypes.func,
  datasetId: PropTypes.string,
  disable: PropTypes.arrayOf(PropTypes.string),
  widgetId: PropTypes.string,
  adapterInstance: PropTypes.object,
  setEditor: PropTypes.func,
  dispatch: PropTypes.func,
  userPassedTheme: PropTypes.object,
  schemes: PropTypes.arrayOf(PropTypes.object),
  theme: JSTypes.theme,
  areaIntersection: PropTypes.string,
  setFilters: PropTypes.func.isRequired,
  hasGeoInfo: PropTypes.bool.isRequired,
};

Editor.defaultProps = {
  areaIntersection: null,
};

export default Editor;
