import { columnLabelFormatter } from "@widget-editor/shared";

/**
 * Return the option label formatter for the legend select
 * @param {string} aggregation Name of the aggregation applied to the column
 * @param  {...any} rest 
 */
export const formatOptionLabel = (aggregation, ...rest) => {
  const [, { context }] = rest;
  
  // We want to add the column aggregation in the name, if there is any
  if (aggregation && context === "value") {
    const [option, ...otherParams] = rest;
    const newOption = {
      ...option,
      label: `${option.label} (${aggregation})`,
    };
    return columnLabelFormatter(newOption, otherParams);
  }

  // If the option is the “Single color” one, we remove the icon that represents the type of the
  // column
  const [option, ...otherParams] = rest;
  if (option.value === "_single_color") {
    const newOption = {
      ...option,
      type: undefined,
    };
    return columnLabelFormatter(newOption, otherParams);
  }

  return columnLabelFormatter(...rest);
};
