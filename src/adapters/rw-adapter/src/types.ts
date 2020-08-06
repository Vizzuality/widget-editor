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