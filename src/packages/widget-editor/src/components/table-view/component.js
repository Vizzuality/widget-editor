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
        <StyledTr>
          <StyledTh>{categoryAlias}</StyledTh>
          <StyledTh>{valueAlias}</StyledTh>
        </StyledTr>
          {widgetData && widgetData.map(el => (
            <StyledTr>
              <StyledTd>{el.x}</StyledTd>
              <StyledTd center>{el.y}</StyledTd>
            </StyledTr>
          ))}
      </StyledTable>
    </StyledTableBox>
  );
}

export default TableView;