import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import countries from "../../data/countries.json";
import Icon from "../App/Icon";
import CapitalMarkers from "./CapitalMarkers";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const HOME = [17, 54];
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
const filterZoomEvent = (event) =>
  event.type === "wheel" || (!event.ctrlKey && !event.button);

export default function MapChart({
  results = [],
  currentCountry,
  gameRunning = true,
  interactive = false,
  mode = "capitals",
}) {
  const isCountries = mode === "countries";
  const labelFor = (name) =>
    isCountries && gameRunning && !results.includes(name)
      ? "Nieodgadnięte państwo"
      : countries.find((country) => country.name === name)?.label || name;
  const container = useRef(null);
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const [position, setPosition] = useState({
    coordinates: HOME,
    zoom: MIN_ZOOM,
  });
  useEffect(() => {
    if (!interactive || !container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [interactive]);
  const onMoveEnd = useCallback(
    (next) =>
      setPosition({
        coordinates: next.coordinates,
        zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next.zoom)),
      }),
    [],
  );
  const zoomBy = (factor) =>
    setPosition((previous) => ({
      ...previous,
      zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, previous.zoom * factor)),
    }));
  const reset = () => setPosition({ coordinates: HOME, zoom: MIN_ZOOM });
  const pan = (dx, dy) =>
    setPosition((previous) => ({
      ...previous,
      coordinates: [
        Math.max(
          -35,
          Math.min(70, previous.coordinates[0] + dx / previous.zoom),
        ),
        Math.max(
          25,
          Math.min(75, previous.coordinates[1] + dy / previous.zoom),
        ),
      ],
    }));
  function handleKeyDown(event) {
    // Map shortcuts apply only when the map itself has keyboard focus.
    if (event.target !== event.currentTarget) return;
    switch (event.key) {
      case "+":
      case "=":
        zoomBy(1.4);
        break;
      case "-":
        zoomBy(1 / 1.4);
        break;
      case "Home":
        reset();
        break;
      case "ArrowLeft":
        pan(-6, 0);
        break;
      case "ArrowRight":
        pan(6, 0);
        break;
      case "ArrowUp":
        pan(0, 4);
        break;
      case "ArrowDown":
        pan(0, -4);
        break;
      default:
        return;
    }
    event.preventDefault();
  }
  const color = (name) =>
    results.includes(name)
      ? "#729580"
      : currentCountry === name && gameRunning
        ? "#d9a155"
        : countries.some((c) => c.name === name)
          ? "#dce5d5"
          : "#e6ebdf";
  const features = (
    <>
      <Geographies geography={`${process.env.PUBLIC_URL}/europe.topojson`}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={color(mapName(geo.properties.NAME))}
              stroke={interactive ? "#f8faf2" : "#fafbf6"}
              strokeWidth={interactive ? 1 : 1.2}
              vectorEffect="non-scaling-stroke"
              tabIndex={-1}
              style={{
                default: { outline: "none" },
                hover: { outline: "none" },
                pressed: { outline: "none" },
              }}
            >
              <title>{labelFor(mapName(geo.properties.NAME))}</title>
            </Geography>
          ))
        }
      </Geographies>
      {smallCountries.map(([name, x, y]) => (
        <Marker key={name} coordinates={[x, y]}>
          <circle
            r={3.5 / (interactive ? position.zoom : 1)}
            fill={color(name)}
            stroke="#fafbf6"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          >
            <title>{labelFor(name)}</title>
          </circle>
        </Marker>
      ))}
    </>
  );
  if (!interactive)
    return (
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-17, -54, 0], scale: 685 }}
        width={800}
        height={680}
        role="img"
        aria-label="Mapa Europy. Zielony kolor oznacza poprawne odpowiedzi."
      >
        {features}
      </ComposableMap>
    );
  return (
    <div className="interactive-map" ref={container}>
      <div
        className="map-surface"
        role="region"
        aria-label="Interaktywna mapa Europy"
        aria-describedby="map-instructions"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-17, -54, 0],
            scale: Math.min(size.width * 1.15, size.height * 1.2),
          }}
          width={size.width}
          height={size.height}
          aria-label={
            isCountries
              ? "Zielony kolor oznacza odgadnięte państwa."
              : "Złoty kraj to aktualne pytanie, zielone kraje są odgadnięte."
          }
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            translateExtent={[
              [-size.width * 0.35, -size.height * 0.35],
              [size.width * 1.35, size.height * 1.35],
            ]}
            onMoveEnd={onMoveEnd}
            filterZoomEvent={filterZoomEvent}
          >
            {features}
            {!isCountries && <CapitalMarkers results={results} />}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <div
        className="atlas-map-controls"
        role="group"
        aria-label="Sterowanie mapą"
      >
        <button
          aria-label="Przybliż mapę"
          title="Przybliż (+)"
          disabled={position.zoom >= MAX_ZOOM - 0.001}
          onClick={() => zoomBy(1.4)}
        >
          <Icon name="plus" />
        </button>
        <output aria-label="Powiększenie mapy">
          {position.zoom.toFixed(1)}×
        </output>
        <button
          aria-label="Oddal mapę"
          title="Oddal (−)"
          disabled={position.zoom <= MIN_ZOOM + 0.001}
          onClick={() => zoomBy(1 / 1.4)}
        >
          <Icon name="minus" />
        </button>
        <span className="map-control-divider" />
        <button
          aria-label="Pokaż całą Europę"
          title="Pokaż całą Europę (Home)"
          onClick={reset}
        >
          <Icon name="frame" />
        </button>
      </div>
      <p id="map-instructions" className="sr-only">
        Przeciągnij mapę, aby ją przesunąć. Przybliżaj kółkiem myszy lub dwoma
        palcami. Zakres od 1 do 4 razy. Z klawiatury: strzałki przesuwają, plus
        i minus zmieniają powiększenie, Home przywraca widok Europy.
      </p>
    </div>
  );
}
