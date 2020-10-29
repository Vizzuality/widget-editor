import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { showFullTable, getAggregationName, getRelevantColumns } from "./helpers";
import {
  StyledTableBox,
  StyledTable,
  StyledTr,
  StyledTh,
  StyledTd,
} from "./style";

const TableView = ({
  widgetData,
  tableData,
  columnOptions,
  value,
  category,
  color,
  aggregateFunction
}) => {
  const fullTable = useMemo(() => showFullTable(category, value), [value, category]);
  const aggregation = useMemo(() => getAggregationName(aggregateFunction), [aggregateFunction]);

  // These are the colunms we want to show in the table
  const relevantColumns = useMemo(
    () => getRelevantColumns(category, value, color, aggregation, columnOptions),
    [category, value, color, aggregation, columnOptions]
  );

  return (
    <StyledTableBox>
      <StyledTable>
        <thead>
          <StyledTr>
            {Object.keys(relevantColumns).map(key => {
              const column = relevantColumns[key];
              const Icon = column.Icon;
              const name = `
                ${column.alias || column.name}
                ${column.aggregation ? ` (${column.aggregation})`: ''}
              `;
              
              return (
                <StyledTh key={key}>
                  <Icon /> {name}
                </StyledTh>
              );
            })}
          </StyledTr>
        </thead>
        <tbody>
          {(fullTable ? tableData : widgetData).map((row, index) => (
            <StyledTr key={index}>
              {Object.keys(relevantColumns).map(
                column => <StyledTd key={column}>{row[column]}</StyledTd>
              )}
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
  tableData: PropTypes.array.isRequired,
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
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
