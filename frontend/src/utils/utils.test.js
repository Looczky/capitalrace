import shuffle, { normalize, isCorrect, formatTime } from "./utils";

test("accepts whitespace, diacritics and both languages without accepting partial answers", () => {
  expect(normalize("  ŁÓDŹ  ")).toBe("lodz");
  const country = { capital: "Kiszyniów", englishCapital: "Chisinau" };
  expect(isCorrect(" KISZYNIOW ", country)).toBe(true);
  expect(isCorrect("chisinau", country)).toBe(true);
  expect(isCorrect("Kisz", country)).toBe(false);
  expect(isCorrect("", country)).toBe(false);
});
test("shuffle preserves source data and all members", () => {
  const source = Object.freeze([1, 2, 3, 4]);
  expect(shuffle(source).sort()).toEqual([1, 2, 3, 4]);
  expect(shuffle(source)).not.toBe(source);
});
test("formats elapsed times longer than one hour", () => {
  expect(formatTime(0)).toBe("00:00");
  expect(formatTime(3670)).toBe("61:10");
});
