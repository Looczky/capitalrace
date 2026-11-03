import { render, screen } from "@testing-library/react";
import { useZoomPanContext } from "react-simple-maps";
import CapitalMarkers from "./CapitalMarkers";
import countries from "../../data/countries.json";

jest.mock("react-simple-maps", () => ({
  Marker: ({ children, coordinates }) => (
    <g data-coordinates={JSON.stringify(coordinates)}>{children}</g>
  ),
  useZoomPanContext: jest.fn(),
}));

function markers(results, zoom) {
  useZoomPanContext.mockReturnValue({ k: zoom });
  return (
    <svg>
      <CapitalMarkers results={results} />
    </svg>
  );
}

test("does not reveal unguessed capitals even at maximum zoom", () => {
  const { container } = render(markers([], 4));
  expect(container.querySelector(".capital-marker")).not.toBeInTheDocument();
  expect(screen.queryByText("Warszawa")).not.toBeInTheDocument();
});

test("shows only guessed capitals from 2x and hides them again when zooming out", () => {
  const { rerender } = render(markers(["Poland"], 1.99));
  expect(screen.queryByText("Warszawa")).not.toBeInTheDocument();
  rerender(markers(["Poland"], 2));
  expect(
    screen.getByRole("img", { name: "Warszawa — odgadnięta stolica: Polska" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Berlin")).not.toBeInTheDocument();
  const marker = screen.getByText("Warszawa").closest(".capital-marker");
  expect(marker.parentElement).toHaveAttribute(
    "data-coordinates",
    JSON.stringify(
      countries.find((country) => country.name === "Poland").capitalCoordinates,
    ),
  );
  rerender(markers(["Poland"], 1));
  expect(screen.queryByText("Warszawa")).not.toBeInTheDocument();
});

test("adding a correct answer reveals its marker without changing zoom", () => {
  const { rerender } = render(markers(["Poland"], 4));
  expect(screen.getAllByRole("img")).toHaveLength(1);
  rerender(markers(["Poland", "Germany"], 4));
  expect(screen.getAllByRole("img")).toHaveLength(2);
  expect(screen.getByText("Berlin")).toBeInTheDocument();
  expect(screen.getByText("Berlin").closest(".capital-marker")).toHaveAttribute(
    "transform",
    "scale(0.25)",
  );
});
