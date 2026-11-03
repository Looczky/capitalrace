import { fireEvent, render, screen, act } from "@testing-library/react";
import App from "./App";
import countries from "../../data/countries.json";

jest.mock("../Game/MapChart", () => () => <div data-testid="map" />);
jest.mock("../../utils/utils", () => ({
  ...jest.requireActual("../../utils/utils"),
  __esModule: true,
  default: (items) => [...items],
}));

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  sessionStorage.clear();
  jest.useFakeTimers();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
});
afterEach(() => {
  jest.useRealTimers();
});
function start() {
  fireEvent.click(screen.getByRole("button", { name: /Zaczynamy/ }));
}
function answer(value) {
  fireEvent.change(screen.getByLabelText("Twoja odpowiedź"), {
    target: { value },
  });
}

test("timer waits for start and includes time before the first answer; skipping returns to unanswered countries", () => {
  render(<App />);
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(screen.getByLabelText("Czas gry: 00:00")).toBeInTheDocument();
  start();
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(screen.getByLabelText("Czas gry: 00:03")).toBeInTheDocument();
  fireEvent.keyDown(screen.getByLabelText("Twoja odpowiedź"), {
    key: "Escape",
  });
  expect(screen.getByRole("heading", { name: "Andora" })).toBeInTheDocument();
  answer("  ANDORRA LA VELLA  ");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  expect(screen.getByRole("heading", { name: "Austria" })).toBeInTheDocument();
  answer("wrong");
  expect(screen.getByLabelText("Twoja odpowiedź")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  answer("wieden");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
});

test("last answer is included in results and a new game resets progress and timer", () => {
  render(<App />);
  start();
  countries.forEach((country) => answer(country.capital));
  expect(
    screen.getByRole("heading", { name: "Cała Europa jest Twoja." }),
  ).toBeInTheDocument();
  expect(
    JSON.parse(sessionStorage.getItem("capitalrace-result")).answers,
  ).toHaveLength(45);
  expect(document.querySelectorAll(".answer-country img")).toHaveLength(45);
  countries.forEach((country) => {
    expect(
      document.querySelector(
        `.answer-country img[src="/flags/${country.code}.svg"]`,
      ),
    ).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("button", { name: /Do powtórki/ }));
  expect(screen.getByText(/nie ma nic do powtórki/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: /Zagraj ponownie/ }));
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  expect(screen.getByLabelText("Czas gry: 00:00")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Zaczynamy/ })).toBeInTheDocument();
});

test("ending early stores results and results survive page refresh", () => {
  const view = render(<App />);
  start();
  answer("Tirana");
  fireEvent.click(screen.getByRole("button", { name: "Zakończ grę" }));
  expect(
    screen.getByRole("dialog", { name: "Na pewno zakończyć grę?" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Gram dalej" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  fireEvent.click(screen.getByRole("button", { name: "Zakończ grę" }));
  fireEvent.click(screen.getByRole("button", { name: "Tak, zakończ grę" }));
  expect(screen.getByText("1 / 45")).toBeInTheDocument();
  view.unmount();
  render(<App />);
  expect(screen.getByText("1 / 45")).toBeInTheDocument();
});

test("direct results visit without stored data offers a way back to the game", () => {
  window.history.replaceState({}, "", "/results");
  render(<App />);
  expect(screen.getByRole("link", { name: /Przejdź do gry/ })).toHaveAttribute(
    "href",
    "/",
  );
});

test("typing a complete correct answer accepts it once, clears the field and keeps focus", () => {
  render(<App />);
  start();
  expect(
    screen.queryByRole("button", { name: /Sprawdź odpowiedź/ }),
  ).not.toBeInTheDocument();
  expect(document.querySelector(".country-name img")).toHaveAttribute(
    "src",
    "/flags/al.svg",
  );
  const input = screen.getByLabelText("Twoja odpowiedź");
  input.focus();
  for (const partial of ["T", "Ti", "Tir", "Tira", "Tiran"]) {
    answer(partial);
    expect(
      screen.getByRole("heading", { name: "Albania" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(input).toHaveAttribute("aria-invalid", "false");
  }
  answer("Tirana");
  expect(screen.getByRole("heading", { name: "Andora" })).toBeInTheDocument();
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  expect(document.querySelector(".country-name img")).toHaveAttribute(
    "src",
    "/flags/ad.svg",
  );
  expect(input).toHaveValue("");
  expect(input).toHaveFocus();
  fireEvent.submit(input.closest("form"));
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  answer("Andorra la Vella");
  expect(screen.getByRole("heading", { name: "Austria" })).toBeInTheDocument();
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
});

test("can end a game with no correct answers after confirmation", () => {
  render(<App />);
  start();
  fireEvent.click(screen.getByRole("button", { name: "Zakończ grę" }));
  expect(
    screen.getByRole("dialog", { name: "Na pewno zakończyć grę?" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Twój atlas odpowiedzi" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Tak, zakończ grę" }));
  expect(screen.getByText("0 / 45")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Do powtórki/ })).toHaveTextContent(
    "45",
  );
});

test("countries minigame accepts any country, ignores partial names and counts duplicates only once", () => {
  window.history.replaceState({}, "", "/countries");
  render(<App />);
  start();
  const input = screen.getByLabelText("Nazwa państwa");
  const type = (value) => fireEvent.change(input, { target: { value } });
  expect(
    screen.queryByRole("button", { name: /Pomiń/ }),
  ).not.toBeInTheDocument();
  type("Pols");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  type("  POLSKA  ");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  expect(input).toHaveValue("");
  type("Poland");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  expect(screen.getByRole("status")).toHaveTextContent(
    "Polska jest już na mapie",
  );
  type("Czechia");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  type("BOSNIA I HERCEGOWINA");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
  type("Cypr");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
  act(() => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "4");
  expect(input).toHaveValue("");
});

test("all countries finish the second minigame, with separate results and replay", () => {
  const capitalResult = { mode: "capitals", answers: ["Albania"], seconds: 7 };
  sessionStorage.setItem("capitalrace-result", JSON.stringify(capitalResult));
  window.history.replaceState({}, "", "/countries");
  const view = render(<App />);
  start();
  countries.forEach((country, index) => {
    for (let length = 1; length <= country.name.length; length++) {
      fireEvent.change(screen.getByLabelText("Nazwa państwa"), {
        target: { value: country.name.slice(0, length) },
      });
      if (length < country.name.length) {
        expect(screen.getByRole("progressbar")).toHaveAttribute(
          "aria-valuenow",
          String(index),
        );
      }
    }
    act(() => {
      jest.advanceTimersByTime(300);
    });
    if (index < countries.length - 1) {
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        String(index + 1),
      );
    }
  });
  expect(window.location.pathname).toBe("/countries/results");
  expect(
    screen.getByText("Wszystkie państwa odgadnięte. Świetna robota!"),
  ).toBeInTheDocument();
  expect(screen.queryByText("Tirana")).not.toBeInTheDocument();
  expect(
    JSON.parse(sessionStorage.getItem("capitalrace-countries-result")).answers,
  ).toHaveLength(45);
  expect(JSON.parse(sessionStorage.getItem("capitalrace-result"))).toEqual(
    capitalResult,
  );
  view.unmount();
  render(<App />);
  expect(screen.getByText("45 / 45")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: /Zagraj ponownie/ }));
  expect(window.location.pathname).toBe("/countries");
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  expect(screen.getByRole("button", { name: /Zaczynamy/ })).toBeInTheDocument();
});

test("countries minigame can end early with confirmation and show missing countries", () => {
  window.history.replaceState({}, "", "/countries");
  render(<App />);
  start();
  fireEvent.change(screen.getByLabelText("Nazwa państwa"), {
    target: { value: "Polska" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Zakończ grę" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("1 z 45 państw");
  fireEvent.click(screen.getByRole("button", { name: "Tak, zakończ grę" }));
  expect(screen.getByText("1 / 45")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Do powtórki/ }));
  expect(document.querySelectorAll(".answer-row")).toHaveLength(44);
  expect(screen.queryByText("Polska")).not.toBeInTheDocument();
});

test("switching minigames initializes an independent round", () => {
  render(<App />);
  start();
  answer("Tirana");
  fireEvent.click(screen.getByRole("link", { name: "Państwa", exact: true }));
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  expect(screen.getByLabelText("Nazwa państwa")).toBeDisabled();
  start();
  fireEvent.change(screen.getByLabelText("Nazwa państwa"), {
    target: { value: "Polska" },
  });
  fireEvent.click(screen.getByRole("link", { name: "Stolice", exact: true }));
  expect(screen.getByRole("heading", { name: "Albania" })).toBeInTheDocument();
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  expect(screen.getByLabelText("Twoja odpowiedź")).toBeDisabled();
});
