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

const getTypeIcon = (type) => {
  let Icon;
  switch (type) {
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

  return Icon;
}

const TableView = ({ widgetData, value, category, color, aggregateFunction }) => {
  const aggregation = useMemo(() => aggregateFunction
    ? AGGREGATION_OPTIONS.find(o => o.value === aggregateFunction)?.label
    : null,
  [aggregateFunction]);

  // These are the colunms we want to show in the table
  const relevantColumns = useMemo(() => {
    const columns = {
      x: category ? { ...category, Icon: getTypeIcon(category.type) } : null,
      y: value ? { ...value, Icon: getTypeIcon(value.type), aggregation } : null,
      color: color ? { ...color, Icon: getTypeIcon(color.type) } : null,
    };

    // We remove the columns that are not set by the user
    Object.keys(columns).forEach(key => {
      if (!columns[key]) {
        delete columns[key];
      }
    });

    // If the user has chosen the same column for the X and Y axis, and there is not an aggregation,
    // we avoid displaying the column twice in the table
    if (columns.x?.name && columns.x?.name === columns.y?.name && !aggregation) {
      delete columns.y;
    }

    // If the user has chosen the same column for the X axis and color, or the user has chosen the
    // same column for the Y axis and color and there is not an aggregation, we also remove the
    // color column to avoid displaying it twice in the table
    if ((columns.x?.name && columns.x?.name === columns.color?.name)
      || (columns.y?.name && columns.y?.name === columns.color?.name && !aggregation)) {
      delete columns.color;
    }

    return columns;
  }, [category, value, color, aggregation]);

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
          {widgetData.map((row, index) => (
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
