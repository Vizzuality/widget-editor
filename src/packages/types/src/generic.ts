export type ObjectPayload = object[];
export type Dispatcher = (payload: ObjectPayload) => void;
export type Action = (payload: ObjectPayload) => void;
