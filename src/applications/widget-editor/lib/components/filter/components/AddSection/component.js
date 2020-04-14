import React, { useState, useRef, useEffect } from "react";
import { Button } from "@packages/shared";
import { StyledAddSection } from "./style";

const AddSection = ({
  addFilter
}) => {
  return React.createElement(StyledAddSection, null, React.createElement(Button, {
    size: "small",
    onClick: () => addFilter()
  }, "Add Filter"));
};

export default AddSection;