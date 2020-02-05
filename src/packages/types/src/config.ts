type Url = string | null;
type Env = string | null;
type Applications = [string] | null;
type AuthUrl = string | null;
type AssetsPath = string | null;
type UserToken = string | null;
type UserEmail = string | null;
type Locale = string;

export interface Payload {
  url?: Url;
  env?: Env;
  applications?: Applications;
  authUrl?: AuthUrl;
  assetsPath?: AssetsPath;
  userToken?: UserToken;
  userEmail?: UserEmail;
  locale: Locale;
  category: { name: string };
  aggregateFunction?: string | null;
  groupBy?: { name: string };
  orderBy?: { name: string, orderType: string };
  limit: number;
  value: {
    datasetID?: string;
    name?: string;
    tableName?: string;
  };
}

export interface Service {
  config: Payload;
  setConfig(params: object | null): void;
  getConfig(): Payload;
}
