import styled from "styled-components";

export const StyledAccordion = styled.div`
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const StyledAccordionContent = styled.div`
  display: "block";
  max-height: ${(props) => props.scrollHeight + "px" || "0"};
  overflow-y: ${(props) => (props.scrollHeight ? "visible" : "hidden")};
  transition: all 0.2s ease-out;
  padding-left: 24px;
  padding-top: ${(props) => (props.scrollHeight ? "18px" : "0" || "0")};
  padding-bottom: ${(props) => (props.scrollHeight ? "18px" : "0" || "0")};
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
  &:before {
    content: " ";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #c32d7b;
    position: absolute;
    left: 0;
    top: 8px;
  }
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
