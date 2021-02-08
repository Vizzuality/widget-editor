import * as Dataset from './dataset';

export type Id = string | null;

export type Provider = string;
export interface Payload {
  id: Id;
  name: string;
  description: string;
  datasetId: Dataset.Id;
  provider: Provider;
  default: boolean;
  tileUrl?: string; // Needed by NexGDDP and GEE layers only
  layerConfig: { [key: string]: unknown };
  legendConfig: { [key: string]: unknown };
  interactionConfig: { [key: string]: unknown };
}