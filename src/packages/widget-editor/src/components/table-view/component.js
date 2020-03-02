import React from 'react';

import { 
  StyledTableBox,
  StyledTable,
  StyledTr,
  StyledTh,
  StyledTd
} from './style';

const TableView = ({ widgetData, configuration }) => {

  const {
    value: { alias: valueAlias} ,
    category: { alias: categoryAlias } 
  } = configuration;

  return (
    <StyledTableBox>
      <StyledTable>
        <thead>
          <StyledTr>
            <StyledTh>{categoryAlias}</StyledTh>
            <StyledTh>{valueAlias}</StyledTh>
          </StyledTr>
        </thead>
        <tbody>
          {widgetData && widgetData.map((el, key) => (
            <StyledTr key={key}>
              <StyledTd>{el.x}</StyledTd>
              <StyledTd center>{el.y}</StyledTd>
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTableBox>
  );
}

export default TableView;