import React, { useCallback } from "react";
import PropTypes from 'prop-types';

import { JSTypes } from "@widget-editor/types";
import { utils } from '@widget-editor/core';
import { Select } from "@widget-editor/shared";

import {
  StyledContainer,
  StyledColorsBoxContainer,
  StyledColorsBox,
  StyledColorDot,
  StyledDropdownBox,
  SelectStyles,
} from "./style";

// XXX: Move me
function resolveLabel(label, type) {
  if (type === 'date') {
    return utils.parseDate(label);
  }

  return label;
}

const Legend = ({
  widget,
  advanced,
  configuration,
  scheme,
  selectedColumn,
  columns,
  patchConfiguration,
  compact,
}) => {
  const isPie = configuration.chartType === "pie";
  const multipleItems = widget?.legend?.[0]?.values.length > 0;

  const handleChange = useCallback((option) => {
    const newOption = option.value === "_single_color"
      ? null
      : {
        name: option.value,
        type: option.type,
        alias: option.label !== option.value ? option.label : undefined,
      };

    if (isPie) {
      patchConfiguration({ category: newOption });
    } else {
      patchConfiguration({ color: newOption });
    }
  }, [isPie, patchConfiguration]);

  return (
    <StyledContainer compact={compact}>
      <StyledColorsBoxContainer alignCenter={!multipleItems}>
          {!multipleItems && !advanced && (
            <StyledColorsBox alignCenter={false}>
              <StyledColorDot color={scheme.mainColor} />
              Single color
            </StyledColorsBox>
          )}
          {multipleItems && widget.legend[0].values.map((item, index) => (
            <StyledColorsBox
              title={resolveLabel(item.label, item.type) || '−'}
              alignCenter={true}
              key={`${item.label}-${index}`}
            >
              <StyledColorDot color={item.value} />
              {resolveLabel(item.label, item.type) || '−'}
            </StyledColorsBox>
          ))}
      </StyledColorsBoxContainer>
      {!advanced && (
        <StyledDropdownBox>
          <Select
            id="legend"
            value={selectedColumn}
            options={columns}
            onChange={handleChange}
            styles={SelectStyles}
          />
        </StyledDropdownBox>
      )}
    </StyledContainer>
  );
};

Legend.propTypes = {
  patchConfiguration: PropTypes.func,
  configuration: JSTypes.configuration,
  advanced: PropTypes.bool,
  compact: PropTypes.any,
  scheme: PropTypes.shape({
    mainColor: PropTypes.string
  }),
  selectedColumn: JSTypes.select.value,
  columns: JSTypes.select.options,
  widget: JSTypes.widget
}

export default Legend;
