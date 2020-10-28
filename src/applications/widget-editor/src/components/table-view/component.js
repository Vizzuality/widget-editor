import React, { useMemo } from "react";
import PropTypes from "prop-types";

import {
  StyledTableBox,
  StyledTable,
  StyledTr,
  StyledTh,
  StyledTd,
} from "./style";

const TableView = ({ widgetData, value, category, color, aggregateFunction }) => {
  const columns = useMemo(() => (
    [category, value, color]
      .filter(column => !!column)
      .map(column => [column.name, column.alias || column.name])
      .reduce((res, column) => ({ ...res, [column[0]]: column[1] }), {})
  ), [value, category, color]);

  return (
    <StyledTableBox>
      <StyledTable>
        <thead>
          <StyledTr>
            {
              Object.keys(columns).map(
                column => <StyledTh key={column}>{columns[column]}</StyledTh>
              )
            }
          </StyledTr>
        </thead>
        <tbody>
          {widgetData.map((row, index) => (
            <StyledTr key={index}>
              <StyledTd>{row.x}</StyledTd>
              <StyledTd>{row.y}</StyledTd>
              {!!row.color && <StyledTd>{row.color}</StyledTd>}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTableBox>
  );
};

const ColumnType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  alias: PropTypes.string
});

TableView.propTypes = {
  widgetData: PropTypes.array.isRequired,
  value: ColumnType,
  category: ColumnType,
  color: ColumnType,
  aggregateFunction: PropTypes.string,
};

TableView.defaultProps = {
  value: null,
  category: null,
  color: null,
  aggregateFunction: null,
};

export default TableView;
