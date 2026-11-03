import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Shell from "../App/Shell";
import ModeSwitch from "../App/ModeSwitch";
import CountryFlag from "../App/CountryFlag";
import Icon from "../App/Icon";
import MapChart from "../Game/MapChart";
import { getRegion, getGamePath, getStorageKey } from "../../data/regions";
import { formatTime } from "../../utils/utils";

function loadResult(state, mode, regionId, countries) {
  try {
    const result =
      state ||
      JSON.parse(sessionStorage.getItem(getStorageKey(regionId, mode)));
    if (
      !result ||
      (result.mode || "capitals") !== mode ||
      (result.regionId || "europe") !== regionId ||
      !Array.isArray(result.answers) ||
      !Number.isFinite(result.seconds) ||
      result.seconds < 0
    )
      return null;
    return {
      ...result,
      answers: [
        ...new Set(
          result.answers.filter((name) =>
            countries.some((c) => c.name === name),
          ),
        ),
      ],
    };
  } catch {
    return null;
  }
}
export default function Results({ mode = "capitals", regionId = "europe" }) {
  const region = getRegion(regionId);
  const countries = region.countries;
  const isCountries = mode === "countries";
  const gamePath = getGamePath(regionId, mode);
  const { state } = useLocation();
  const [result] = useState(() => loadResult(state, mode, regionId, countries));
  const [filter, setFilter] = useState("all");
  if (!result)
    return (
      <Shell regionId={regionId} mode={mode}>
        <section className="empty-results">
          <Icon name="globe" size={48} />
          <h1>Twoja podróż dopiero się zaczyna.</h1>
          <p>Rozegraj rundę, aby zobaczyć swoje wyniki.</p>
          <Link className="button primary" to={gamePath}>
            Przejdź do gry <Icon name="arrow" />
          </Link>
        </section>
      </Shell>
    );
  const count = result.answers.length;
  const visible = countries.filter(
    (c) =>
      filter === "all" ||
      (filter === "correct"
        ? result.answers.includes(c.name)
        : !result.answers.includes(c.name)),
  );
  return (
    <Shell regionId={regionId} mode={mode}>
      <section className="intro">
        <div>
          <ModeSwitch regionId={regionId} />
          <p className="eyebrow">
            <span className="tiny-line" /> TWOJA PODRÓŻ W LICZBACH
          </p>
          <h1>
            {count === countries.length
              ? region.winTitle
              : "Każda podróż czegoś uczy."}
          </h1>
          <p className="intro-description">
            {count === countries.length
              ? isCountries
                ? "Wszystkie państwa odgadnięte. Świetna robota!"
                : "Wszystkie stolice odgadnięte. Świetna robota!"
              : "Sprawdź odpowiedzi i odkryj, co warto zapamiętać na kolejną rundę."}
          </p>
        </div>
        <Link to={gamePath} className="button primary">
          <Icon name="restart" size={18} /> Zagraj ponownie
        </Link>
      </section>
      <section className="results-overview">
        <div className="result-summary">
          <p className="eyebrow">RUNDA ZAKOŃCZONA</p>
          <strong className="result-percentage">
            {Math.round((count / countries.length) * 100)}
            <small>%</small>
          </strong>
          <p>{region.label} w Twojej pamięci</p>
          <div className="result-numbers">
            <span>
              <Icon name="check" />{" "}
              <b>
                {count} / {countries.length}
              </b>{" "}
              {isCountries ? "państw" : "stolic"}
            </span>
            <span>
              <Icon name="clock" /> <b>{formatTime(result.seconds)}</b> czas gry
            </span>
          </div>
        </div>
        <div className="result-map">
          <MapChart
            results={result.answers}
            gameRunning={false}
            mode={mode}
            regionId={regionId}
          />
        </div>
      </section>
      <section className="answers-section">
        <div className="answers-heading">
          <div>
            <p className="eyebrow">ZABIERZ TĘ WIEDZĘ ZE SOBĄ</p>
            <h2>Twój atlas odpowiedzi</h2>
          </div>
          <div className="filter-tabs" aria-label="Filtruj odpowiedzi">
            {[
              ["all", "Wszystkie", countries.length],
              ["correct", "Odgadnięte", count],
              ["remaining", "Do powtórki", countries.length - count],
            ].map(([id, label, total]) => (
              <button
                key={id}
                aria-pressed={filter === id}
                className={filter === id ? "selected" : ""}
                onClick={() => setFilter(id)}
              >
                {label} <span>{total}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="answers-grid">
          {visible.map((country) => (
            <div className="answer-row" key={country.name}>
              <span
                className={`answer-state ${result.answers.includes(country.name) ? "known" : ""}`}
              >
                <Icon
                  name={result.answers.includes(country.name) ? "check" : "pin"}
                  size={16}
                />
                <span className="sr-only">
                  {result.answers.includes(country.name)
                    ? "Odgadnięte"
                    : "Do powtórki"}
                </span>
              </span>
              <span>
                <span className="answer-country">
                  <CountryFlag country={country} />
                  <span>
                    {isCountries
                      ? result.answers.includes(country.name)
                        ? "Odgadnięte"
                        : "Do powtórki"
                      : country.label}
                  </span>
                </span>
                <strong>
                  {isCountries
                    ? country.label
                    : [
                        country.capital,
                        ...(country.capitalVariants || []).map(
                          (variant) => variant.capital,
                        ),
                      ].join(" / ")}
                </strong>
                {!isCountries && country.notes && (
                  <small className="answer-notes">{country.notes}</small>
                )}
              </span>
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="filter-empty">
            {filter === "correct"
              ? isCountries
                ? "Jeszcze żadne państwo. Kolejna runda to nowa szansa!"
                : "Jeszcze żadna stolica. Kolejna runda to nowa szansa!"
              : isCountries
                ? "Wszystkie państwa odgadnięte — nie ma nic do powtórki!"
                : "Wszystkie stolice odgadnięte — nie ma nic do powtórki!"}
          </p>
        )}
      </section>
    </Shell>
  );
}
