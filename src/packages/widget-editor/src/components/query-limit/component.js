import React, { useState, useEffect } from "react";
import Slider from "components/slider";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import Input from "styles-common/input";

const QueryLimit = ({ theme, limit: storeLimit, patchConfiguration }) => {
  const [limit, setLimit] = useState(`${storeLimit}`);
  const debounceLimit = useDebounce(limit, 500);

  const handleChange = e => {
    setLimit(e.target.value);
  };

  const handleOnChange = value => {
    setLimit(value);
  };

  useEffect(() => {
    if (debounceLimit !== storeLimit && debounceLimit !== null) {
      patchConfiguration({ limit: debounceLimit });
    }
  }, [debounceLimit]);

  return (
    <FlexContainer>
      <FormLabel htmlFor="options-limit">Limit</FormLabel>
      <Slider onChange={handleOnChange} value={limit} />
      <Input
        type="number"
        name="options-limit"
        min="1"
        max="500"
        value={limit}
        onChange={e => handleOnChange(e.target.value)}
      />
    </FlexContainer>
  );
};

export default QueryLimit;
