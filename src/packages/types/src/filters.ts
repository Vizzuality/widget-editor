import * as Generic from "./generic";

export interface Service {
  prepareSelectStatement(): void;
  resolveAggregate(column: string): void;
  prepareFilters(): void;
  prepareGroupBy(): void;
  prepareOrderBy(): void;
  prepareLimit(): void;
  getDeserializedFilters(filters: any[], fields: any[], dataset: any): Promise<any[]>;
  requestWidgetData(): Promise<Generic.ObjectPayload>;
}
