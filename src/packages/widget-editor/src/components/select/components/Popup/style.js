import styled, { css } from "styled-components";

export const StyledPopupContainer = styled.div`
  position: absolute;
	box-sizing: border-box;
	height: auto;
	width: 422px;
	border: 1px solid rgba(26,28,34,0.1);
	border-radius: 4px;
	background-color: #FFFFFF;
	box-shadow: 0 20px 30px 0 rgba(0,0,0,0.1);
  z-index: 2;
  bottom: 40px;
  left: -75px;
  padding: 20px;

  ${props => props.align === 'vertical' && css`
    left: 75px;
    bottom: initial;
    top: 30%;
  `}

  &:after {
    content: '';
    position: absolute;
    left: 200px;
    bottom: -20px;
    border: 10px solid transparent;
    border-top: 10px solid #FFFFFF;
    z-index: 3;

    ${props => props.align === 'vertical' && css`
     display: none;
    `}
  }
`;

export const StyledCategoryAlias = styled.h4`
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  margin-top: 0;
  color: #2C75B0;
  font-size: 16px;
  line-height: 25px;
`;

export const StyledCategoryDescription = styled.div`
  position: relative;
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #393F44;
  font-size: 16px;
  line-height: 25px;
`;
export const StyledValueAlias = styled.div`
  position: relative;
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #393F44;
  font-size: 16px;
  line-height: 25px;
`;

export const IconBox = styled.div`
  color: #393F44;
  position: absolute;
  left: 0;
  top: 1px;
`;
