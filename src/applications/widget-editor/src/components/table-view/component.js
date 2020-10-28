import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { CategoryIcon, NumberIcon, DateIcon, UnknownIcon } from '@widget-editor/shared';
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

        return {
          ...res,
          [column.name]: {
            name: column.alias || column.name,
            Icon,
          }
        };
      }, {})
  ), [value, category, color]);

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
