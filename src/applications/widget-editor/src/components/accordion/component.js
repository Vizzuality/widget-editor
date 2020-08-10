import React, { useState, useCallback } from "react";

import {
  StyledAccordionSection,
  StyledAccordionContent,
  StyledAccordionButton,
  StyledAccordion,
} from "./style";

export const AccordionSection = ({ title, openDefault, children }) => {
  const [isOpen, setOpen] = useState(openDefault);

  const onClickTitle = useCallback(() => setOpen(o => !o), [setOpen]);

  return (
    <StyledAccordionSection>
      <StyledAccordionButton
        type="button"
        role="button"
        onClick={onClickTitle}
      >
        {title}
      </StyledAccordionButton>
      <StyledAccordionContent isOpen={isOpen}>
        {children}
      </StyledAccordionContent>
    </StyledAccordionSection>
  );
};

export const Accordion = ({ children }) => {
  return <StyledAccordion>{children}</StyledAccordion>;
};
