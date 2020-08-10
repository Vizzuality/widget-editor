export const FILTER_NUMBER_OPERATIONS = [
  { label: 'Between', value: 'between' },
  { label: 'Not between', value: 'not-between' },
  { label: 'Greater than', value: '>' },
  { label: 'Greater than or equal to', value: '>=' },
  { label: 'Less than', value: '<' },
  { label: 'Less than or equal to', value: '<=' },
  { label: 'Is equal to', value: '=' },
  { label: 'Is not equal to', value: '!=' }
];

export const FILTER_DATE_OPERATIONS = [
  { label: 'Between', value: 'between' },
  { label: 'Not between', value: 'not-between' },
  { label: 'Greater than', value: '>' },
  { label: 'Greater than or equal to', value: '>=' },
  { label: 'Less than', value: '<' },
  { label: 'Less than or equal to', value: '<=' },
  { label: 'Is equal to', value: '=' },
  { label: 'Is not equal to', value: '!=' }
];

export const FILTER_STRING_OPERATIONS = [
  { label: 'Filter by values', value: 'by-values' },
  { label: 'Text contains', value: 'contains' },
  { label: 'Text does not contain', value: 'not-contain' },
  { label: 'Text starts with', value: 'starts-with' },
  { label: 'Text ends with', value: 'ends-with' },
  { label: 'Text is exactly', value: '=' },
  { label: 'Text is not', value: '!=' }
];

export const DEFAULT_FILTER_VALUE = {
  column: null,
  type: null,
  operation: null,
  value: null,
  notNull: false,
  config: null,
};
