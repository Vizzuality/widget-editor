import React from "react";
import styled from "styled-components";

import Button from "components/button";

const StyledContainer = styled.section`
  color: red;
`;

const EditorOptions = () => {
  return (
    <StyledContainer>
      <Button>General</Button>
      Editor options
    </StyledContainer>
  );
};

export default EditorOptions;
