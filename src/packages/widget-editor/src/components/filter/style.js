import styled from 'styled-components';

export const StyledFilterBox = styled.div`
  position: relative;

  * {
    box-sizing: border-box;
  }
  input {
    box-sizing: border-box !important;
  }
`;

export const StyledEmpty = styled.div`
  max-width: 300px;
  margin: 0 auto;
  display: flex; 
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const StyledFilterSection = styled.div`
  padding: 30px 0 30px 30px;
  border-left: 1px solid rgba(26,28,34,0.1);
  position: relative;
  label {
    text-transform: capitalize;
  }
`;

export const StyledDeleteBox = styled.div`
  position: absolute;
  right: 0;
  top: 15px;

  button {
    font-size: 12px;
    padding: 7px 10px;
  }
`;