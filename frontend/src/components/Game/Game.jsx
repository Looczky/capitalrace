import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRegion, getResultsPath, getStorageKey } from "../../data/regions";
import shuffle, {
  isCorrect,
  findCountry,
  isCountryNamePrefix,
  isCapitalNamePrefix,
} from "../../utils/utils";
import Shell from "../App/Shell";
import ModeSwitch from "../App/ModeSwitch";
import CountryFlag from "../App/CountryFlag";
import Icon from "../App/Icon";
import MapChart from "./MapChart";
import Stopwatch from "./Stopwatch";

export default function Game({ mode = "capitals", regionId = "europe" }) {
  const region = getRegion(regionId);
  const countries = region.countries;
  const isCountries = mode === "countries";
  const unit = isCountries ? "państw" : "stolic";
  const [queue, setQueue] = useState(() => shuffle(countries));
  const [answers, setAnswers] = useState([]);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("ready");
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [dialog, setDialog] = useState(null);
  const startedAt = useRef(null);
  const answerTimer = useRef(null);
  useEffect(() => () => clearTimeout(answerTimer.current), []);
  const input = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const current = queue[0];
  const progress = Math.round((answers.length / countries.length) * 100);

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(
      () => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)),
      250,
    );
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!dialog) return;
    clearTimeout(answerTimer.current);
    const previous = document.activeElement;
    dialogRef.current.showModal();
    return () => {
      previous?.focus();
    };
  }, [dialog]);

  function start() {
    startedAt.current = Date.now();
    setStatus("playing");
    requestAnimationFrame(() => input.current?.focus());
  }

  function finish(finalAnswers = answers) {
    clearTimeout(answerTimer.current);
    const result = {
      mode,
      regionId,
      answers: finalAnswers,
      seconds: startedAt.current
        ? Math.floor((Date.now() - startedAt.current) / 1000)
        : 0,
      date: Date.now(),
    };
    try {
      sessionStorage.setItem(
        getStorageKey(regionId, mode),
        JSON.stringify(result),
      );
    } catch {
      /* Results still work when storage is unavailable. */
    }
    navigate(getResultsPath(regionId, mode), {
      state: result,
    });
  }

  function acceptAnswer(country = current) {
    const next = [...answers, country.name];
    setAnswers(next);
    setFeedback({
      correct: true,
      text: isCountries
        ? `${country.label} — dodano do mapy!`
        : `${country.capital} — dokładnie tak!`,
    });
    setValue("");
    if (queue.length === 1) {
      finish(next);
      return;
    }
    setQueue(queue.filter((item) => item.name !== country.name));
    input.current?.focus();
  }

  function handleInputChange(event) {
    const answer = event.target.value;
    clearTimeout(answerTimer.current);
    if (status === "playing") {
      if (isCountries) {
        const country = findCountry(answer, countries);
        if (country) {
          const register = () => {
            if (answers.includes(country.name)) {
              setFeedback({
                correct: false,
                text: `${country.label} jest już na mapie. Wpisz inne państwo.`,
              });
              setValue("");
            } else {
              acceptAnswer(country);
            }
          };
          if (isCountryNamePrefix(answer, country, countries)) {
            // Give the player time to finish an alternative name, e.g. Cypr → Cyprus.
            setValue(answer);
            answerTimer.current = setTimeout(register, 300);
          } else {
            register();
          }
          return;
        }
      } else if (isCorrect(answer, current)) {
        if (isCapitalNamePrefix(answer, current)) {
          setValue(answer);
          answerTimer.current = setTimeout(() => acceptAnswer(), 300);
        } else {
          acceptAnswer();
        }
        return;
      }
    }
    setValue(answer);
    if (feedback?.correct === false) setFeedback(null);
  }

  function skip() {
    if (status !== "playing") return;
    setQueue([...queue.slice(1), queue[0]]);
    setValue("");
    setFeedback({
      correct: null,
      text:
        queue.length > 1
          ? "Wrócimy do tego kraju. Spróbuj kolejnego."
          : "To ostatni kraj. Spróbuj odpowiedzieć lub zakończ rundę.",
    });
    input.current?.focus();
  }

  return (
    <Shell
      immersive
      regionId={regionId}
      mode={mode}
      onHelp={() => setDialog("help")}
    >
      <section
        className="atlas-stage"
        aria-label={
          isCountries
            ? `Gra w państwa ${region.genitive}`
            : `Gra w stolice ${region.genitive}`
        }
      >
        <div className="atlas-canvas">
          <MapChart
            interactive
            results={answers}
            currentCountry={isCountries ? undefined : current.name}
            mode={mode}
            regionId={regionId}
          />
        </div>
        <div className="atlas-heading">
          <ModeSwitch regionId={regionId} />
          <h1>
            {region.headline}
            <br />
            <em>Z pamięci.</em>
          </h1>
          <p>
            {isCountries
              ? "Wpisuj państwa. Wypełnij całą mapę."
              : `${countries.length} krajów. Tyle miejsc do odkrycia.`}
          </p>
        </div>
        <div className="atlas-stats">
          <div>
            <span className="stat-label">
              <Icon name="check" size={14} /> ODGADNIĘTE
            </span>
            <strong>
              {String(answers.length).padStart(2, "0")}
              <small> / {countries.length}</small>
            </strong>
          </div>
          <span className="atlas-stat-divider" />
          <div>
            <span className="stat-label">
              <Icon name="clock" size={14} /> CZAS GRY
            </span>
            <strong>
              <Stopwatch seconds={seconds} />
            </strong>
          </div>
          <div
            className="atlas-progress"
            role="progressbar"
            aria-label={
              isCountries
                ? "Postęp odgadywania państw"
                : "Postęp odgadywania stolic"
            }
            aria-valuenow={answers.length}
            aria-valuemin={0}
            aria-valuemax={countries.length}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        {regionId === "europe" && (
          <>
            {" "}
            <span className="atlas-ocean" aria-hidden="true">
              O C E A N<br />A T L A N T Y C K I
            </span>
            <span className="atlas-sea" aria-hidden="true">
              M O R Z E &nbsp; Ś R Ó D Z I E M N E
            </span>
          </>
        )}
        <div className="atlas-compass" aria-hidden="true">
          <span>N</span>
          <svg width="24" height="38" viewBox="0 0 26 40">
            <path
              d="m13 2 10 32-10-6-10 6Z"
              fill="none"
              stroke="currentColor"
            />
            <path d="m13 2 0 26-10 6Z" fill="currentColor" />
          </svg>
        </div>
        <div className="atlas-legend" aria-label="Legenda mapy">
          {!isCountries && (
            <span>
              <i className="legend-current" /> Aktualny kraj
            </span>
          )}
          <span>
            <i className="legend-correct" /> Odgadnięte
          </span>
          <span className="legend-pending">
            <i className="legend-waiting" /> Przed Tobą
          </span>
          {!isCountries && (
            <span>
              <i className="legend-capital" /> Stolice od 2×
            </span>
          )}
        </div>
        <section
          className={`atlas-dock ${status === "ready" ? "is-ready" : ""}`}
          aria-label={isCountries ? "Odgaduj państwa" : "Aktualne pytanie"}
        >
          <div className="atlas-dock-country">
            <p className="round-label">
              <span
                className={
                  status === "playing" ? "live-dot active" : "live-dot"
                }
              />
              {status === "playing"
                ? isCountries
                  ? "WPISZ DOWOLNE PAŃSTWO"
                  : "JAKA JEST STOLICA?"
                : "GOTOWY NA PODRÓŻ?"}
            </p>
            <h2 className="country-name">
              {isCountries ? (
                <Icon name="globe" size={28} />
              ) : (
                <CountryFlag country={current} />
              )}
              <span>{isCountries ? "Wypełnij mapę" : current.label}</span>
            </h2>
            <span className="atlas-remaining">
              <Icon name="pin" size={13} /> {region.label} <span>·</span>{" "}
              Pozostało {queue.length}
            </span>
          </div>
          <div className="atlas-dock-answer">
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="capital">
                {isCountries ? "Nazwa państwa" : "Twoja odpowiedź"}
              </label>
              <div className="input-wrap">
                <input
                  ref={input}
                  id="capital"
                  placeholder={
                    isCountries
                      ? "Wpisz dowolne państwo…"
                      : "Wpisz nazwę stolicy…"
                  }
                  value={value}
                  onChange={handleInputChange}
                  disabled={status !== "playing"}
                  autoComplete="off"
                  spellCheck="false"
                  autoCapitalize="words"
                  aria-describedby="answer-feedback answer-hint"
                  aria-invalid={false}
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && !isCountries) {
                      event.preventDefault();
                      skip();
                    }
                  }}
                />
                <span className="input-enter">
                  <Icon name="check" size={17} />
                </span>
              </div>
              <p id="answer-hint" className="input-hint">
                Po polsku lub angielsku. Zaliczymy automatycznie.
              </p>
              {status === "ready" && (
                <button
                  className="button primary atlas-start"
                  type="button"
                  onClick={start}
                >
                  Zaczynamy <Icon name="arrow" size={18} />
                </button>
              )}
            </form>
          </div>
          <div className="atlas-dock-bottom">
            <div
              id="answer-feedback"
              className={`atlas-feedback ${feedback?.correct ? "success" : ""}`}
              role="status"
            >
              {feedback ? (
                <>
                  {feedback.correct && <Icon name="check" size={15} />}{" "}
                  {feedback.text}
                </>
              ) : (
                <>
                  <Icon name="hand" size={14} /> Przeciągaj, przybliżaj,
                  odkrywaj.
                </>
              )}
            </div>
            <div className="atlas-dock-actions">
              {!isCountries && (
                <button
                  className="atlas-skip"
                  onClick={skip}
                  disabled={status !== "playing"}
                >
                  <Icon name="skip" size={15} /> Pomiń <kbd>Esc</kbd>
                </button>
              )}
              <button
                className="button danger atlas-finish"
                onClick={() => setDialog("finish")}
                disabled={status !== "playing"}
              >
                <Icon name="close" size={15} /> Zakończ grę
              </button>
            </div>
          </div>
        </section>
        <div className="atlas-map-hint">
          <Icon name="hand" size={14} />
          <span>
            Przeciągnij mapę
            <br />
            Przybliż kółkiem lub gestem
          </span>
        </div>
      </section>
      {dialog && (
        <dialog
          ref={dialogRef}
          className="modal"
          aria-labelledby="dialog-title"
          onCancel={() => setDialog(null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialog(null);
          }}
        >
          <div className="modal-heading">
            <Icon name={dialog === "help" ? "globe" : "flag"} size={27} />
            <button
              className="icon-button"
              aria-label="Zamknij"
              onClick={() => setDialog(null)}
            >
              <Icon name="close" />
            </button>
          </div>
          {dialog === "help" ? (
            <>
              <h2 id="dialog-title">
                {isCountries
                  ? "Wypełnij mapę z pamięci."
                  : "Mała podróż po stolicach."}
              </h2>
              <p>
                {isCountries
                  ? `Wymień wszystkie państwa z wybranego zestawu (${countries.length}), w dowolnej kolejności. Każde odgadnięte państwo pokoloruje się na zielono. Nazwy nieodgadniętych państw pozostają ukryte.`
                  : `Odgadnij stolice krajów z wybranego zestawu (${countries.length}). Aktualny kraj znajdziesz na mapie w złotym kolorze.`}
              </p>
              <p className="region-scope">
                {region.label}: {region.scope}
              </p>
              <ol>
                <li>Kliknij „Zaczynamy”, aby uruchomić czas.</li>
                <li>
                  Przeciągaj mapę myszą lub palcem. Przybliżaj kółkiem, gestem
                  dwóch palców lub przyciskami + i − (od 1 do 4×). Przycisk
                  widoku regionu przywraca pozycję początkową.
                </li>
                <li>
                  {isCountries
                    ? "Wpisz dowolne państwo po polsku lub angielsku. Pełna poprawna nazwa zaliczy się automatycznie. Każde państwo liczy się tylko raz."
                    : "Wpisz stolicę po polsku lub angielsku. Poprawna odpowiedź zaliczy się automatycznie — bez Entera."}{" "}
                  Wielkość liter i znaki diakrytyczne nie mają znaczenia.
                </li>
                {!isCountries && (
                  <li>
                    Po odgadnięciu stolicy przybliż mapę co najmniej do 2×, aby
                    zobaczyć jej punkt i nazwę. Granatowo-turkusowe oznaczenia
                    pokazują tylko odgadnięte stolice.
                  </li>
                )}
                {!isCountries && (
                  <li>
                    Pomiń kraj przyciskiem lub klawiszem Esc. Powróci w tej
                    samej rundzie.
                  </li>
                )}
              </ol>
              <p>
                Nie ma limitu czasu ani kary za błędy. Po zakończeniu zobaczysz
                wszystkie odpowiedzi.
              </p>
              <button
                className="button primary"
                onClick={() => setDialog(null)}
              >
                Wszystko jasne <Icon name="check" />
              </button>
            </>
          ) : (
            <>
              <h2 id="dialog-title">Na pewno zakończyć grę?</h2>
              <p>
                Odgadnięto {answers.length} z {countries.length} {unit}. Po
                zakończeniu zobaczysz swój wynik oraz wszystkie nieodgadnięte{" "}
                {isCountries ? "państwa" : "stolice"} do powtórki.
              </p>
              <div className="modal-actions">
                <button
                  className="button secondary"
                  autoFocus
                  onClick={() => setDialog(null)}
                >
                  Gram dalej
                </button>
                <button className="button danger" onClick={() => finish()}>
                  Tak, zakończ grę <Icon name="arrow" />
                </button>
              </div>
            </>
          )}
        </dialog>
      )}
    </Shell>
  );
}
