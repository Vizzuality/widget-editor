import React from "react";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import Renderer from "components/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";
import { DataService } from "@packages/core";
import { constants } from "@packages/core";
import { StyledContainer } from "./style";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    const { datasetId, adapter, setEditor, dispatch, theme } = this.props;
    this.onSave = this.onSave.bind(this);
    this.dataService = new DataService(datasetId, adapter, setEditor, dispatch);
    this.dataService.resolveInitialState();
    this.resolveTheme(theme);
  }

  componentWillMount() {
    const { authenticated } = this.props;
    if (authenticated) {
      this.resolveAuthentication();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      datasetId: prevDatasetId,
      theme: prevTheme,
      authenticated: prevAuthenticated
    } = prevProps;
    const { datasetId, theme, authenticated } = this.props;

    // When datasetId changes, we need to restore the editor itself
    if (!isEqual(datasetId, prevDatasetId)) {
      this.initializeRestoration(datasetId);
    }

    if (!isEqual(theme, prevTheme)) {
      this.resolveTheme(theme);
    }

    if (!isEqual(authenticated, prevAuthenticated)) {
      this.resolveAuthentication(authenticated);
    }
  }

  // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client
  resolveAuthentication = debounce(authenticated => {
    const { setEditor } = this.props;
    setEditor({ authenticated });
  }, 1000);

  initializeRestoration = debounce(datasetId => {
    this.dataService.restoreEditor(datasetId);
  }, 1000);

  // We debounce all properties here
  // Then we dont have to care if debouncing is set on the client
  resolveTheme = debounce(theme => {
    const { setTheme } = this.props;
    setTheme(theme);
  }, 1000);

  onSave() {
    const { onSave, dispatch, configuration, widget } = this.props;
    if (typeof onSave === "function") {
      onSave(this.dataService.resolveUpdates(configuration, widget));
    }
    dispatch({ type: constants.sagaEvents.EDITOR_SAVE });
  }

  render() {
    const {
      configuration,
      theme: { compact }
    } = this.props;
    return (
      <StyledContainer {...compact}>
        <Renderer />
        {configuration.limit && <EditorOptions />}
        <Footer onSave={this.onSave} />
      </StyledContainer>
    );
  }
}

export default Editor;
