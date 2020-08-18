import { Vega } from "@widget-editor/types";
import { getLocalCache } from "@widget-editor/widget-editor/lib/exposed-hooks"
import { selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";
import { selectEndUserFilters } from "@widget-editor/shared/lib/modules/end-user-filters/selectors";
import { selectFields } from '@widget-editor/shared/lib/modules/editor/selectors';
import { constants, FieldsService } from '@widget-editor/core';

export default class ChartCommon {
  protected schema: Vega.Schema;

  constructor(protected store: any) { }

  isDate() {
    const { configuration } = this.store;
    return configuration.category?.type === 'date';
  }

  resolveName(axis: 'x' | 'y' | 'color') {
    const { configuration, editor } = this.store;
    const { xAxisTitle, yAxisTitle } = configuration;

    if (axis === 'x' && xAxisTitle) {
      return xAxisTitle;
    }

    if (axis === 'y' && yAxisTitle) {
      return yAxisTitle;
    }

    let fieldIdentifier;
    if (axis === 'x') {
      fieldIdentifier = 'category';
    } else if (axis === 'y') {
      fieldIdentifier = 'value';
    } else {
      fieldIdentifier = 'color';
    }

    const fieldName = configuration[fieldIdentifier]?.name;
    const field = editor.fields?.find(f => f.columnName === fieldName);

    const name = field?.metadata?.alias
      ? field.metadata.alias
      : fieldName;

    if (axis === 'y' && configuration.aggregateFunction) {
      return `${name} (${configuration.aggregateFunction})`;
    }

    return name;
  }

  resolveFormat(axis: 'x' | 'y') {
    const { configuration, editor: { widgetData } } = this.store;

    // The Y axis is 100% determined by the format the user choose in the UI
    if (axis === 'y') {
      return configuration.format || 's';
    }

    // The X axis' format depends on the type of the column
    if (configuration.category?.type === 'date') {
      const timestamps = widgetData.map((d: any) => +(new Date(d.x)));

      const min = Math.min(...timestamps);
      const max = Math.max(...timestamps);

      // If some of the dates couldn't be parsed, we return null
      if (Number.isNaN(min) || Number.isNaN(max)) {
        return null;
      }

      // Number of milliseconds in a...
      const day = 1000 * 60 * 60 * 24;
      const month = 31 * day;
      const year = 12 * month;

      if (max - min <= 2 * day) {
        return '%H:%M'; // ex: 10:00
      } else if (max - min <= 2 * month) {
        return '%d %b'; // ex: 20 Jul
      } else if (max - min <= 2 * year) {
        return '%b %Y'; // ex: Jul 2017
      }

      return '%Y'; // ex: 2017
    } else if (configuration.category?.type === 'number') {
      const allIntegers = widgetData.length
        && widgetData.every((d: any) => parseInt(d.x, 10) === d.x);
      if (allIntegers) {
        return 'd';
      }
    }

    return '.2f';
  }

  resolveScheme() {
    const scheme = selectScheme(this.store);
    return getLocalCache().adapter.getSerializedScheme(scheme);
  }

  async resolveSignals(): Promise<any[]> {
    const { editor: { dataset } } = this.store;

    const endUserFilters: string[] = selectEndUserFilters(this.store);
    const fields: any[] = selectFields(this.store);

    const fieldService = new FieldsService(dataset, fields);

    const promises = await endUserFilters.map(async (fieldName) => {
      const field = fields.find(f => f.columnName === fieldName);
      const type = constants.ALLOWED_FIELD_TYPES.find(type => type.name === field.type)?.type
        ?? 'string';

      const signal = {
        name: field.metadata && field.metadata.alias ? field.metadata.alias : field.columnName,
        value: null,
        bind: {},
      };

      switch (type) {
        case 'string': {
          const options = await fieldService.getColumnValues(field);
          signal.value = options.length ? options[0] : null;
          signal.bind = {
            input: 'select',
            options,
          };
          break;
        }

        case 'number': {
          const { min, max } = await fieldService.getColumnMinAndMax(field);
          signal.value = min;
          signal.bind = {
            input: 'range',
            min,
            max,
            step: 0.1,
          };
          break;
        }

        case 'date': {
          const { min, max } = await fieldService.getColumnMinAndMax(field);
          signal.value = new Date(min).toISOString().split('T')[0];
          signal.bind = {
            input: 'date',
            min: new Date(min).toISOString().split('T')[0],
            max: new Date(max).toISOString().split('T')[0],
          };
          break;
        }
      };

      return signal;
    });

    return Promise.all(promises).catch(() => []);
  }

  resolveEndUserFiltersTransforms(): { [key: string]: any }[] {
    const endUserFilters: string[] = selectEndUserFilters(this.store);
    const fields: any[] = selectFields(this.store);

    if (!endUserFilters.length) {
      return [];
    }

    return [
      {
        type: 'filter',
        expr: endUserFilters.reduce((res, fieldName, index) => {
          const field = fields.find(f => f.columnName === fieldName);
          const signal = field.metadata && field.metadata.alias
            ? field.metadata.alias
            : field.columnName;
          const type = constants.ALLOWED_FIELD_TYPES.find(type => type.name === field.type)?.type
            ?? 'string';

          return `${res}${index > 0 ? ' && ' : ''}${type === 'date' ? `toDate(datum.${fieldName})` : `datum.${fieldName}`} === ${type === 'date' ? `toDate(${signal})` : signal}`;
        }, ''),
      }
    ];
  }
}

