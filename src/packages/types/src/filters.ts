import * as Generic from './generic';

export interface Service {
  prepareSelectStatement(): void;
  prepareAggregate(): void;
  prepareFilters(): void;
  prepareGroupBy(): void;
  prepareOrderBy(): void;
  prepareOrder(): void;
  prepareLimit(): void;
  requestWidgetData(): Promise<Generic.ObjectPayload>;
}

