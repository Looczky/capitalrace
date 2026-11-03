import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import countries from "../../data/countries.json";
const mapName = (name) =>
  name === "Holy See (Vatican City)" ? "Vatican City" : name;
const smallCountries = [
  ["Andorra", 1.52, 42.51],
  ["Liechtenstein", 9.52, 47.14],
  ["Monaco", 7.42, 43.74],
  ["San Marino", 12.46, 43.94],
  ["Vatican City", 12.45, 41.9],
  ["Malta", 14.38, 35.94],
];
export default function MapChart({
  results = [],
  currentCountry,
  gameRunning = true,
}) {
  const color = (name) =>
    results.includes(name)
      ? "#7da38d"
      : currentCountry === name && gameRunning
        ? "#d8a157"
        : countries.some((c) => c.name === name)
          ? "#dce4db"
          : "#e9ece5";
  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{ rotate: [-17, -54, 0], scale: 685 }}
      width={800}
      height={680}
      role="img"
      aria-label="Mapa Europy. Złoty kolor oznacza aktualne pytanie, zielony poprawne odpowiedzi."
    >
      <Geographies geography={`${process.env.PUBLIC_URL}/europe.topojson`}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={color(mapName(geo.properties.NAME))}
              stroke="#fafbf6"
              strokeWidth={1.2}
              tabIndex={-1}
              style={{
                default: { outline: "none" },
                hover: { outline: "none" },
                pressed: { outline: "none" },
              }}
            >
              <title>
                {countries.find((c) => c.name === mapName(geo.properties.NAME))
                  ?.label || geo.properties.NAME}
              </title>
            </Geography>
          ))
        }
      </Geographies>
      {smallCountries.map(([name, x, y]) => (
        <Marker key={name} coordinates={[x, y]}>
          <circle r={3.4} fill={color(name)} stroke="#fafbf6" strokeWidth={1}>
            <title>{countries.find((c) => c.name === name)?.label}</title>
          </circle>
        </Marker>
      ))}
    </ComposableMap>
  );
}
