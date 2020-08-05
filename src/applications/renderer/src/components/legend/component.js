import React, { useCallback } from "react";
import { utils } from '@widget-editor/core';
import { Select } from "@widget-editor/shared";

import {
  StyledContainer,
  StyledColorsBoxContainer,
  StyledColorsBox,
  StyledColorDot,
  StyledDropdownBox,
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
  selectedColor,
  columns,
  patchConfiguration,
  compact,
}) => {
  const isPie = configuration.chartType === "pie";
  const multipleItems = widget?.legend?.[0]?.values.length > 0;

  const handleChange = useCallback((option) => {
    const color = option.identifier === "___single_color" ? null : option;

    if (isPie) {
      patchConfiguration({ category: color });
    } else {
      patchConfiguration({ color });
    }
  }, [isPie, patchConfiguration]);

  return (
    <StyledContainer compact={compact}>
      <StyledColorsBoxContainer overflowIsHidden={multipleItems} alignCenter={!multipleItems}>
          {!multipleItems && (
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
            align="horizontal"
            relative={true}
            menuPlacement="top"
            value={selectedColor}
            onChange={handleChange}
            getOptionLabel={(option) => option.alias || option.name}
            getOptionValue={(option) => option.identifier}
            options={columns}
            configuration={configuration}
            isCustom
            isPopup
          />
        </StyledDropdownBox>
      )}
    </StyledContainer>
  );
};

export default Legend;
