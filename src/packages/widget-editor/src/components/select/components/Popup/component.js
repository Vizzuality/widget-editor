import React, { Fragment } from "react";
import CategoryIcon from 'components/icons/CategoryIcon';
import { ALIGN_HORIZONTAL } from '../../const';
import { 
  StyledPopupContainer,
  StyledPopupInsideContainer,
  StyledCategoryAlias,
  StyledValueAlias,
  IconBox 
} from "./style";


const Popup = ({ options, getValue, setValue, innerRef, innerProps, selectProps }) => {
  
  const selected = getValue()[0];
  const { align = ALIGN_HORIZONTAL } = selectProps;

  return (
    <StyledPopupContainer align={align} ref={innerRef} {...innerProps} >
      <StyledPopupInsideContainer align={align}>
        {options.map(op => (
          <Fragment key={op.name}>
            <StyledCategoryAlias 
              active={op.name === selected.name}
              onClick={() => setValue(op)}
            >
              <IconBox><CategoryIcon /></IconBox>
              {op.alias} 1
            </StyledCategoryAlias>
            <StyledValueAlias>
              <IconBox>#</IconBox>
              {op.name} 2
            </StyledValueAlias>
          </Fragment>
        ))}
      </StyledPopupInsideContainer>
    </StyledPopupContainer>
  );
}

export default Popup;
