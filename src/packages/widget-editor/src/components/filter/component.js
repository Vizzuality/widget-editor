import React from "react";

import { FiltersService } from "@packages/core";

import InputGroup from "styles-common/input-group";
import Button from "components/button";
import uniqueId from "lodash/uniqueId";

// FieldsService

import {
  DEFAULT_RANGE_FILTER,
  DEFAULT_VALUE_FILTER,
  TYPE_RANGE,
  TYPE_COLUMNS,
  TYPE_INDICATOR,
  TYPE_VALUE,
  COLUMN_FILTER_GROUP,
  FILTER_TYPES
} from "./const";

import FilterRange from "./components/FilterRange";
import FilterValue from "./components/FilterValue";
import FilterColumn from "./components/FilterColumn";
import FilterIndicator from "./components/FilterIndicator";
import AddSection from "./components/AddSection";

import {
  StyledFilterBox,
  StyledEmpty,
  StyledFilterSection,
  StyledFilter,
  StyledDeleteBox
} from "./style";

const Filter = ({
  setFilters,
  filters = [],
  fields = [],
  configuration,
  datasetId
}) => {
  const availableColumns = fields.map(field => {
    return {
      label:
        field.metadata && field.metadata.alias
          ? field.metadata.alias
          : field.columnName.replace(/_/gi, " "),
      value: field.columnName,
      dataType: field.type
    };
  });

  const setData = async (values, id, type) => {
    const patch = await FiltersService.patchFilters(
      filters,
      { values, id, type },
      configuration,
      datasetId,
      fields
    );

    setFilters({
      list: patch
    });
  };

  const addFilter = () => {
    setFilters({
      list: [...filters, { ...COLUMN_FILTER_GROUP, id: uniqueId("we-filter-") }]
    });
  };

  const removeFilter = id => {
    const newFilters = filters.filter(f => f.id !== id) || [];
    setFilters({
      list: newFilters
    });
  };

  return (
    <StyledFilterBox>
      <AddSection addFilter={addFilter} />
      {!filters.length && (
        <StyledEmpty>No filters found. Please, add them.</StyledEmpty>
      )}

      {filters.map(filter => (
        <StyledFilterSection key={filter.id}>
          <InputGroup noMargins={true}>
            <FilterColumn
              filter={filter}
              setData={setData}
              optionData={availableColumns}
            />
            <StyledDeleteBox>
              <Button type="highlight" onClick={() => removeFilter(filter.id)}>
                Delete
              </Button>
            </StyledDeleteBox>
          </InputGroup>
          <StyledFilter>
            <InputGroup noMargins={true}>
              <FilterIndicator
                filter={filter}
                disabled={filter.column === null}
                setData={setData}
                optionData={FILTER_TYPES}
              />
            </InputGroup>

            {filter.indicator === TYPE_RANGE && (
              <FilterRange
                disabled={filter.column === null}
                filter={filter}
                setData={setData}
              />
            )}

            {filter.indicator === TYPE_VALUE && (
              <FilterValue
                disabled={filter.column === null}
                filter={filter}
                setData={setData}
              />
            )}
          </StyledFilter>
        </StyledFilterSection>
      ))}
    </StyledFilterBox>
  );
};

export default Filter;
