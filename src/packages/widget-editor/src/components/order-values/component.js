import React, { useState, useEffect } from "react";
import find from "lodash/find";

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

const OrderValues = ({ orderBy, patchConfiguration }) => {
  const [order, setOrder] = useState(
    find(ORDER_OPTIONS, { value: orderBy.orderType })
  );

  useEffect(() => {
    if (orderBy.orderType !== order.value) {
      setOrder(find(ORDER_OPTIONS, { value: orderBy.orderType }));
    }
  }, [orderBy, order.value]);

  const handleChange = option => {
    patchConfiguration({
      orderBy: {
        ...orderBy,
        orderType: option.value
      }
    });
  };

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-title">Ascending or Descending</FormLabel>
        <Select
          onChange={handleChange}
          value={order}
          options={ORDER_OPTIONS}
          styles={InputStyles}
        />
      </InputGroup>
    </FlexContainer>
  );
};

export default OrderValues;
