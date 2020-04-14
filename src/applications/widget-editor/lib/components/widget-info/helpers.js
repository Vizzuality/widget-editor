export const hasUpdate = (dispatchedValue, originalValue) => {
  return dispatchedValue !== originalValue && dispatchedValue !== null;
};