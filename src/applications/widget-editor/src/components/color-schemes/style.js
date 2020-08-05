import styled from "styled-components";

export const StyledSchemesContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  margin-left: -5px;
  margin-right: -5px;
  padding-top: 10px;

  * {
    box-sizing: border-box;
  }
`;
export const StyledSchemesCard = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 5px;
  padding-left: 5px;
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
