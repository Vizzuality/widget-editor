import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { CategoryIcon, NumberIcon, DateIcon, UnknownIcon } from '@widget-editor/shared';
import AGGREGATION_OPTIONS from "@widget-editor/shared/lib/constants/aggregations";
import {
  StyledTableBox,
  StyledTable,
  StyledTr,
  StyledTh,
  StyledTd,
} from "./style";

const TableView = ({ widgetData, value, category, color, aggregateFunction }) => {
  const aggregation = useMemo(() => aggregateFunction
    ? AGGREGATION_OPTIONS.find(o => o.value === aggregateFunction)?.label
    : null,
  [aggregateFunction]);

  const columns = useMemo(() => (
    [category, value, color]
      .map((column, index) => column ? { ...column, isValue: index === 1 } : null)
      .filter(column => !!column)
      .reduce((res, column) => {
        let Icon;
        switch (column.type) {
          case 'string':
            Icon = CategoryIcon;
            break;
          case 'number':
            Icon = NumberIcon;
            break;
          case 'date':
            Icon = DateIcon;
            break;
          default:
            Icon = UnknownIcon;
        }

        const name = column.alias || column.name;

        return {
          ...res,
          [
            // The user may use the same column for the X and Y axis, but applying an aggregation
            // on the Y
            // In that case, we want to have a different key so both column headers effectively
            // appear 
            column.isValue && aggregation
              ? `${column.name}_${aggregation}`
              : column.name
          ]: {
            name: column.isValue && aggregation ? `${name} (${aggregation})` : name,
            Icon,
          }
        };
      }, {})
  ), [value, category, color, aggregation]);

  return (
    <StyledTableBox>
      <StyledTable>
        <thead>
          <StyledTr>
            {Object.keys(columns).map(column => {
              const Icon = columns[column].Icon;
              
              return (
                <StyledTh key={column}>
                  <Icon /> {columns[column].name}
                </StyledTh>
              );
            })}
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
