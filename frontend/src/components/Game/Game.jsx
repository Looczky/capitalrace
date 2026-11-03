import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import countries from "../../data/countries.json";
import shuffle, { isCorrect } from "../../utils/utils";
import Shell from "../App/Shell";
import CountryFlag from "../App/CountryFlag";
import Icon from "../App/Icon";
import MapChart from "./MapChart";
import Stopwatch from "./Stopwatch";

export default function Game() {
  const [queue, setQueue] = useState(() => shuffle(countries));
  const [answers, setAnswers] = useState([]);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("ready");
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [dialog, setDialog] = useState(null);
  const startedAt = useRef(null);
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
    const result = {
      answers: finalAnswers,
      seconds: startedAt.current
        ? Math.floor((Date.now() - startedAt.current) / 1000)
        : 0,
      date: Date.now(),
    };
    try {
      sessionStorage.setItem("capitalrace-result", JSON.stringify(result));
    } catch {
      /* Results still work when storage is unavailable. */
    }
    navigate("/results", { state: result });
  }

  function acceptAnswer() {
    const next = [...answers, current.name];
    setAnswers(next);
    setFeedback({
      correct: true,
      text: `${current.capital} — dokładnie tak!`,
    });
    setValue("");
    if (queue.length === 1) {
      finish(next);
      return;
    }
    setQueue(queue.slice(1));
    input.current?.focus();
  }

  function handleInputChange(event) {
    const answer = event.target.value;
    if (status === "playing" && isCorrect(answer, current)) {
      acceptAnswer();
      return;
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
    <Shell onHelp={() => setDialog("help")}>
      <section className="intro">
        <div>
          <p className="eyebrow">
            <span className="tiny-line" /> TRENING GEOGRAFICZNY
          </p>
          <h1>
            Europa na wyciągnięcie <em>myśli.</em>
          </h1>
          <p className="intro-description">
            Znasz kraje. A ich stolice? Sprawdź, ile z nich pamiętasz.
          </p>
        </div>
        <div className="edition">
          <Icon name="globe" size={28} />
          <span>
            EDYCJA EUROPEJSKA
            <br />
            <b>45 krajów do odkrycia</b>
          </span>
        </div>
      </section>
      <section className="game-layout" aria-label="Gra w stolice Europy">
        <div className="quiz-column">
          <div className="stats-panel">
            <div>
              <span className="stat-label">
                <Icon name="check" size={15} /> ODGADNIĘTE
              </span>
              <strong>
                {String(answers.length).padStart(2, "0")}
                <small> / {countries.length}</small>
              </strong>
            </div>
            <div>
              <span className="stat-label">
                <Icon name="clock" size={15} /> CZAS GRY
              </span>
              <strong>
                <Stopwatch seconds={seconds} />
              </strong>
            </div>
          </div>
          <section className="question-card">
            <div className="card-top">
              <span className="round-label">
                <span
                  className={
                    status === "playing" ? "live-dot active" : "live-dot"
                  }
                />
                {status === "playing" ? "RUNDA W TOKU" : "GOTOWY NA WYZWANIE?"}
              </span>
              <span className="question-counter">
                {countries.length - queue.length + 1} / {countries.length}
              </span>
            </div>
            <p className="question-label">Jaką stolicę ma ten kraj?</p>
            <h2 className="country-name">
              <CountryFlag country={current} />
              <span>{current.label}</span>
            </h2>
            <span className="country-region">
              <Icon name="pin" size={13} /> Europa
            </span>
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="capital">Twoja odpowiedź</label>
              <div
                className={`input-wrap ${feedback?.correct === false ? "invalid" : ""}`}
              >
                <input
                  ref={input}
                  id="capital"
                  placeholder="Wpisz nazwę stolicy…"
                  value={value}
                  onChange={handleInputChange}
                  disabled={status !== "playing"}
                  autoComplete="off"
                  spellCheck="false"
                  autoCapitalize="words"
                  aria-describedby="answer-feedback answer-hint"
                  aria-invalid={feedback?.correct === false}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      skip();
                    }
                  }}
                />
                <span className="input-enter">
                  <Icon name="check" size={17} />
                </span>
              </div>
              <p id="answer-hint" className="input-hint">
                Poprawna odpowiedź zalicza się automatycznie.
              </p>
              {status === "ready" && (
                <button
                  className="button primary submit-button"
                  type="button"
                  onClick={start}
                >
                  Zaczynamy <Icon name="arrow" />
                </button>
              )}
            </form>
            <div
              id="answer-feedback"
              className={`answer-feedback ${feedback?.correct === true ? "success" : feedback?.correct === false ? "error" : ""}`}
              role="status"
            >
              {feedback ? (
                <>
                  {feedback.correct === true && <Icon name="check" size={16} />}{" "}
                  {feedback.text}
                </>
              ) : (
                "Każda stolica to kolejny krok w podróży."
              )}
            </div>
            <div className="card-actions">
              <button onClick={skip} disabled={status !== "playing"}>
                <Icon name="skip" size={16} /> Pomiń na razie <kbd>Esc</kbd>
              </button>
              <button
                onClick={() => setDialog("finish")}
                disabled={status !== "playing"}
              >
                Zakończ rundę
              </button>
            </div>
          </section>
          <div className="progress-card">
            <div>
              <span>Twoja podróż przez Europę</span>
              <strong>{progress}%</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Postęp odgadywania stolic"
              aria-valuenow={answers.length}
              aria-valuemin={0}
              aria-valuemax={countries.length}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              Jeszcze {queue.length}{" "}
              {queue.length === 1 ? "stolica czeka" : "stolic czeka"} na
              odkrycie.
            </p>
          </div>
        </div>
        <section className="map-panel" aria-label="Mapa postępu">
          <div className="map-header">
            <span>
              <Icon name="globe" size={17} /> TWÓJ KIERUNEK: EUROPA
            </span>
            <span className="map-badge">45 KRAJÓW</span>
          </div>
          <span className="map-ocean">
            O C E A N &nbsp; A T L A N T Y C K I
          </span>
          <div className="map-graphic">
            <MapChart results={answers} currentCountry={current.name} />
          </div>
          <div className="map-compass">
            <span>N</span>
            <svg width="26" height="40" viewBox="0 0 26 40" aria-hidden="true">
              <path
                d="m13 2 10 32-10-6-10 6Z"
                fill="none"
                stroke="currentColor"
              />
              <path d="m13 2 0 26-10 6Z" fill="currentColor" />
            </svg>
          </div>
          <div className="map-bottom">
            <div className="map-caption">
              <span className="tiny-line" /> Każda odpowiedź zostawia ślad.
            </div>
            <div className="map-legend">
              <span>
                <i className="legend-current" />
                Aktualny kraj
              </span>
              <span>
                <i className="legend-correct" />
                Odgadnięte
              </span>
              <span>
                <i className="legend-waiting" />
                Przed Tobą
              </span>
            </div>
          </div>
        </section>
      </section>
      <div className="below-game">
        <Icon name="info" size={17} />
        <span>
          Nie znasz odpowiedzi? Pomiń kraj — wrócisz do niego później.
        </span>
        <span className="keyboard-tip">
          Odpowiedzi zaliczamy automatycznie <span>·</span> <kbd>Esc</kbd> pomiń
          kraj
        </span>
      </div>
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
              <h2 id="dialog-title">Mała podróż po stolicach.</h2>
              <p>
                Odgadnij stolice 45 krajów z oryginalnego zestawu gry. Aktualny
                kraj znajdziesz na mapie w złotym kolorze.
              </p>
              <ol>
                <li>Kliknij „Zaczynamy”, aby uruchomić czas.</li>
                <li>
                  Wpisz stolicę po polsku lub angielsku. Poprawna odpowiedź
                  zaliczy się automatycznie — bez Entera. Wielkość liter i znaki
                  diakrytyczne nie mają znaczenia.
                </li>
                <li>
                  Pomiń kraj przyciskiem lub klawiszem Esc. Powróci w tej samej
                  rundzie.
                </li>
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
              <h2 id="dialog-title">Kończymy tę podróż?</h2>
              <p>
                Masz {answers.length} z {countries.length} stolic. Zobaczysz
                podsumowanie oraz odpowiedzi do powtórki.
              </p>
              <div className="modal-actions">
                <button
                  className="button secondary"
                  onClick={() => setDialog(null)}
                >
                  Gram dalej
                </button>
                <button className="button primary" onClick={() => finish()}>
                  Zobacz wyniki <Icon name="arrow" />
                </button>
              </div>
            </>
          )}
        </dialog>
      )}
    </Shell>
  );
}
