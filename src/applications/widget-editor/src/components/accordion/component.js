import React, { useState, useRef, useEffect } from "react";
import ReactResizeDetector from "react-resize-detector";

import {
  StyledAccordionSection,
  StyledAccordionContent,
  StyledAccordionButton,
  StyledAccordion,
} from "./style";

export const AccordionSection = ({ title, openDefault, children }) => {
  const contentRef = useRef({});
  const [outerHeight, setOuterHeight] = useState(0);
  const [isOpen, setOpen] = useState(false);

  const clickToTitle = () => {
    setOpen(!isOpen);
    const panel = contentRef.current;
    if (panel) {
      const height = outerHeight ? 0 : panel.scrollHeight;
      setOuterHeight(height);
    }
  };

  const updateHeight = () => {
    const panel = contentRef.current;
    if (panel && panel.scrollHeight > 0 && isOpen) {
      const height = panel.scrollHeight;
      setOuterHeight(height);
    }
  };

  useEffect(() => {
    setTimeout(() => (openDefault ? clickToTitle() : null), 0);
  }, []);

  return (
    <StyledAccordionSection>
      <StyledAccordionButton
        type="button"
        role="button"
        onClick={() => clickToTitle()}
      >
        {title}
      </StyledAccordionButton>
      <StyledAccordionContent ref={contentRef} scrollHeight={outerHeight}>
        <ReactResizeDetector handleHeight skipOnMount onResize={updateHeight}>
          <div>{children}</div>
        </ReactResizeDetector>
      </StyledAccordionContent>
    </StyledAccordionSection>
  );
};

export const Accordion = ({ children }) => {
  return <StyledAccordion>{children}</StyledAccordion>;
};
