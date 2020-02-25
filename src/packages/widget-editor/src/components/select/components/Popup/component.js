import React from "react";
import CategoryIcon from 'components/icons/CategoryIcon';
import { 
  StyledPopupContainer,
  StyledCategoryAlias,
  StyledCategoryDescription,
  StyledValueAlias,
  IconBox 
} from "./style";


const Popup = ({ category, value }) => {
  const { alias: valueAlias } = value;
  const { alias: categoryAlias } = category;
  return (
    <StyledPopupContainer>
      <StyledCategoryAlias>
        <IconBox><CategoryIcon /></IconBox>
        {categoryAlias}
      </StyledCategoryAlias>
      <StyledCategoryDescription>
        <IconBox>#</IconBox>
        {categoryAlias} Description
      </StyledCategoryDescription>
      <StyledValueAlias>
        <IconBox>#</IconBox>
        {valueAlias}
      </StyledValueAlias>
    </StyledPopupContainer>
  );
}

export default Popup;
