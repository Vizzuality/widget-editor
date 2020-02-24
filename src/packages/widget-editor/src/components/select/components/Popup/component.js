import React from "react";
import { StyledPopupContainer } from "./style";


const Popup = ({ data }) => {
  const { description, alias } = data;
  return (
    <StyledPopupContainer>
      <h3>{alias}</h3>
      <p>{description}</p>
    </StyledPopupContainer>
  );
}

export default Popup;
