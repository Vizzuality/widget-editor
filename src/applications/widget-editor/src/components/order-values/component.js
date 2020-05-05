import React from "react";

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
    background: "#FFF",
    borderRadius: "4px",
    padding: "3px 0",
  }),
  option: (base) => ({
    ...base,
  }),
};

const ORDER_TYPES = [
  { label: "Asc", value: "asc" },
  { label: "Desc", value: "desc" },
];

const OrderValues = ({ orderBy, columns, setFilters, onChange }) => {
  const options = columns.map((c) => ({
    value: c.name || c.alias || c.identifier,
    label: c.name || c.alias || c.identifier,
  }));

  const selectedOption = options.find((o) =>
    orderBy ? o.label === orderBy.name : null
  );

  let selectedOrder;
  if (orderBy && orderBy.orderType) {
    selectedOrder = ORDER_TYPES.find((o) => o.value === orderBy.orderType);
  } else {
    selectedOrder = ORDER_TYPES[0];
  }

  const handleChange = (option, changeOrder = null) => {
    const findSelected = option
      ? columns.find((c) => c.name === option.value)
      : {};
    setFilters({
      orderBy: {
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
        <FormLabel htmlFor="options-title">Order by</FormLabel>
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

export default OrderValues;
