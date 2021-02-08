import * as Filters from '@widget-editor/types/build/filters';
import * as Dataset from '@widget-editor/types/build/dataset';
import FiltersService from '../services/filters';
import { Adapter } from '@widget-editor/types';

/**
 * Serialize the editor's filters for the widgetConfig
 * @param filters Filters
 */
export const getSerializedFilters = (filters: Filters.Filter[]): Filters.SerializedFilter[] => {
  const getSerializedValue = ({ type, value }) => {
    if (type === 'date') {
      if (Array.isArray(value)) {
        return value.map(date => date.toISOString());
      }

      return value.toISOString();
    }

    return value;
  };

  const hasValue = ({ value }) => value !== undefined && value !== null;

  return filters
    .filter(filter => hasValue(filter) || filter.notNull)
    .map(filter => ({
      name: filter.column,
      type: filter.type,
      operation: filter.operation,
      value: hasValue(filter)
        ? getSerializedValue(filter)
        : null,
      notNull: filter.notNull,
    }));
};

/**
 * Deserialize the filters for for the widget-editor's application
 * @param adapter Adapter
 * @param filters Serialized filters
 * @param fields Dataset's fields
 * @param dataset Dataset object
 */
export const getDeserializedFilters = async (
  adapter: Adapter.Service,
  filters: Filters.SerializedFilter[],
  fields: Dataset.Field[],
  dataset: Dataset.Payload
): Promise<Filters.Filter[]> => {
  if (!filters || !Array.isArray(filters) || filters.length === 0) {
    return [];
  }

  return await FiltersService.getDeserializedFilters(adapter, filters, fields, dataset);
};