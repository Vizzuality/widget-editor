import styled from "styled-components";

export const StyledFilterBox = styled.div`
  position: relative;
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
  padding: 10px 0;
  position: relative;
  label {
    text-transform: capitalize;
  }
`;

export const StyledFilter = styled.div`
  padding: 15px 0 0 20px;
  margin: 0 0 0 10px;
  border-left: 1px solid #d2d3d6;
`;

export const StyledDeleteBox = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50px, -50%);

  button {
    font-size: 12px;
    padding: 7px 10px;
    border: none;
    font-weight: 500;
  }
`;
