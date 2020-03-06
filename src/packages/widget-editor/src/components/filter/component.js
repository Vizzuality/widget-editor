import React, { useEffect, useState, useRef } from 'react';
import Button from 'components/button';
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import {
  DEFAULT_FILTERS,
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
import {
  StyledFilterBox,
  StyledAddSection,
  StyledAddModal,
  StyledIcons,
  StyledIconBox,
  StyledEmpty,
  StyledFilterSection
} from './style';

const Filter = ({ patchConfiguration, filters = [], fields = [] }) => {


  const [isAddModal, openAddModal] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      openAddModal(false);
    }
  }

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
    openAddModal(false);
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
        document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    <StyledFilterBox>
      <StyledAddSection>
        <Button
          size="small"
          onClick={() => openAddModal(!isAddModal)}
        >
          Add Filter
        </Button>
        {isAddModal && (
          <StyledAddModal ref={ref}>
            <StyledIcons>
              <StyledIconBox>
                <Button onClick={() => addFilter(TYPE_RANGE)}>
                  Range
                </Button>
              </StyledIconBox>
              <StyledIconBox>
                <Button onClick={() => addFilter(TYPE_VALUE)}>
                  Value
                </Button>
              </StyledIconBox>
              <StyledIconBox>
                <Button onClick={() => addFilter(TYPE_COLUMNS)}>
                  Select
                </Button>
              </StyledIconBox>
            </StyledIcons>
          </StyledAddModal>  
        )}
      </StyledAddSection>

      {!filters.length && (
        <StyledEmpty>
          No filters found. Please, add them.
        </StyledEmpty>
      )}

      {filters.map((filter, filterId) => (
        <StyledFilterSection key={filterId}>
          <InputGroup>
            <FormLabel htmlFor="options-title">{filter.indicator}</FormLabel>
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