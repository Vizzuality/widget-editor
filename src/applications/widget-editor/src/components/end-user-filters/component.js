import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { constants } from '@widget-editor/core';
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import { InfoCallout } from './style';

const EndUserFilters = ({
  fields: serializedFields,
  endUserFilters,
  setEndUserFilters,
  patchConfiguration,
}) => {
  const fields = useMemo(
    () => serializedFields
      .map(field => ({
        label:
          field.metadata && field.metadata.alias ? field.metadata.alias : field.columnName,
          value: field.columnName,
          type:
            constants.ALLOWED_FIELD_TYPES.find(type => type.name === field.type)?.type ?? 'string',
        }))
      .sort((option1, option2) => option1.label.localeCompare(option2.label)),
    [serializedFields],
  );

  const value = useMemo(
    () => endUserFilters.map(endUserFilter => fields.find(f => f.value === endUserFilter)),
    [fields, endUserFilters],
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
          id="end-user-filter-columns"
          name="end-user-filter-columns"
          placeholder="Select columns"
          value={value}
          options={fields}
          onChange={onChangeColumns}
        />
      </InputGroup>
    </div>
  );
};

EndUserFilters.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  endUserFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  setEndUserFilters: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

export default EndUserFilters;