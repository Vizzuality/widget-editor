import styled from "styled-components";

export const StyledTableBox = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid rgba(26, 28, 34, 0.1);
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.09);
  overflow: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  padding: 15px 30px;

  // The two following properties are required to make the padding work
  border-spacing: 0;
  border-collapse: separate;

  font-size: 16px;
  color: #393f44;
  text-align: left;
`;

export const StyledTr = styled.tr`
  td {
    // Because of border-collapse (see StyledTable) the border needs to be applied to the td
    border-bottom: 1px solid rgba(210, 211, 214, 0.5)
  }
`;

export const StyledTd = styled.td`
  padding: 7px 20px 7px 0;
`;

export const StyledTh = styled.th`
  padding: 7px 0;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #d2d3d6;
`;
