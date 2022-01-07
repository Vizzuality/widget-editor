import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import EditorOptions from 'components/editor-options';
import Footer from 'components/footer';
import Visualization from 'components/visualization';

import { JSTypes } from '@widget-editor/types';
import { DataService, getOutputPayload } from '@widget-editor/core';
import { constants } from '@widget-editor/core';

import {
  StyledContainer,
  StyleEditorContainer,
  StyledVisualizationContainer,
  StyledOptionsContainer
} from './style';

import { localGetEditorState, setReduxCache } from 'exposed-hooks';

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
      schemes
    } = this.props;

    this.onSave = this.onSave.bind(this);

    this.dataService = new DataService(
      datasetId,
      widgetId,
      adapterInstance,
      setEditor,
      dispatch
    );

    this.dataService.resolveInitialState().then(() => {
      // Before we can set the default geo filter, we need two things:
      // 1. We need to know if the dataset has geographic information
      // 2. We need to restore the widget's filters to overwrite them

      // Also very important, the areaIntersection prop may have been dynamically updated since the
      // editor has been first instantiated. For this reason, we get the value of areaIntersection
      // *inside* this callback.
      const { areaIntersection } = this.props;

      this.resolveAreaIntersection(areaIntersection);
    });

    this.resolveTheme(userPassedTheme);
    this.resolveSchemes(schemes);

    props.dispatch({
      type: constants.sagaEvents.DATA_FLOW_STORE_ADAPTER_CONFIG,
      payload: adapterInstance
    });

    // XXX: Initialize editor hooks apis
    setReduxCache(dispatch);
    localGetEditorState({
      adapter: adapterInstance,
      dataService: this.dataService
    });
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
      areaIntersection: prevAreaIntersection,
      userPassedCompact: prevUserPassedCompact
    } = prevProps;
    const {
      datasetId,
      widgetId,
      userPassedTheme,
      schemes,
      areaIntersection,
      initialized,
      userPassedCompact
    } = this.props;

    // When datasetId changes, we need to restore the editor itself
    if (
      !isEqual(datasetId, prevDatasetId) ||
      !isEqual(widgetId, prevWidgetId)
    ) {
      this.initializeRestoration(datasetId, widgetId);
    }

    // We need the editor to be fully initialized before we can set the default geo filter:
    // 1. The dataset must be fetched to know if it has geographic information
    // 2. The widget's filters must be restored to eventually overwrite them
    if (initialized && !isEqual(areaIntersection, prevAreaIntersection)) {
      this.resolveAreaIntersection(areaIntersection);
    }

    if (!isEqual(userPassedTheme, prevUserPassedTheme) ||
      !isEqual(userPassedCompact, prevUserPassedCompact)) {
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
    const { setEditor, disable, enableSave = true } = this.props;

    setEditor({
      enableSave,
      ...(disable !== undefined && disable !== null
        ? { disabledFeatures: disable }
        : {})
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
  resolveTheme = userPassedTheme => {
    const { setTheme, userPassedCompact } = this.props;
    setTheme({
      ...userPassedTheme,
      compact: {
        ...this.props.theme.compact,
        forceCompact: userPassedCompact || false
      }
    });
  };

  resolveSchemes = debounce(schemes => {
    const { setSchemes } = this.props;
    if (Array.isArray(schemes) && schemes.length > 0) {
      setSchemes(schemes);
    }
  }, 1000);

  resolveAreaIntersection(areaIntersection) {
    const { hasGeoInfo, setFilters } = this.props;

    if (areaIntersection && hasGeoInfo) {
      setFilters({ areaIntersection });
    } else {
      // Very important to note:
      // If the editor restores a widget and a default geo filter is passed to the editor, if later
      // this default value is removed, the geo filter will be emptied instead of restoring the
      // widget's geo filter's  value
      setFilters({ areaIntersection: null });
    }
  }

  onSave() {
    const { onSave, dispatch, editorState, adapterInstance } = this.props;
    if (typeof onSave === 'function') {
      const outputPayload = getOutputPayload(editorState, adapterInstance);
      onSave(outputPayload);
    }
    dispatch({ type: constants.sagaEvents.EDITOR_SAVE });
  }

  render() {
    const { adapter, theme: { compact }, mapboxToken, providers } = this.props;
    return (
      <StyledContainer {...compact}>
        <StyleEditorContainer>
          <StyledVisualizationContainer {...compact}>
            <Visualization adapter={adapter} mapboxToken={mapboxToken} providers={providers} standalone={false} />
          </StyledVisualizationContainer>
          <StyledOptionsContainer {...compact}>
            <EditorOptions dataService={this.dataService} />
          </StyledOptionsContainer>
        </StyleEditorContainer>
        <Footer onSave={this.onSave} />
      </StyledContainer>
    );
  }
}

Editor.propTypes = {
  providers: PropTypes.object,
  mapboxToken: PropTypes.string.isRequired,
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
  initialized: PropTypes.bool.isRequired,
};

Editor.defaultProps = {
  areaIntersection: null
};

export default Editor;
