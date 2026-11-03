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
    .replace(/[’'.,ʻʼ]/g, "")
    .replace(/[-‐‑–]/g, " ")
    .replace(/\s+/g, " ");
}

const capitalNames = (country) =>
  [
    country.capital,
    country.englishCapital,
    ...(country.aliases || []),
    ...(country.capitalVariants || []).flatMap((variant) => [
      variant.capital,
      variant.englishCapital,
      ...(variant.aliases || []),
    ]),
  ].filter(Boolean);
export function isCorrect(answer, country) {
  return capitalNames(country).some(
    (value) => normalize(value) === normalize(answer),
  );
}
export function isCapitalNamePrefix(answer, country) {
  const normalized = normalize(answer);
  return capitalNames(country).some(
    (name) =>
      normalize(name) !== normalized && normalize(name).startsWith(normalized),
  );
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
  ...(country.countryAliases || []),
];

export function findCountry(answer, pool = countries) {
  const normalized = normalize(answer);
  if (!normalized) return undefined;
  return pool.find((country) =>
    countryNames(country).some((name) => normalize(name) === normalized),
  );
}

export function isCountryNamePrefix(answer, country, pool = countries) {
  const normalized = normalize(answer);
  // A valid country can prefix another one: Niger → Nigeria, Guinea → Guinea-Bissau.
  return [...pool, country].some((item) =>
    countryNames(item).some(
      (name) =>
        normalize(name) !== normalized &&
        normalize(name).startsWith(normalized),
    ),
  );
}
