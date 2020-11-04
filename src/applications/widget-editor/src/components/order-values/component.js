import React, { useCallback } from "react";
import PropTypes from 'prop-types';

import { Select } from "@widget-editor/shared";
import AGGREGATION_OPTIONS from "@widget-editor/shared/lib/constants/aggregations";

import ToggleOrder from "components/toggle-order";

import FlexContainer from "styles-common/flex";
import FlexController from "styles-common/flex-controller";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

import { formatOptionLabel } from "./utils";

const ORDER_TYPES = [
  { label: "Asc", value: "asc" },
  { label: "Desc", value: "desc" },
];

const OrderValues = ({
  orderBy,
  columns,
  aggregateFunction,
  valueColumn,
  setFilters,
  patchConfiguration,
}) => {
  const selectedOrderByOption = orderBy
    ? columns.find(option => option.value === orderBy.name)
    : null;

  let selectedOrder;
  if (orderBy && orderBy.orderType) {
    selectedOrder = ORDER_TYPES.find((o) => o.value === orderBy.orderType);
  } else {
    selectedOrder = ORDER_TYPES[0];
  }

  const aggregation = aggregateFunction
    ? AGGREGATION_OPTIONS.find(o => o.value === aggregateFunction)?.label
    : null;

  const onChangeOrderBy = useCallback(option => {
    let data;
    if (!option) {
      data = { orderBy: null };
    } else {
      data = {
        orderBy: {
          name: option.value,
          type: option.type,
          alias: option.label !== option.value ? option.label : undefined,
          orderType: ORDER_TYPES[0].value,
        },
      };
    }

    setFilters(data);
    patchConfiguration(data);
  }, [setFilters, patchConfiguration]);

  const onChangeOrderType = useCallback(option => {
    let data;
    if (!selectedOrderByOption) {
      data = { orderBy: null };
    } else {
      data = {
        orderBy: {
          name: selectedOrderByOption.value,
          type: selectedOrderByOption.type,
          alias: selectedOrderByOption.label !== selectedOrderByOption.value
            ? selectedOrderByOption.label
            : undefined,
          orderType: option.value,
        }
      };
    }

    setFilters(data);
    patchConfiguration(data);
  }, [selectedOrderByOption, setFilters, patchConfiguration]);

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-order-title">Order by</FormLabel>
        <FlexContainer row={true}>
          <FlexController grow="1" constrainElement="100">
            <Select
              formatOptionLabel={(...props) => formatOptionLabel(
                // The aggregation is only applied to the value column
                valueColumn?.name === selectedOrderByOption?.value ? aggregation : null, ...props
              )}
              id="options-order-title"
              value={selectedOrderByOption}
              options={columns}
              onChange={onChangeOrderBy}
              isClearable
            />
          </FlexController>
          <FlexController shrink="0">
            <ToggleOrder
              options={ORDER_TYPES}
              order={selectedOrder}
              onChange={onChangeOrderType}
            />
          </FlexController>
        </FlexContainer>
      </InputGroup>
    </FlexContainer>
  );
};

OrderValues.propTypes = {
  patchConfiguration: PropTypes.func,
  setFilters: PropTypes.func,
  orderBy: PropTypes.string,
  aggregateFunction: PropTypes.string,
  valueColumn: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object)
}

export default OrderValues;
