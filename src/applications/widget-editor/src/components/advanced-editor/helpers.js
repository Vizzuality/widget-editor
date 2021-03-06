/**
 * Return the list of validation errors of the Vega JSON
 * @param {{ [prop: string]: any }} widgetConfig Widget config (Vega JSON)
 */
export const getValidationErrors = (widgetConfig) => {
  const validationErrors = [];

  // Since the user can modify the `config` object as they wish, we force its name to be
  // “user-config”
  if (widgetConfig.config !== null && widgetConfig.config !== undefined
    && widgetConfig.config.name !== 'user-custom') {
    validationErrors.push('The property config.name must have the value \'user-custom\'');
  }

  if (widgetConfig.paramsConfig !== null && widgetConfig.paramsConfig !== undefined) {
    validationErrors.push('The property paramsConfig is not allowed');
  }

  if (widgetConfig.we_meta !== null && widgetConfig.we_meta !== undefined) {
    // This key is generated by the editor itself, the user cannot manually edit it
    validationErrors.push('The property we_meta is not allowed');
  }

  if (widgetConfig.interaction_config !== null && widgetConfig.interaction_config !== undefined) {
    if (!Array.isArray(widgetConfig.interaction_config)
      || widgetConfig.interaction_config.some(o => typeof o !== 'object')) {
      validationErrors.push('The property interaction_config must be an array of objects or be omitted');
    } else {
      const tooltip = widgetConfig.interaction_config.find(({ name }) => name === 'tooltip');

      if (tooltip.config === null || tooltip.config === undefined) {
        validationErrors.push('The tooltip object in interaction_config must have a property named config');
      } else if (!Array.isArray(tooltip.config.fields)) {
        validationErrors.push('The tooltip object in interaction_config must have a property config.fields of type array');
      } else if (tooltip.config.fields.some(field => typeof field.column !== 'string'
        || typeof field.property !== 'string' || typeof field.type !== 'string')) {
        validationErrors.push('The tooltip object in interaction_config must contain an array config.fields containing the following string properties: column, property and type');
      }
    }
  }

  if (widgetConfig.legend !== null && widgetConfig.legend !== undefined) {
    if (!Array.isArray(widgetConfig.legend)
      || widgetConfig.legend.some(o => typeof o !== 'object')) {
      validationErrors.push('The property legend must be an array of objects or be omitted');
    } else if (widgetConfig.legend.length > 0) {
      const legend = widgetConfig.legend[0];
      if (!Array.isArray(legend.values)) {
        validationErrors.push('The first item of the array legend must contain the property values (array)');
      } else if (
        legend.values.some(
          v => (typeof v.label !== 'string' && typeof v.label !== 'number')
            || typeof v.value !== 'string' || typeof v.type !== 'string'
        )
      ) {
        validationErrors.push('The first item of the array legend must contain an array values containing the following properties: label (string or number), value (string) and type (string)');
      }
    }
  }

  return validationErrors;
};