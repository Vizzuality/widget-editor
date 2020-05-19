import * as Generic from "./generic";

export interface Service {
  prepareSelectStatement(): void;
  resolveAggregate(column: string): void;
  prepareFilters(): void;
  prepareGroupBy(): void;
  prepareOrderBy(): void;
  prepareOrder(): void;
  prepareLimit(): void;
  requestWidgetData(): Promise<Generic.ObjectPayload>;
}
