import * as Dataset from './dataset';

export type Id = string | null;

export type Provider = string;

export interface Payload {
  id: Id;
  attributes: {
    name: string;
    slug: string;
    dataset: Dataset.Id;
    provider: string;
  };
}