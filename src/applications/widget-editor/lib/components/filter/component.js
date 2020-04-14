import React from "react";
import { FiltersService } from "@packages/core";
import InputGroup from "../../styles-common/input-group";
import { Button } from "@packages/shared";
import uniqueId from "lodash/uniqueId"; // FieldsService

import { DEFAULT_RANGE_FILTER, DEFAULT_VALUE_FILTER, TYPE_RANGE, TYPE_COLUMNS, TYPE_INDICATOR, TYPE_VALUE, COLUMN_FILTER_GROUP, TYPE_FILTER_ON_VALUES, FILTER_NUMBER_INDICATOR_TYPES, FILTER_STRING_INDICATOR_TYPES, STRING_TYPES, NUMBER_TYPES } from "./const";
import NotNullInput from "./components/NotNullInput";
import FilterRange from "./components/FilterRange";
import FilterValue from "./components/FilterValue";
import FilterColumn from "./components/FilterColumn";
import FilterStrings from "./components/FilterStrings";
import FilterIndicator from "./components/FilterIndicator";
import AddSection from "./components/AddSection";
import { StyledFilterBox, StyledEmpty, StyledFilterSection, StyledFilter, StyledDeleteBox } from "./style";

const Filter = ({
  dataService,
  setFilters,
  filters = [],
  fields = [],
  configuration,
  dataset
}) => {
  const availableColumns = fields.map(field => {
    return {
      label: field.metadata && field.metadata.alias ? field.metadata.alias : field.columnName.replace(/_/gi, " "),
      value: field.columnName,
      dataType: field.type
    };
  });

  const setData = async (values, id, type) => {
    const patch = await FiltersService.patchFilters(filters, {
      values,
      id,
      type
    }, configuration, dataset, fields);
    setFilters({
      list: patch
    }); // XXX: Update Data Service with applied filters

    dataService.requestWithFilters(patch, configuration);
  };

  const addFilter = () => {
    const patch = [...filters, { ...COLUMN_FILTER_GROUP,
      id: uniqueId("we-filter-")
    }];
    setFilters({
      list: patch
    });
  };

  const removeFilter = id => {
    const patch = filters.filter(f => f.id !== id) || [];
    setFilters({
      list: patch
    });
  };

  return React.createElement(StyledFilterBox, null, React.createElement(AddSection, {
    addFilter: addFilter
  }), !filters.length && React.createElement(StyledEmpty, null, "No filters found. Please, add them."), filters.map(filter => React.createElement(StyledFilterSection, {
    key: filter.id
  }, React.createElement(InputGroup, {
    noMargins: true
  }, React.createElement(FilterColumn, {
    filter: filter,
    setData: setData,
    optionData: availableColumns
  }), React.createElement(StyledDeleteBox, null, React.createElement(Button, {
    type: "highlight",
    onClick: () => removeFilter(filter.id)
  }, "Delete"))), filter.column !== null && React.createElement(StyledFilter, null, NUMBER_TYPES.indexOf(filter.indicator) > -1 && React.createElement(InputGroup, {
    noMargins: filter.indicator === TYPE_RANGE
  }, React.createElement(FilterIndicator, {
    filter: filter,
    disabled: filter.column === null,
    setData: setData,
    optionData: FILTER_NUMBER_INDICATOR_TYPES
  })), STRING_TYPES.indexOf(filter.indicator) > -1 && React.createElement(InputGroup, null, React.createElement(FilterIndicator, {
    filter: filter,
    disabled: filter.column === null,
    setData: setData,
    optionData: FILTER_STRING_INDICATOR_TYPES
  })), STRING_TYPES.indexOf(filter.indicator) > -1 && React.createElement(InputGroup, null, filter.indicator === TYPE_FILTER_ON_VALUES && React.createElement(FilterStrings, {
    filter: filter,
    setData: setData,
    optionData: filter.fieldInfo
  }), filter.indicator !== TYPE_FILTER_ON_VALUES && React.createElement(FilterValue, {
    isNumeric: false,
    filter: filter,
    setData: setData
  })), NUMBER_TYPES.indexOf(filter.indicator) > -1 && React.createElement(InputGroup, null, filter.indicator === TYPE_RANGE && React.createElement(FilterRange, {
    disabled: filter.column === null,
    filter: filter,
    setData: setData
  }), filter.indicator === TYPE_VALUE && React.createElement(FilterValue, {
    disabled: filter.column === null,
    filter: filter,
    setData: setData
  })), React.createElement(NotNullInput, {
    filter: filter,
    name: `filter-not-null-${filter.id}`,
    label: "Not null values",
    setData: setData
  })))));
};

export default Filter;