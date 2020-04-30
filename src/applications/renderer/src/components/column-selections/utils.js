export const resolveLabel = (namedTitle, option) => {
  const resolveFromOption = () => {
    if (option.alias) {
      return option.alias;
    }
    if (option.name) {
      return option.name;
    }
    return option.identifier;
  };

  return !!namedTitle ? namedTitle : resolveFromOption();
};
