import * as Generic from "./generic";

export interface Service {
  prepareSelectStatement(): void;
  resolveAggregate(column: string): void;
  prepareFilters(): void;
  prepareGroupBy(): void;
  prepareOrderBy(): void;
  prepareLimit(): void;
  getQuery(): string;
  getAdditionalParams(): { [key: string]: unknown };
}

type GenericFilter<T> = {
  id: string;
  column: string;
  type: string;
  value: T | T[];
  operation: string;
  notNull: boolean;
  config?: any;
};

export type NumberFilter = GenericFilter<number> & {
  type: 'number';
}

export type DateFilter = GenericFilter<Date> & {
  type: 'date';
};

export type StringFilter = GenericFilter<string> & {
  type: 'string';
};

export type Filter = NumberFilter | DateFilter | StringFilter;

type GenericSerializedFilter<T> = {
  name: string;
  type: string;
  value: T | T[];
  operation?: string;
  notNull: boolean;
};

type NumberSerializedFilter = GenericSerializedFilter<number> & {
  type: 'number';
}

type DateSerializedFilter = GenericSerializedFilter<string> & {
  type: 'date';
};

type StringSerializedFilter = GenericSerializedFilter<string> & {
  type: 'string';
};

export type SerializedFilter = NumberSerializedFilter | DateSerializedFilter | StringSerializedFilter;

export type EndUserFilter = string[];
