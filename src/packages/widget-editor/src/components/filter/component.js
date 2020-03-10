import React from 'react';
import FormLabel from 'styles-common/form-label';
import InputGroup from 'styles-common/input-group';
import Button from 'components/button';
import {
  DEFAULT_RANGE_FILTER,
  DEFAULT_VALUE_FILTER,
  DEFAULT_COLUMNS_FILTER,
  TYPE_RANGE,
  TYPE_COLUMNS,
  TYPE_VALUE
} from './const';
import FilterRange from './components/FilterRange';
import FilterValue from './components/FilterValue';
import FilterColumn from './components/FilterColumn';
import AddSection from './components/AddSection';
import {
  StyledFilterBox,
  StyledEmpty,
  StyledFilterSection,
  StyledDeleteBox
} from './style';

const Filter = ({ patchConfiguration, filters = [], fields = [] }) => {

  const optionData = Object.keys(fields).map(field => {
    return {
      label: field.replace(/_/gi,' '),
      value: field,
    };
  })

  const setData = (values, id) => {
    const allFilters = [...filters];
    const filterData = allFilters[id];
    filterData['values'] = values;
    allFilters[id] = filterData;
    patchConfiguration({
      filters: allFilters
    })
  }

  const addFilter = (filter = TYPE_RANGE) => {
    const isFilter = filters.find(f => f.type === filter);
    if (!isFilter) {
      let filterData;
      if (filter === TYPE_RANGE) {
        filterData = DEFAULT_RANGE_FILTER;
      } else if (filter === TYPE_VALUE) {
        filterData = DEFAULT_VALUE_FILTER;
      } else if (filter === TYPE_COLUMNS) {
        filterData = DEFAULT_COLUMNS_FILTER;
      }
      patchConfiguration({
        filters: [...filters, filterData]
      });
    }
  }

  const removeFilter = (filter = TYPE_RANGE) => {
    const newFilters = filters.filter(f => f.type !== filter) || [];
    patchConfiguration({
      filters: newFilters
    });
  }

  return (
    <StyledFilterBox>
      
      <AddSection
        addFilter={addFilter}
        removeFilter={removeFilter}
        filters={filters}
      />
      
      {!filters.length && (
        <StyledEmpty>
          No filters found. Please, add them.
        </StyledEmpty>
      )}

      {filters.map((filter, filterId) => (
        <StyledFilterSection key={filterId}>
          <InputGroup>
            <FormLabel htmlFor="options-title">{filter.indicator}</FormLabel>
            <StyledDeleteBox>
              <Button type="highlight" onClick={() => removeFilter(filter.type)}>
                Delete
              </Button>
            </StyledDeleteBox> 

            {filter.type === TYPE_RANGE && (
              <FilterRange 
                id={filterId} 
                filter={filter}
                setData={setData} 
              />
            )}

            {filter.type === TYPE_VALUE && (
              <FilterValue 
                id={filterId} 
                filter={filter}
                setData={setData} 
              />
            )}

            {filter.type === TYPE_COLUMNS && (
              <FilterColumn 
                id={filterId}
                filter={filter}
                setData={setData}
                optionData={optionData}
              />
            )}
          </InputGroup>
        </StyledFilterSection>
      ))}
    </StyledFilterBox>
  );
}

export default Filter;