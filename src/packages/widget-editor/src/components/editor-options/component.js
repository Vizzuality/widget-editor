import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "components/button";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  flex: 1;
  background: #fff;
  height: calc(100% - ${FOOTER_HEIGHT} - 20px);
  padding: 0 30px;
  margin: 10px 0;
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

const EditorOptions = ({ limit = null, patchConfiguration  }) => {
  const [optionsState, setOptionsState] = useState({ limit: `${limit}` })
  const handleChange = (e) => {
    setOptionsState({ ...optionsState, limit: e.target.value });
  } 

  useEffect(() => {
    if (optionsState.limit !== limit && limit !== null) {
      patchConfiguration({ limit: optionsState.limit });
    }
  }, [optionsState])

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
      <input type="number" min="1" max="500" value={optionsState.limit} onChange={handleChange} />
    </StyledContainer>
  );
};

export default EditorOptions;
