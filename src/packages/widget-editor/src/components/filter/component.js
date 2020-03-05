import React, { useEffect } from 'react';
import { DEFAULT_FILTERS, TYPE_RANGE, TYPE_COLUMNS, TYPE_VALUE } from './const';
import FilterRange from './components/FilterRange';
import FilterValue from './components/FilterValue';
import { StyledFilterBox } from './style';

import Select from "react-select";

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  }),
  option: base => ({
    ...base
  })
};

const ORDER_OPTIONS = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" }
];

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

  useEffect(()=>{
    patchConfiguration({
      filters: DEFAULT_FILTERS
    })
  },[]);

  return (
    <StyledFilterBox>
      {filters.map((filter, filterId) => {

        return (
          <div key={filterId}>
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
              <Select 
                options={optionData}
              />
            )}
          </div>
        );
      })}
    </StyledFilterBox>
  );
}

export default Filter;