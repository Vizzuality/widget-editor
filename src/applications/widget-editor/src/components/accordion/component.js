import React, { useState, useCallback } from "react";

import {
  StyledAccordionSection,
  StyledAccordionContent,
  StyledAccordionButton,
  StyledIcon,
  StyledAccordion,
} from "./style";

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

export const Accordion = ({ children }) => {
  return <StyledAccordion>{children}</StyledAccordion>;
};
