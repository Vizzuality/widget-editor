import styled from 'styled-components';

export const StyledAddSection = styled.div`
  position: absolute;
  top:-40px;
  right: 0;
`;

export const StyledAddModal = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 300px;
  height: 100px;
  background-color: white;
  z-index: 3;
  box-shadow: 0 1px 2px rgba(0,0,0,0.09);
  border-color: rgba(26,28,34,0.1);
  border-style: solid;
  border-width: 1px 1px 1px 1px;
`;

export const StyledIcons = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  padding: 10px;
`;

export const StyledIconBox = styled.div`
  width: 33.333%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
  opacity: ${props => props.disabled ? 0.3 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  button {
    height:100%;
  }
`;

