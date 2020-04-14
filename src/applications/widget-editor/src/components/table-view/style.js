import styled from 'styled-components';

export const StyledTableBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const StyledTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  padding: 0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(26,28,34,.1);
  font-size: 14px;
  margin-bottom: 20px;
`;

export const StyledTr = styled.tr`
    background-color: #fff;
    box-sizing: border-box;
`;

export const StyledTd = styled.td`
  width: 100%;
  padding: 20px;
  text-align: ${props => props.center ? 'center' : 'left'};
`;

export const StyledTh = styled.td`
  position: relative;
  font-size: 14px;
  color: #393f44;
  font-weight: 700;
  white-space: nowrap;
  padding: 20px;
`;