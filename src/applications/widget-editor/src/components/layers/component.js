import React from "react";

import Select from "react-select";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0",
  }),
  option: (base) => ({
    ...base,
  }),
};

const generateOptions = (layers) => {
  if (!layers) {
    return [];
  }
  return layers.map((l) => ({
    label: l.attributes.name,
    value: l.id,
  }));
};

const Layers = ({ editor, configuration, patchConfiguration }) => {
  const { layers = null } = editor;
  const options = generateOptions(layers);
  const selectedOption = options.find((o) => o.value === configuration.layer);

  const handleChange = (option) => {
    patchConfiguration({
      layer: option.value,
    });
  };

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-title">Layers</FormLabel>
        <Select
          onChange={(option) => handleChange(option)}
          value={selectedOption || options[0]}
          options={options}
          styles={InputStyles}
        />
      </InputGroup>
    </FlexContainer>
  );
};

export default Layers;
