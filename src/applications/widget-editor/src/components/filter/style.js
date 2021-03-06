import styled from "styled-components";

export const StyledFilterBox = styled.div`
  position: relative;
`;

export const StyledEmpty = styled.div`
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
`;

export const StyledAddSection = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
`;

export const StyledFilterSection = styled.div`
  padding: 10px 0;
  position: relative;
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
  transform: translate(-40px, -50%);

  button {
    font-size: 14px;
    border-color: transparent;
  }
`;
