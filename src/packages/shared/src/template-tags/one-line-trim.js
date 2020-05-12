function oneLineTrim(string, ...expressions) {
  let withSpace = string.reduce(
    (result, string, i) => result + expressions[i - 1] + string
  );
  let withoutSpace = withSpace.replace(/\s\s+/g, "");
  return withoutSpace;
}

export default oneLineTrim;
