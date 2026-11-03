import React from "react";
import { Marker, useZoomPanContext } from "react-simple-maps";
import countries from "../../data/countries.json";

export const CAPITAL_ZOOM_THRESHOLD = 2;
// Separate labels for nearby capitals, especially Rome and Vatican City.
const labelOffsets = {
  Austria: [-10, -12],
  Slovakia: [10, 13],
  Italy: [10, -13],
  "Vatican City": [-10, 15],
  Estonia: [10, 13],
  Finland: [10, -11],
  Slovenia: [-10, -12],
  Croatia: [10, 13],
};

export default function CapitalMarkers({ results }) {
  const { k: zoom } = useZoomPanContext();
  if (zoom < CAPITAL_ZOOM_THRESHOLD) return null;

  return countries
    .filter((country) => results.includes(country.name))
    .map((country) => {
      const [x, y] = labelOffsets[country.name] || [10, -11];
      return (
        <Marker key={country.name} coordinates={country.capitalCoordinates}>
          <g
            className="capital-marker"
            transform={`scale(${1 / zoom})`}
            role="img"
            aria-label={`${country.capital} — odgadnięta stolica: ${country.label}`}
          >
            <title>
              {country.capital} · {country.label}
            </title>
            <circle className="capital-halo" r={7} />
            <path
              className="capital-leader"
              d={`M0 0 L${x * 0.7} ${y * 0.7}`}
            />
            <circle className="capital-dot" r={4} />
            <text
              className="capital-label"
              x={x}
              y={y}
              dominantBaseline="middle"
              textAnchor={x < 0 ? "end" : "start"}
            >
              {country.capital}
            </text>
          </g>
        </Marker>
      );
    });
}
