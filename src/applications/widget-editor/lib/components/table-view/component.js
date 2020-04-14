import React from 'react';
import { StyledTableBox, StyledTable, StyledTr, StyledTh, StyledTd } from "./style";

const TableView = ({
  widgetData,
  configuration
}) => {
  const {
    value: {
      alias: valueAlias
    },
    category: {
      alias: categoryAlias
    }
  } = configuration;
  return React.createElement(StyledTableBox, null, React.createElement(StyledTable, null, React.createElement("thead", null, React.createElement(StyledTr, null, React.createElement(StyledTh, null, categoryAlias), React.createElement(StyledTh, null, valueAlias))), React.createElement("tbody", null, widgetData && widgetData.map((el, key) => React.createElement(StyledTr, {
    key: key
  }, React.createElement(StyledTd, null, el.x), React.createElement(StyledTd, {
    center: true
  }, el.y))))));
};

export default TableView;