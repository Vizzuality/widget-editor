import styled from 'styled-components';

export const StyledBox = styled.div`
  box-sizing: border-box;
  padding: 7px 8px;
  width: 50%;
`;

export const StyledIcon = styled.div`
  box-sizing: border-box;
  height: 51px;
  width: 100%;
  border: ${props => props.active ? '2px solid #C32D7B' : '1px solid #E6E6E6'};
  border-radius: 4px;
  background-color: #F7F7F7;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    border: 2px solid #C32D7B;
  }
`;