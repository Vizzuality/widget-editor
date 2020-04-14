import React, { Fragment } from "react";
import { CategoryIcon } from "@packages/shared";
import { ALIGN_HORIZONTAL } from "../../const";
import {
  StyledPopupContainer,
  StyledPopupInsideContainer,
  StyledCategoryInfoContainer,
  StyledCategoryAlias,
  StyledValueAlias,
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

  return (
    <StyledPopupContainer align={align} ref={innerRef} {...innerProps}>
      <StyledPopupInsideContainer align={align}>
        {options.map((op) => (
          <Fragment key={op.identifier + op.name}>
            <StyledCategoryAlias
              nonSelectedCategory={op.identifier === "___single_color"}
              active={selected && op.identifier === selected.identifier}
              onClick={() => setValue(op)}
            >
              <IconBox>
                <CategoryIcon />
              </IconBox>
              {op.identifier === "___single_color"
                ? "Single color"
                : op.identifier}
            </StyledCategoryAlias>
            {op.identifier !== "___single_color" && (
              <StyledCategoryInfoContainer>
                <StyledValueAlias>
                  <IconBox>#</IconBox>
                  {op.alias || op.name || op.identifier}
                </StyledValueAlias>
                {op.description && (
                  <StyledDescription>{op.description}</StyledDescription>
                )}
              </StyledCategoryInfoContainer>
            )}
          </Fragment>
        ))}
      </StyledPopupInsideContainer>
    </StyledPopupContainer>
  );
};

export default Popup;
