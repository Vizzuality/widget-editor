import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";

import { Select } from "@widget-editor/shared";
import AGGREGATION_OPTIONS from "@widget-editor/shared/lib/constants/aggregations";

import { formatOptionLabel } from "./utils";
import { StyledBottomSelect, StyledLeftSelect, SelectStyles } from "./style";

const ColumnSelections = ({
  compact,
  columns,
  configuration,
  patchConfiguration,
}) => {
  const { chartType, xAxisTitle, yAxisTitle, aggregateFunction } = configuration;

  const selectedCategory = useMemo(() => {
    const columnName = configuration?.category?.name;
    return columns.find(column => column.value === columnName);
  }, [configuration, columns]);

  const selectedValue = useMemo(() => {
    const columnName = configuration?.value?.name;
    return columns.find(column => column.value === columnName);
  }, [configuration, columns]);

  const onChangeCategory = option => patchConfiguration({
    category: {
      ...configuration.category,
      name: option.value,
      type: option.type,
      alias: option.label !== option.value ? option.label : undefined,
    },
  });

  const onChangeValue = option => patchConfiguration({
    value: {
      ...configuration.value,
      name: option.value,
      type: option.type,
      alias: option.label !== option.value ? option.label : undefined,
    },
  });

  const reverse = ["bar", "line", "scatter", "stacked-bar"].indexOf(chartType) > -1;
  const isPieOrDonut = chartType === "pie" || chartType === "donut";
  const aggregation = aggregateFunction
    ? AGGREGATION_OPTIONS.find(o => o.value === aggregateFunction)?.label
    : null;

  return (
    <Fragment>
      {isPieOrDonut && (
        <StyledBottomSelect hasYAxis={false}>
          <Select
            id="renderer-value-column-1"
            aria-label="Select value"
            value={selectedValue}
            options={columns}
            onChange={onChangeValue}
            formatOptionLabel={(...props) => formatOptionLabel(yAxisTitle, null, ...props)}
            placeholder="Value"
            position="bottom"
            styles={SelectStyles}
          />
        </StyledBottomSelect>
      )}

      {/* -- Vertical select column */}

      {!isPieOrDonut && (
        <Fragment>
          {!reverse && (
            <StyledLeftSelect>
              <Select
                id="renderer-category-column"
                aria-label="Select category"
                value={selectedCategory}
                options={columns}
                onChange={onChangeCategory}
                formatOptionLabel={(...props) => formatOptionLabel(xAxisTitle, null, ...props)}
                placeholder="Category"
                position="left"
                styles={SelectStyles}
              />
            </StyledLeftSelect>
          )}

          {reverse && (
            <StyledLeftSelect>
              <Select
                id="renderer-value-column"
                aria-label="Select value"
                value={selectedValue}
                options={columns}
                onChange={onChangeValue}
                formatOptionLabel={
                  (...props) => formatOptionLabel(yAxisTitle, aggregation, ...props)
                }
                placeholder="Value"
                position="left"
                styles={SelectStyles}
              />
            </StyledLeftSelect>
          )}

          {/* -- END Vertical select column */}

          {/* -- Horizontal select column */}

          {!reverse && (
            <StyledBottomSelect hasYAxis>
              <Select
                id="renderer-value-column"
                aria-label="Select value"
                value={selectedValue}
                options={columns}
                onChange={onChangeValue}
                formatOptionLabel={
                  (...props) => formatOptionLabel(yAxisTitle, aggregation, ...props)
                }
                placeholder="Value"
                position="bottom"
                styles={SelectStyles}
              />
            </StyledBottomSelect>
          )}

          {reverse && (
            <StyledBottomSelect hasYAxis>
              <Select
                id="renderer-category-column"
                aria-label="Select category"
                value={selectedCategory}
                options={columns}
                onChange={onChangeCategory}
                formatOptionLabel={(...props) => formatOptionLabel(xAxisTitle, null, ...props)}
                placeholder="Category"
                position="bottom"
                styles={SelectStyles}
              />
            </StyledBottomSelect>
          )}

          {/* -- END Horizontal select column */}
        </Fragment>
      )}
    </Fragment>
  );
};

ColumnSelections.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    type: PropTypes.string,
  })).isRequired,
}

export default ColumnSelections;
