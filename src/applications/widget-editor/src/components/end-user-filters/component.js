import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Select, columnLabelFormatter } from '@widget-editor/shared';
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import { InfoCallout } from './style';

const EndUserFilters = ({
  columnOptions,
  endUserFilters,
  setEndUserFilters,
  patchConfiguration,
}) => {
  const value = useMemo(
    () => endUserFilters.map(endUserFilter => columnOptions.find(f => f.value === endUserFilter)),
    [columnOptions, endUserFilters],
  );

  const onChangeColumns = useCallback((options) => {
    setEndUserFilters((options ?? []).map(({ value }) => value));
    patchConfiguration();
  }, [patchConfiguration, setEndUserFilters]);

  return (
    <div>
      <InfoCallout>
        End-user filters are filters that are embedded in the visualization and thus filters that 
        the end-user can interact with outside of the widget editor.
      </InfoCallout>
      <InputGroup>
        <FormLabel htmlFor="end-user-filter-columns">Columns with filter</FormLabel>
        <Select
          isMulti
          formatOptionLabel={columnLabelFormatter}
          id="end-user-filter-columns"
          name="end-user-filter-columns"
          placeholder="Select columns"
          value={value}
          options={columnOptions}
          onChange={onChangeColumns}
        />
      </InputGroup>
    </div>
  );
};

EndUserFilters.propTypes = {
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  endUserFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  setEndUserFilters: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

export default EndUserFilters;