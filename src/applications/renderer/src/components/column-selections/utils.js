import { columnLabelFormatter } from "@widget-editor/shared";

/**
 * Return the option label formatter for the column selects
 * @param {string} label Label to display instead of the column name
 * @param {string} aggregation Name of the aggregation applied to the column
 * @param  {...any} rest 
 */
export const formatOptionLabel = (label, aggregation, ...rest) => {
  const [, { context }] = rest;

  // We display a custom label when the select is collapsed
  if (label && context === "value") {
    return label;
  }

  // When not using a custom label, we want to add the column aggregation in the same, if there is
  // any
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
