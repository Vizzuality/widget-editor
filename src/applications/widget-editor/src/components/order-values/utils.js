import { columnLabelFormatter } from "@widget-editor/shared";

/**
 * Return the option label formatter for the order by select
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

  return columnLabelFormatter(...rest);
};
