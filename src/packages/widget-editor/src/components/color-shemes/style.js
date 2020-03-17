import styled, { css } from 'styled-components';

export const StyledShemesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  margin-left: -5px;
  margin-right: -5px;

  * {
    box-sizing: border-box;
  }
`;
export const StyledShemesCard = styled.div`
  width: 33.333%;  
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 5px;
  padding-left: 5px;
  input  {
    display: none;
  }
`;

export const StyledCardBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100px;
  border: ${props => props.active ? '2px solid #C32D7B' : '1px solid rgba(202,204,208,0.85)'};
  border-radius: 4px;
  background-color: rgba(255,255,255,0);
  padding: 15px 18px;

  &:hover {
    border: 2px solid #C32D7B;
    cursor: pointer;
  }
`;

export const StyledShemeInfo = styled.div`

`;

export const StyledShemeName = styled.div`
  font-size: 14px;
  margin: 0;
  padding-bottom: 7px;
  text-transform: uppercase;
`;


export const StyledShemeColors = styled.div`
  div {
    height: 21px;
  }
`;