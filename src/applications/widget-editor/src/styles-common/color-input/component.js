import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import useDebounce from "hooks/use-debounce";

import Input from "styles-common/input";
import StyledColorInput from "./style";

const ColorInput = ({ id, pickerLabel, inputLabel, value, onChange }) => {
  const [color, setColor] = useState(value);

  const onChangeDebounced = useDebounce(onChange);

  const onChangeColor = useCallback((value) => {
    const trimmedValue = value.trim();
    const isValid = /^#[0-9A-Fa-f]{6}$/.test(trimmedValue);

    setColor(trimmedValue);

    if (isValid) {
      onChangeDebounced(trimmedValue);
    }
  }, [setColor, onChangeDebounced]);

  return (
    <StyledColorInput>
      <Input
        id={`color-input-${id}`}
        type="color"
        aria-label={pickerLabel}
        value={color}
        onChange={onChangeColor}
      />
      <Input
        id={`color-input-${id}`}
        type="text"
        aria-label={inputLabel}
        pattern="#[0-9A-Fa-f]{6}"
        value={color}
        onChange={onChangeColor}
      />
    </StyledColorInput>
  );
};

ColorInput.propTypes = {
  id: PropTypes.number.isRequired,
  pickerLabel: PropTypes.string.isRequired,
  inputLabel: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorInput;