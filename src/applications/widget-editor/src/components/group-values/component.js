import React, { useState } from "react";
import find from "lodash/find";

import Select from "react-select";

import ToggleOrder from "components/toggle-order";

import FlexContainer from "styles-common/flex";
import FlexController from "styles-common/flex-controller";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    background: "#FFF",
    padding: "3px 0",
  }),
  option: (base) => ({
    ...base,
  }),
};

const ORDER_TYPES = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const GroupValues = ({ groupBy, columns, setFilters, onChange }) => {
  const options = columns.map((c) => ({
    value: c.name || c.alias || c.identifier,
    label: c.name || c.alias || c.identifier,
  }));

  const selectedOption = options.find((o) =>
    groupBy ? o.label === groupBy.name : null
  );

  let selectedOrder;
  if (groupBy && groupBy.orderType) {
    selectedOrder = ORDER_TYPES.find((o) => o.value === groupBy.orderType);
  } else {
    selectedOrder = ORDER_TYPES[0];
  }

  const handleChange = (option, changeOrder = null) => {
    const findSelected = columns.find((c) => c.name === option.value);
    setFilters({
      groupBy: {
        ...findSelected,
        orderType: changeOrder || selectedOrder.value,
      },
    });
    onChange({
      ...findSelected,
      orderType: changeOrder || findSelected.orderType,
    });
  };

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-title">Group by</FormLabel>
        <FlexContainer row={true}>
          <FlexController contain={90}>
            <Select
              onChange={(option) => handleChange(option)}
              value={selectedOption}
              options={options}
              styles={InputStyles}
            />
          </FlexController>
          <FlexController contain={10}>
            <ToggleOrder
              options={ORDER_TYPES}
              order={selectedOrder}
              onChange={(option) => {
                handleChange(selectedOption, option.value);
              }}
            />
          </FlexController>
        </FlexContainer>
      </InputGroup>
    </FlexContainer>
  );
};

export default GroupValues;
