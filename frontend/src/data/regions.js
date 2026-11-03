import layouts from "./region-map-layouts.json";
import europe from "./countries.json";
import asia from "./asia.json";
import africa from "./africa.json";
import northAmerica from "./north-america.json";
import southAmerica from "./south-america.json";

export const REGIONS = {
  europe: {
    id: "europe",
    label: "Europa",
    genitive: "Europy",
    headline: "Cała Europa.",
    winTitle: "Cała Europa jest Twoja.",
    countries: europe,
    map: "/europe.topojson",
    center: [17, 54],
    scale: [1.15, 1.2],
    bounds: [-35, 25, 70, 75],
    resetLabel: "Pokaż całą Europę",
    scope: "Oryginalny zestaw 45 krajów, obejmujący Rosję i Cypr.",
  },
  asia: {
    id: "asia",
    layout: layouts["asia"],
    label: "Azja",
    genitive: "Azji",
    headline: "Cała Azja.",
    winTitle: "Cała Azja jest Twoja.",
    countries: asia,
    map: "/maps/asia.geojson",
    center: [93, 29],
    scale: [0.6, 0.72],
    bounds: [25, -18, 180, 80],
    resetLabel: "Pokaż całą Azję",
    scope:
      "47 państw, w tym Bliski Wschód i Palestyna. Rosja i Cypr pozostają w zestawie Europy.",
  },
  africa: {
    id: "africa",
    layout: layouts["africa"],
    label: "Afryka",
    genitive: "Afryki",
    headline: "Cała Afryka.",
    winTitle: "Cała Afryka jest Twoja.",
    countries: africa,
    map: "/maps/africa.geojson",
    center: [20, 1],
    scale: [0.83, 0.64],
    bounds: [-35, -45, 65, 45],
    resetLabel: "Pokaż całą Afrykę",
    scope:
      "54 państwa, wraz z wyspiarskimi państwami Afryki. Terytoria zależne nie wchodzą do zestawu.",
  },
  "north-america": {
    id: "north-america",
    layout: layouts["north-america"],
    label: "Ameryka Północna",
    genitive: "Ameryki Północnej",
    headline: "Ameryka Północna.",
    winTitle: "Ameryka Północna jest Twoja.",
    countries: northAmerica,
    map: "/maps/north-america.geojson",
    center: [-100, 39],
    scale: [0.65, 0.6],
    bounds: [-175, -5, -30, 85],
    resetLabel: "Pokaż całą Amerykę Północną",
    scope:
      "23 państwa: Ameryka Północna, Ameryka Środkowa i Karaiby. Bez terytoriów zależnych.",
  },
  "south-america": {
    id: "south-america",
    layout: layouts["south-america"],
    label: "Ameryka Południowa",
    genitive: "Ameryki Południowej",
    headline: "Ameryka Południowa.",
    winTitle: "Ameryka Południowa jest Twoja.",
    countries: southAmerica,
    map: "/maps/south-america.geojson",
    center: [-60, -20],
    scale: [0.92, 0.68],
    bounds: [-95, -65, -25, 20],
    resetLabel: "Pokaż całą Amerykę Południową",
    scope:
      "12 państw. Terytoria zależne, takie jak Gujana Francuska, nie wchodzą do zestawu.",
  },
};

export function getRegion(id = "europe") {
  return Object.prototype.hasOwnProperty.call(REGIONS, id)
    ? REGIONS[id]
    : undefined;
}
export function getGamePath(regionId = "europe", mode = "capitals") {
  if (regionId === "europe") return mode === "countries" ? "/countries" : "/";
  return `/play/${regionId}${mode === "countries" ? "/countries" : ""}`;
}
export function getResultsPath(regionId = "europe", mode = "capitals") {
  const path = getGamePath(regionId, mode);
  return path === "/" ? "/results" : `${path}/results`;
}
export function getStorageKey(regionId = "europe", mode = "capitals") {
  if (regionId === "europe")
    return mode === "countries"
      ? "capitalrace-countries-result"
      : "capitalrace-result";
  return `capitalrace-${regionId}-${mode}-result`;
}
