import styled from "styled-components";

import StyledColorInput from "styles-common/color-input/style";

export const StyledSchemesContainer = styled.div`
  position: relative;
  width: 100%;
  margin-left: -5px;
  margin-right: -5px;
  padding-top: 10px;

  * {
    box-sizing: border-box;
  }
`;

export const StyledSchemesCardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const StyledSchemesCard = styled.div`
  flex-basis: calc((100% / 3) - (20px / 3));
  margin: 0 5px 10px;

  &:nth-of-type(3n + 1) {
    margin-left: 0;
  }

  &:nth-of-type(3n + 3) {
    margin-right: 0;
  }

  &:last-of-type {
    margin-right: auto;
  }

  input {
    display: none;
  }
`;

export const StyledCardBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100px;
  border: ${(props) =>
    props.active ? "2px solid #C32D7B" : "1px solid rgba(202,204,208,0.85)"};
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  padding: 15px 18px;

  &:hover {
    border: 2px solid #c32d7b;
    cursor: pointer;
  }
`;

export const StyledSchemeInfo = styled.div``;

export const StyledSchemeName = styled.div`
  font-size: 14px;
  margin: 0;
  padding-bottom: 7px;
  text-transform: uppercase;
`;

export const StyledSchemeColors = styled.div`
  div {
    height: 21px;
  }
`;

export const StyledCustomSchemeButtonWrapper = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
`;

export const StyledCustomSchemeWrapper = styled.fieldset`
  margin-top: 20px;
  border: 0;

  legend {
    margin-bottom: 10px;
    color: #393f44;
    font-weight: 700;
    font-size: 13px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    ${StyledColorInput} {
      margin: 0 5px 10px;
      margin-bottom: 10px;
      flex-basis: calc((100% / 3) - (20px / 3));

      &:nth-of-type(3n + 1) {
        margin-left: 0;
      }

      &:nth-of-type(3n + 3) {
        margin-right: 0;
      }

      &:last-of-type {
        margin-right: auto;
      }
    }
  }
`;
