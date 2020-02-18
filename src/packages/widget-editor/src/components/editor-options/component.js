import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "components/button";
import QueryLimit from "components/query-limit";
import WidgetInfo from "components/widget-info";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  flex: 1;
  background: #fff;
  height: calc(100% - ${FOOTER_HEIGHT} - 20px);
  padding: 0 30px;
  margin: 10px 0;
  overflow-y: scroll;
  ${DEFAULT_BORDER(1, 1, 1, 0)}
`;

const StyledList = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  list-style: none;
`;

const StyledListItem = styled.li`
  color: red;
`;

const EditorOptions = ({ limit = null, patchConfiguration }) => {
  return (
    <StyledContainer>
      <StyledList>
        <StyledListItem>
          <Button>General</Button>
        </StyledListItem>
        <StyledListItem>
          <Button>Visual style</Button>
        </StyledListItem>
        <StyledListItem>
          <Button>Advanced</Button>
        </StyledListItem>
        <StyledListItem>
          <Button>Table view</Button>
        </StyledListItem>
      </StyledList>
      <WidgetInfo />
      <QueryLimit />
    </StyledContainer>
  );
};

export default EditorOptions;
