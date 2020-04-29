let adapter;

export const setAdapter = (payload) => {
  adapter = payload;
}

export const getAdapter = () => {
  if (!!adapter) {
    console.error('Adapter not available');
  }
  return adapter;
}

