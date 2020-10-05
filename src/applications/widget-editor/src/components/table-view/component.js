import React from "react";

import {
  StyledTableBox,
  StyledTable,
  StyledTr,
  StyledTh,
  StyledTd,
} from "./style";

const TableView = ({ widgetData, configuration }) => {
  const value = configuration?.value?.alias || configuration?.value?.name || "";
  const category = configuration?.category?.alias || configuration?.category?.name || "";

  return (
    <StyledTableBox>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh>{category}</StyledTh>
            <StyledTh>{value}</StyledTh>
          </StyledTr>
        </thead>
        <tbody>
          {widgetData &&
            widgetData.map((el, key) => (
              <StyledTr key={key}>
                <StyledTd>{el.x}</StyledTd>
                <StyledTd center>{el.y}</StyledTd>
              </StyledTr>
            ))}
        </tbody>
      </StyledTable>
    </StyledTableBox>
  );
};

export default TableView;
