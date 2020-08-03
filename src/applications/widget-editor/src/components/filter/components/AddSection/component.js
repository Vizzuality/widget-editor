import React from "react";
import { Button } from "@widget-editor/shared";

import { StyledAddSection } from "./style";

const AddSection = ({ addFilter }) => {
  return (
    <StyledAddSection>
      <Button size="small" onClick={() => addFilter()}>
        Add filter
      </Button>
    </StyledAddSection>
  );
};
export default AddSection;
