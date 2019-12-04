type Url = string | null;
type Env = string | null;
type Applications = [string] | null;
type Includes = [string] | null;
type AuthUrl = string | null;
type AssetsPath = string | null;
type UserToken = string | null;
type UserEmail = string | null;
type Locale = string;

interface ConfigurationSchema {
  url?: Url;
  env?: Env;
  applications?: Applications;
  authUrl?: AuthUrl;
  assetsPath?: AssetsPath;
  userToken?: UserToken;
  userEmail?: UserEmail;
  locale: Locale;
}

export default interface Config {
  config: ConfigurationSchema;
  setConfig(params: object | null): void;
  getConfig(): ConfigurationSchema;
}
