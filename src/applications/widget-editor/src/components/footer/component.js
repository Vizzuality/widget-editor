import React, { useState, Fragment } from "react";
import styled, { css } from "styled-components";

import { Button } from "@widget-editor/shared";

import { Modal } from "components/modal";

import { FOOTER_HEIGHT } from "@widget-editor/shared/lib/styles/style-constants";

const StyledFooter = styled.footer`
  ${(props) =>
    props.disabled &&
    css`
      display: none;
    `}
  width: 100%;
  height: ${FOOTER_HEIGHT};
  align-self: flex-end;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Footer = ({ enableSave, enableInfo, onSave }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <StyledFooter disabled={!enableSave && !enableInfo}>
      {enableInfo && (
        <Fragment>
          <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
            <h2>How to customize the visualization</h2>
          </Modal>
          <Button
            role="button"
            type="button"
            onClick={() => setModalOpen(true)}
            btnType="highlight"
          >
            Need help?
          </Button>
        </Fragment>
      )}
      {enableSave && (
        <Button role="button" type="button" btnType="cta" onClick={onSave}>
          Save widget
        </Button>
      )}
    </StyledFooter>
  );
};

export default Footer;
