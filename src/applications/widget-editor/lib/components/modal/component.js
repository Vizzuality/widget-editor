import React from "react";
import { Button, CloseIcon } from "@packages/shared";
import { StyledModalBox, StyledModalContainer, StyledModalContent, StyledModalCloseBtn, StyledActions } from "./style";
export const Modal = ({
  isOpen,
  closeModal,
  children
}) => {
  return React.createElement(StyledModalBox, {
    isOpen: isOpen
  }, React.createElement(StyledModalContainer, {
    isOpen: isOpen
  }, React.createElement(StyledModalContent, null, React.createElement(StyledModalCloseBtn, {
    onClick: () => closeModal()
  }, React.createElement(CloseIcon, {
    width: "20px",
    height: "20px",
    hoverColor: "#C32D7B"
  })), children, React.createElement(StyledActions, null, React.createElement(Button, {
    onClick: () => closeModal(),
    type: "cta"
  }, "Ok, got it!")))));
};