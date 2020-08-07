import React, { useMemo, useCallback } from "react";
import Select from "react-select";
import uniqueId from "lodash/uniqueId";

import { FiltersService, constants } from "@widget-editor/core";
import { Button } from "@widget-editor/shared";

import InputGroup from "styles-common/input-group";
import { DEFAULT_FILTER_VALUE } from "./const";
import NotNullInput from "./components/NotNullInput";
import NumberFilter from './components/number-filter';
import DateFilter from './components/date-filter';
import StringFilter from './components/string-filter';

import {
  StyledFilterBox,
  StyledEmpty,
  StyledAddSection,
  StyledFilterSection,
  StyledFilter,
  StyledDeleteBox,
} from "./style";

const Filter = ({
  dataService,
  setFilters,
  patchConfiguration,
  filters = [],
  fields = [],
  configuration,
  dataset,
}) => {
  const columnOptions = useMemo(() => {
    const usedColumns = filters.map(filter => filter.column).filter(column => !!column);

    return fields
      .map(field => ({
        label:
          field.metadata && field.metadata.alias
            ? field.metadata.alias
            : field.columnName,
          value: field.columnName,
          type:
            constants.ALLOWED_FIELD_TYPES.find(type => type.name === field.type)?.type ?? 'string',
          isDisabled: usedColumns.indexOf(field.columnName) !== -1,
        }))
      .sort((option1, option2) => option1.label.localeCompare(option2.label))
  }, [filters, fields]);

  const canAddFilter = useMemo(
    () => filters.length < fields.length && filters.every(filter => filter.column),
    [filters, fields]
  );

  const addFilter = useCallback(() => setFilters({
    list: [
      ...filters,
      { ...DEFAULT_FILTER_VALUE, id: uniqueId("we-filter-") },
    ],
  }), [filters, setFilters]);

  const updateFilter = useCallback(async (filterId, change) => {
    const patch = await Promise.all(filters.map(async filter => {
      if (filter.id !== filterId) {
        return filter;
      }

      return {
        ...filter,
        ...change,
        config: !filter.column
          ? await FiltersService.fetchConfiguration(dataset, fields, change.column)
          : filter.config,
      };
    }));

    // We update the filter with its new values
    setFilters({ list: patch });
    // TODO: State proxy could handle this data refresh
    dataService.requestWithFilters(patch, configuration);
    // Let the state proxy know that this update occurred
    patchConfiguration();
  }, [configuration, dataService, dataset, fields, filters, setFilters]);


  const removeFilter = useCallback((id) => {
    const patch = filters.filter(filter => filter.id !== id);

    setFilters({ list: patch });
    dataService.requestWithFilters(patch, configuration);
  }, [configuration, dataService, filters, setFilters]);

  return (
    <StyledFilterBox>
      <StyledAddSection>
        <Button size="small" onClick={addFilter} disabled={!canAddFilter}>
          Add filter
        </Button>
      </StyledAddSection>

      {!filters.length && (
        <StyledEmpty>
          Click "Add filter" to start filtering the data.
        </StyledEmpty>
      )}

      {filters.map((filter) => (
        <StyledFilterSection key={filter.id}>
          <InputGroup noMargins={true}>
            <Select
              placeholder="Select column"
              value={columnOptions.find(({ value }) => value === filter.column)}
              options={columnOptions}
              onChange={
                ({ value, type }) => updateFilter(filter.id, { column: value, type })
              }
              isDisabled={!!filter.column}
            />

            <StyledDeleteBox>
              <Button type="highlight" onClick={() => removeFilter(filter.id)}>
                Delete
              </Button>
            </StyledDeleteBox>
          </InputGroup>

          {filter.column !== null && (
            <StyledFilter>
              {filter.type === 'number' && (
                <NumberFilter
                  filter={filter}
                  onChange={change => updateFilter(filter.id, change)}
                />
              )}

              {filter.type === 'date' && (
                <DateFilter
                  filter={filter}
                  onChange={change => updateFilter(filter.id, change)}
                />
              )}

              {filter.type === 'string' && (
                <StringFilter
                  filter={filter}
                  onChange={change => updateFilter(filter.id, change)}
                />
              )}

              <NotNullInput
                filter={filter}
                onChange={notNull => updateFilter(filter.id, { notNull })}
              />
            </StyledFilter>
          )}
        </StyledFilterSection>
      ))}
    </StyledFilterBox>
  );
};

export default Filter;
