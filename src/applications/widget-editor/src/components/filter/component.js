import React, { useMemo, useCallback } from "react";
import uniqueId from "lodash/uniqueId";

import { FiltersService } from "@widget-editor/core";
import { Button, Select, columnLabelFormatter } from "@widget-editor/shared";

import { getLocalCache } from "exposed-hooks";

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
  setFilters,
  patchConfiguration,
  filters = [],
  fields = [],
  columnOptions,
  dataset,
}) => {
  const canAddFilter = useMemo(
    () => filters.length < columnOptions.length && filters.every(filter => filter.column),
    [filters, columnOptions]
  );

  const addFilter = useCallback(() => setFilters({
    list: [
      ...filters,
      { ...DEFAULT_FILTER_VALUE, id: uniqueId("we-filter-") },
    ],
  }), [filters, setFilters]);

  const updateFilter = useCallback(async (filterId, change) => {
    const { adapter } = getLocalCache();

    const patch = await Promise.all(filters.map(async filter => {
      if (filter.id !== filterId) {
        return filter;
      }

      return {
        ...filter,
        ...change,
        config: !filter.column
          ? await FiltersService.fetchConfiguration(adapter, dataset, fields, change.column)
          : filter.config,
      };
    }));

    // We update the filter with its new values
    setFilters({ list: patch });
    // Let the state proxy know that this update occurred
    patchConfiguration();
  }, [dataset, fields, filters, patchConfiguration, setFilters]);


  const removeFilter = useCallback((id) => {
    const patch = filters.filter(filter => filter.id !== id);

    setFilters({ list: patch });
  }, [filters, setFilters]);

  return (
    <StyledFilterBox>
      <StyledAddSection>
        <Button btnType="highlight" size="small" onClick={addFilter} disabled={!canAddFilter}>
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
              formatOptionLabel={columnLabelFormatter}
              id={`filter-column-${filter.id}`}
              aria-label="Select a column"
              placeholder="Select a column"
              value={columnOptions.find(({ value }) => value === filter.column)}
              options={columnOptions}
              onChange={
                ({ value, type }) => updateFilter(filter.id, { column: value, type })
              }
              disabled={!!filter.column}
            />

            <StyledDeleteBox>
              <Button btnType="highlight" size="small" onClick={() => removeFilter(filter.id)}>
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
