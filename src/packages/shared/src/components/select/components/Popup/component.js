import React, { Fragment } from "react";
import { CategoryIcon } from "@widget-editor/shared";
import { ALIGN_HORIZONTAL } from "../../const";
import {
  StyledPopupContainer,
  StyledPopupInsideContainer,
  StyledOption,
  StyledDescription,
  IconBox,
} from "./style";

const Popup = ({
  options,
  getValue,
  setValue,
  innerRef,
  innerProps,
  selectProps,
}) => {
  const selected = getValue()[0];
  const { align = ALIGN_HORIZONTAL } = selectProps;

  const resolveTitle = (op) => {
    return op.alias || op.identifer;
  };

  return (
    <StyledPopupContainer align={align} ref={innerRef} {...innerProps}>
      <StyledPopupInsideContainer align={align}>
        {options.map((op) => (
          <StyledOption
            key={op.identifier + op.name}
            nonSelectedCategory={op.identifier === "___single_color"}
            active={selected && op.identifier === selected.identifier}
            onClick={() => setValue(op)}
          >
            {op.identifier !== "___single_color" && (
              <IconBox>{op.type === "string" ? <CategoryIcon /> : "#"}</IconBox>
            )}
            <p>
              {op.identifier === "___single_color"
                ? "Select column"
                : resolveTitle(op)}
            </p>
            {op.description && (
              <StyledDescription>{op.description}</StyledDescription>
            )}
          </StyledOption>
        ))}
      </StyledPopupInsideContainer>
    </StyledPopupContainer>
  );
};

export default Popup;
