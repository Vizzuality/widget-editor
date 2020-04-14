import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@packages/shared";
import { Modal } from "../modal";
import { FOOTER_HEIGHT } from "@packages/shared/lib/styles/style-constants";
const StyledFooter = styled.footer.withConfig({
  displayName: "component__StyledFooter",
  componentId: "sc-1wy317d-0"
})(["width:100%;height:", ";align-self:flex-end;display:flex;align-items:center;justify-content:space-between;padding:0 30px;"], FOOTER_HEIGHT);

const Footer = ({
  authenticated,
  onSave
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return React.createElement(StyledFooter, null, React.createElement(Modal, {
    isOpen: modalOpen,
    closeModal: () => setModalOpen(false)
  }, React.createElement("h2", null, "How to customize the visualization")), React.createElement(Button, {
    onClick: () => setModalOpen(true),
    type: "highlight"
  }, "Need help?"), authenticated && React.createElement(Button, {
    type: "cta",
    onClick: onSave
  }, "Save widget"));
};

export default Footer;