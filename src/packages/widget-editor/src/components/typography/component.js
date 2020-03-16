import React from 'react';
import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import Select from "react-select";

export const InputStyles = {
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

const Typography = ({ theme }) => {

  const {
    selectedScheme,
    font,
    titleSize,
    captionSize,
    axisTitleSize,
    schemes,
  } = theme;

  const handleChange = option => {
    // patchConfiguration({ chartType: option.value });
  };

  const options = [
    { value: 'value-1', label: 'Value-1' },
    { value: 'value-2', label: 'Value-2' },
  ];

  return (
    <div>
        <FormLabel htmlFor="options-title">Font</FormLabel>
        <Select
          onChange={handleChange}
          options={options}
          styles={InputStyles}
        />
        <br />
        <FlexContainer row={true}>
          <InputGroup>
            <FormLabel htmlFor="options-title">Title size</FormLabel>
            <Input />
          </InputGroup>
          <InputGroup>
            <FormLabel htmlFor="options-title">Caption size</FormLabel>
            <Input />
          </InputGroup>
          <InputGroup>
            <FormLabel htmlFor="options-title">Axis title size</FormLabel>
            <Input />
          </InputGroup>
        </FlexContainer>      
    </div>
  );
}



export default Typography;