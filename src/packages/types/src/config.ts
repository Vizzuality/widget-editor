type Url = string | null;
type Env = string | null;
type Applications = [string] | null;
type AuthUrl = string | null;
type AssetsPath = string | null;
type UserToken = string | null;
type UserEmail = string | null;
type Locale = string;

// Needs to be generic, as a custom adapter can in theory contain any payload
// The types needs to be defined within the adapter itself
export type Payload = any;

export interface Service {
  config: Payload;
  setConfig(params: object | null): void;
  getConfig(): Payload;
}
