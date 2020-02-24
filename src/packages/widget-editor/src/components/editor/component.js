import React from "react";
import styled from "styled-components";
import isEqual from "lodash/isEqual";

import Renderer from "components/renderer";
import EditorOptions from "components/editor-options";
import Footer from "components/footer";

import { DataService } from "@packages/core";

import { constants } from "@packages/core";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  flex-flow: column;

  @media only screen and (min-width: 768px) {
    flex-flow: wrap;
  }
`;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    const { onSave, datasetId, adapter, setEditor, dispatch } = this.props;

    const dataService = new DataService(
      datasetId,
      adapter,
      setEditor,
      dispatch
    );
    dataService.resolveInitialState();
  }

  componentWillMount() {
    const { authenticated, dispatch } = this.props;
    if (authenticated) {
      this.resolveAuthentication();
    }
  }

  componentDidUpdate(prevProps) {
    const { theme: prevTheme, authenticated: prevAuthenticated } = prevProps;
    const { theme, authenticated } = this.props;

    if (!isEqual(theme, prevTheme)) {
      this.resolveTheme();
    }

    if (!isEqual(authenticated, prevAuthenticated)) {
      this.resolveAuthentication();
    }
  }

  resolveAuthentication() {
    const { authenticated, dispatch } = this.props;
    dispatch({
      type: "widgetEditor/EDITOR/setEditor",
      payload: { authenticated }
    });
  }

  resolveTheme() {
    const { theme, dispatch } = this.props;
    dispatch({ type: "THEME/setTheme", payload: theme });
  }

  render() {
    const { configuration } = this.props;

    return (
      <StyledContainer>
        <Renderer />
        {configuration.limit && <EditorOptions />}
        <Footer />
      </StyledContainer>
    );
  }
}

export default Editor;
