import styled from "styled-components";

import { AccordionArrow } from "@widget-editor/shared"

export const StyledAccordion = styled.div`
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const StyledAccordionContent = styled.div`
  display: "block";
  max-height: ${props => props.isOpen ? 'none' : 0};
  overflow-y: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: padding 0.2s ease-out;
  padding-left: 24px;
  padding-top: ${(props) => (props.isOpen ? "18px" : 0)};
  padding-bottom: ${(props) => (props.isOpen ? "18px" : 0)};
`;

export const StyledAccordionButton = styled.button`
  display: block;
  height: 25px;
  color: #393f44;
  font-size: 16px;
  font-weight: 500;
  line-height: 25px;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
`;

export const StyledIcon = styled(AccordionArrow)`
  position: absolute;
  left: 0;
  top: 5px;
  stroke: ${props => props.themeColor};
  transform: ${props => props.isOpen ? 'rotate(0)' : 'rotate(-90deg)'};
  transition: transform 0.2s ease-out;
`;

export const StyledAccordionSection = styled.div`
  padding-top: 11px;
  padding-bottom: 11px;
  position: relative;

  &:before {
    content: " ";
    height: 1px;
    width: calc(100% - 24px);
    display: block;
    position: absolute;
    top: 0;
    background-color: #d2d3d6;
    margin-left: 24px;
  }

  &:first-child {
    &:before {
      display: none;
    }
  }
`;
