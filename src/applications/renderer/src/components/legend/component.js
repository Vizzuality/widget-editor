import React, { useCallback } from "react";

import { utils } from '@widget-editor/core';
import { Select } from "@widget-editor/shared";
import AGGREGATION_OPTIONS from "@widget-editor/shared/lib/constants/aggregations";

import {
  StyledContainer,
  StyledColorsBoxContainer,
  StyledColorsBox,
  StyledColorDot,
  StyledDropdownBox,
  SelectStyles,
} from "./style";

import { formatOptionLabel } from './utils';

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
  aggregateFunction,
  valueColumn,
  patchConfiguration,
  compact,
}) => {
  const isPie = configuration.chartType === "pie";
  const multipleItems = widget?.legend?.[0]?.values.length > 0;
  const aggregation = aggregateFunction
    ? AGGREGATION_OPTIONS.find(o => o.value === aggregateFunction)?.label
    : null;

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
      <StyledColorsBoxContainer overflowIsHidden={multipleItems} alignCenter={!multipleItems}>
          {!multipleItems && !advanced && (
            <StyledColorsBox alignCenter={false}>
              <StyledColorDot color={scheme.mainColor} />
              Single color
            </StyledColorsBox>
          )}
          {multipleItems && widget.legend[0].values.map((item, index) => (
            <StyledColorsBox alignCenter={true} key={`${item.label}-${index}`}>
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
            formatOptionLabel={(...props) => formatOptionLabel(
              // The aggregation is only applied to the value column
              valueColumn?.name === selectedColumn?.value ? aggregation : null, ...props
            )}
            styles={SelectStyles}
          />
        </StyledDropdownBox>
      )}
    </StyledContainer>
  );
};

export default Legend;
