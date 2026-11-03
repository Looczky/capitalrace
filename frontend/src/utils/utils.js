import countries from "../data/countries.json";

export default function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/\s+/g, " ");
}

export function isCorrect(answer, country) {
  return [country.capital, country.englishCapital, ...(country.aliases || [])]
    .filter(Boolean)
    .some((value) => normalize(value) === normalize(answer));
}

export function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

const countryAliases = {
  Netherlands: ["Niderlandy", "The Netherlands"],
  "Czech Republic": ["Czechia"],
  "United Kingdom": ["Zjednoczone Królestwo", "Great Britain"],
  "Vatican City": ["Holy See"],
};

const countryNames = (country) => [
  country.label,
  country.name,
  ...(countryAliases[country.name] || []),
];

export function findCountry(answer) {
  const normalized = normalize(answer);
  if (!normalized) return undefined;
  return countries.find((country) =>
    countryNames(country).some((name) => normalize(name) === normalized),
  );
}

export function isCountryNamePrefix(answer, country) {
  const normalized = normalize(answer);
  return countryNames(country).some(
    (name) =>
      normalize(name) !== normalized && normalize(name).startsWith(normalized),
  );
}
