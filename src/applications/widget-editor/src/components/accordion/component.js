import React, { useState, useCallback } from "react";
import PropTypes from 'prop-types';

import {
  StyledAccordionSection,
  StyledAccordionContent,
  StyledAccordionButton,
  StyledIcon,
  StyledAccordion,
} from "./style";

// TODO: Make these two components, not sure why we export two of them?

export const AccordionSection = ({ title, openDefault, themeColor, children }) => {
  const [isOpen, setOpen] = useState(openDefault);

  const onClickTitle = useCallback(() => setOpen(o => !o), [setOpen]);

  return (
    <StyledAccordionSection>
      <StyledAccordionButton
        type="button"
        role="button"
        onClick={onClickTitle}
      >
        <StyledIcon isOpen={isOpen} themeColor={themeColor} />
        {title}
      </StyledAccordionButton>
      <StyledAccordionContent isOpen={isOpen}>
        {children}
      </StyledAccordionContent>
    </StyledAccordionSection>
  );
};

AccordionSection.propTypes = {
  title: PropTypes.string,
  openDefault: PropTypes.bool,
  themeColor: PropTypes.string,
  children: PropTypes.any
}

export const Accordion = ({ children }) => {
  return <StyledAccordion>{children}</StyledAccordion>;
};

Accordion.propTypes = {
  children: PropTypes.any
}