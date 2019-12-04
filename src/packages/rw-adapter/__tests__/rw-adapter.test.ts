import RwAdapter from "../src";

test("rw adapter test", () => {
  const adapter = new RwAdapter("hello");

  expect(adapter.print()).toEqual("hello");
});
