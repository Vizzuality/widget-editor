import React, { useState, useRef, useEffect } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { StyledAccordionSection, StyledAccordionContent, StyledAccordionButton, StyledAccordion } from "./style";
export const AccordionSection = ({
  title,
  openDefault,
  children
}) => {
  const contentRef = useRef({});
  const [outerHeight, setOuterHeight] = useState(0);
  const [isOpen, setOpen] = useState(false);

  const clickToTitle = () => {
    setOpen(!isOpen);
    const panel = contentRef.current;
    const height = outerHeight ? 0 : panel.scrollHeight;
    setOuterHeight(height);
  };

  const updateHeight = () => {
    const panel = contentRef.current;

    if (panel.scrollHeight > 0 && isOpen) {
      const height = panel.scrollHeight;
      setOuterHeight(height);
    }
  };

  useEffect(() => {
    setTimeout(() => openDefault ? clickToTitle() : null, 0);
  }, []);
  return React.createElement(StyledAccordionSection, null, React.createElement(StyledAccordionButton, {
    onClick: () => clickToTitle()
  }, title), React.createElement(StyledAccordionContent, {
    ref: contentRef,
    scrollHeight: outerHeight
  }, React.createElement(ReactResizeDetector, {
    handleHeight: true,
    skipOnMount: true,
    onResize: updateHeight
  }, React.createElement("div", null, children))));
};
export const Accordion = ({
  children
}) => {
  return React.createElement(StyledAccordion, null, children);
};