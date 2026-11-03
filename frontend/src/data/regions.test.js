import fs from "fs";
import path from "path";
import { REGIONS, getStorageKey, getResultsPath, getRegion } from "./regions";
import { isCorrect, findCountry, isCountryNamePrefix } from "../utils/utils";

test("regional datasets have unique countries, coordinates, flags and matching map features", () => {
  const expected = {
    world: 195,
    europe: 45,
    asia: 47,
    africa: 54,
    "north-america": 23,
    "south-america": 12,
  };
  const allCodes = [];
  Object.values(REGIONS).forEach((region) => {
    expect(region.countries).toHaveLength(expected[region.id]);
    expect(new Set(region.countries.map((country) => country.name)).size).toBe(
      region.countries.length,
    );
    const geo = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public", region.map), "utf8"),
    );
    const names =
      region.id === "europe"
        ? geo.objects.europe.geometries.map((item) =>
            item.properties.NAME === "Holy See (Vatican City)"
              ? "Vatican City"
              : item.properties.NAME,
          )
        : geo.features.map((item) => item.properties.NAME);
    region.countries.forEach((country) => {
      if (region.id !== "world") allCodes.push(country.code);
      expect(names).toContain(country.name);
      expect(
        fs.existsSync(
          path.join(process.cwd(), "public/flags", `${country.code}.svg`),
        ),
      ).toBe(true);
      expect(country.capitalCoordinates).toHaveLength(2);
      expect(Math.abs(country.capitalCoordinates[0])).toBeLessThanOrEqual(180);
      expect(Math.abs(country.capitalCoordinates[1])).toBeLessThanOrEqual(90);
      expect(isCorrect(country.capital, country)).toBe(true);
      expect(isCorrect(country.englishCapital, country)).toBe(true);
      expect(findCountry(country.label, region.countries)).toBe(country);
      expect(findCountry(country.name, region.countries)).toBe(country);
    });
  });
  expect(new Set(allCodes).size).toBe(allCodes.length);
});

test("results and storage keys do not collide across regions or minigames", () => {
  const keys = [],
    paths = [];
  Object.values(REGIONS).forEach((region) =>
    ["capitals", "countries"].forEach((mode) => {
      keys.push(getStorageKey(region.id, mode));
      paths.push(getResultsPath(region.id, mode));
    }),
  );
  expect(new Set(keys).size).toBe(Object.keys(REGIONS).length * 2);
  expect(new Set(paths).size).toBe(Object.keys(REGIONS).length * 2);
});

test("long country names remain typable despite shorter valid country names", () => {
  const africa = REGIONS.africa.countries;
  expect(
    isCountryNamePrefix("Niger", findCountry("Niger", africa), africa),
  ).toBe(true);
  expect(
    isCountryNamePrefix("Gwinea", findCountry("Gwinea", africa), africa),
  ).toBe(true);
  const north = REGIONS["north-america"].countries;
  expect(
    isCountryNamePrefix("Dominica", findCountry("Dominica", north), north),
  ).toBe(true);
});

test("current and multiple capitals are accepted without accepting obsolete ones", () => {
  const byCode = (code) =>
    Object.values(REGIONS)
      .flatMap((region) => region.countries)
      .find((country) => country.code === code);
  expect(isCorrect("Ciudad de la Paz", byCode("gq"))).toBe(true);
  expect(isCorrect("Malabo", byCode("gq"))).toBe(false);
  expect(isCorrect("Gitega", byCode("bi"))).toBe(true);
  expect(isCorrect("Bujumbura", byCode("bi"))).toBe(false);
  ["Pretoria", "Kapsztad", "Cape Town", "Bloemfontein"].forEach((answer) =>
    expect(isCorrect(answer, byCode("za"))).toBe(true),
  );
  expect(isCorrect("La Paz", byCode("bo"))).toBe(true);
  expect(isCorrect("Sucre", byCode("bo"))).toBe(true);
});

test("unknown region names cannot resolve to object prototype properties", () => {
  expect(getRegion("unknown")).toBeUndefined();
  expect(getRegion("constructor")).toBeUndefined();
  expect(getRegion("__proto__")).toBeUndefined();
});

test("the world includes every regional country exactly once plus fourteen Oceanian countries", () => {
  const world = REGIONS.world.countries;
  const regional = Object.values(REGIONS)
    .filter((region) => region.id !== "world")
    .flatMap((region) => region.countries);
  const regionalCodes = new Set(regional.map((country) => country.code));
  expect(new Set(world.map((country) => country.code)).size).toBe(195);
  regional.forEach((country) =>
    expect(world.find((item) => item.code === country.code)?.name).toBe(
      country.name,
    ),
  );
  expect(
    world.filter((country) => !regionalCodes.has(country.code)),
  ).toHaveLength(14);
  [
    "au",
    "nz",
    "pg",
    "fj",
    "sb",
    "vu",
    "ws",
    "to",
    "tv",
    "ki",
    "mh",
    "fm",
    "pw",
    "nr",
  ].forEach((code) =>
    expect(world.some((country) => country.code === code)).toBe(true),
  );
  expect(REGIONS.world.projection).toBe("geoEqualEarth");
});

test("Oceanian capital answers support current seats and spelling variants", () => {
  const byCode = (code) =>
    REGIONS.world.countries.find((country) => country.code === code);
  expect(isCorrect("Canberra", byCode("au"))).toBe(true);
  expect(isCorrect("Ngerulmud", byCode("pw"))).toBe(true);
  expect(isCorrect("Koror", byCode("pw"))).toBe(false);
  expect(isCorrect("Nukuʻalofa", byCode("to"))).toBe(true);
  expect(isCorrect("South Tarawa", byCode("ki"))).toBe(true);
  expect(isCorrect("Yaren", byCode("nr"))).toBe(true);
  expect(byCode("nr").notes).toMatch(/nie ma oficjalnej stolicy/);
});
