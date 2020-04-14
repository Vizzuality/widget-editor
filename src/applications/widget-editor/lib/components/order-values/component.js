import React, { useState, useEffect } from "react";
import find from "lodash/find";
import Select from "react-select";
import FlexContainer from "../../styles-common/flex";
import FormLabel from "../../styles-common/form-label";
import InputGroup from "../../styles-common/input-group";
const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  }),
  option: base => ({ ...base
  })
};
const ORDER_TYPES = [{
  label: "Ascending",
  value: "asc"
}, {
  label: "Descending",
  value: "desc"
}];

const OrderValues = ({
  orderBy,
  columns,
  setFilters,
  onChange
}) => {
  const options = columns.map(c => ({
    value: c.name || c.alias || c.identifier,
    label: c.name || c.alias || c.identifier
  }));
  const selectedOption = options.find(o => orderBy ? o.label === orderBy.name : null);
  const definedOrder = orderBy && orderBy.orderType ? find(ORDER_TYPES, {
    value: orderBy.orderType.toLowerCase()
  }) : ORDER_TYPES[0];
  const [orderType, setOrderType] = useState(definedOrder ? definedOrder : ORDER_TYPES[0]);

  const handleChange = (option, type) => {
    let findSelected;

    if (type === "orderByType") {
      findSelected = orderBy;
      setOrderType(option);
    } else {
      findSelected = columns.find(c => c.name === option.value);
    }

    setFilters({
      orderBy: findSelected
    });
    onChange({ ...findSelected,
      orderType: type === "orderByType" ? option.value : orderType.value
    });
  };

  return React.createElement(FlexContainer, null, React.createElement(InputGroup, null, React.createElement(FormLabel, {
    htmlFor: "options-title"
  }, "Order by"), React.createElement(Select, {
    onChange: option => handleChange(option, "column"),
    value: selectedOption,
    options: options,
    styles: InputStyles
  })));
};

export default OrderValues;