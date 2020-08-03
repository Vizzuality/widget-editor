import React from "react";

import { FiltersService } from "@widget-editor/core";

import InputGroup from "styles-common/input-group";
import { Button } from "@widget-editor/shared";
import uniqueId from "lodash/uniqueId";

// FieldsService

import {
  TYPE_RANGE,
  TYPE_VALUE,
  COLUMN_FILTER_GROUP,
  TYPE_FILTER_ON_VALUES,
  FILTER_NUMBER_INDICATOR_TYPES,
  FILTER_STRING_INDICATOR_TYPES,
  STRING_TYPES,
  NUMBER_TYPES,
} from "./const";

import NotNullInput from "./components/NotNullInput";
import FilterRange from "./components/FilterRange";
import FilterValue from "./components/FilterValue";
import FilterColumn from "./components/FilterColumn";
import FilterStrings from "./components/FilterStrings";
import FilterIndicator from "./components/FilterIndicator";
import AddSection from "./components/AddSection";

import {
  StyledFilterBox,
  StyledEmpty,
  StyledFilterSection,
  StyledFilter,
  StyledDeleteBox,
} from "./style";

const Filter = ({
  dataService,
  setFilters,
  filters = [],
  fields = [],
  configuration,
  dataset,
}) => {
  const availableColumns = fields.map((field) => {
    return {
      label:
        field.metadata && field.metadata.alias
          ? field.metadata.alias
          : field.columnName.replace(/_/gi, " "),
      value: field.columnName,
      dataType: field.type,
    };
  });

  const setData = async (values, id, type) => {
    const patch = await FiltersService.patchFilters(
      filters,
      { values, id, type },
      configuration,
      dataset,
      fields
    );

    setFilters({
      list: patch,
    });
    // XXX: Update Data Service with applied filters
    dataService.requestWithFilters(patch, configuration);
  };

  const addFilter = () => {
    const patch = [
      ...filters,
      { ...COLUMN_FILTER_GROUP, id: uniqueId("we-filter-") },
    ];
    setFilters({
      list: patch,
    });
  };

  const removeFilter = (id) => {
    const patch = filters.filter((f) => f.id !== id) || [];
    setFilters({
      list: patch,
    });
  };

  return (
    <StyledFilterBox>
      <AddSection addFilter={addFilter} />
      {!filters.length && (
        <StyledEmpty>
          Click "Add filter" to start filtering the data.
        </StyledEmpty>
      )}

      {filters.map((filter) => (
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
          {filter.column !== null && (
            <StyledFilter>
              {NUMBER_TYPES.indexOf(filter.indicator) > -1 && (
                <InputGroup noMargins={filter.indicator === TYPE_RANGE}>
                  <FilterIndicator
                    filter={filter}
                    disabled={filter.column === null}
                    setData={setData}
                    optionData={FILTER_NUMBER_INDICATOR_TYPES}
                  />
                </InputGroup>
              )}

              {STRING_TYPES.indexOf(filter.indicator) > -1 && (
                <InputGroup>
                  <FilterIndicator
                    filter={filter}
                    disabled={filter.column === null}
                    setData={setData}
                    optionData={FILTER_STRING_INDICATOR_TYPES}
                  />
                </InputGroup>
              )}

              {STRING_TYPES.indexOf(filter.indicator) > -1 && (
                <InputGroup>
                  {filter.indicator === TYPE_FILTER_ON_VALUES && (
                    <FilterStrings
                      filter={filter}
                      setData={setData}
                      optionData={filter.fieldInfo}
                    />
                  )}

                  {filter.indicator !== TYPE_FILTER_ON_VALUES && (
                    <FilterValue
                      isNumeric={filter.dataType.toLowerCase() !== 'string'}
                      filter={filter}
                      setData={setData}
                    />
                  )}
                </InputGroup>
              )}

              {NUMBER_TYPES.indexOf(filter.indicator) > -1 && (
                <InputGroup>
                  {filter.indicator === TYPE_RANGE && (
                    <FilterRange
                      disabled={filter.column === null}
                      filter={filter}
                      setData={setData}
                    />
                  )}

                  {filter.indicator === TYPE_VALUE && (
                    <FilterValue
                      isNumeric={filter.dataType.toLowerCase() !== 'string'}
                      disabled={filter.column === null}
                      filter={filter}
                      setData={setData}
                    />
                  )}
                </InputGroup>
              )}
              <NotNullInput
                filter={filter}
                name={`filter-not-null-${filter.id}`}
                label="Not null values"
                setData={setData}
              />
            </StyledFilter>
          )}
        </StyledFilterSection>
      ))}
    </StyledFilterBox>
  );
};

export default Filter;
