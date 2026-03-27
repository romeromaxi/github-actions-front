export const getValueInDictionaryIfExists = (
  value: string,
  dictionaryWithEnumerationKeys: { [key: number]: string },
) => {
  return value ? dictionaryWithEnumerationKeys[value as any] : '';
};
