# Capitalrace

Gra w stolice 45 krajów Europy. Polski interfejs, mapa postępu i podsumowanie z odpowiedziami do powtórki.

## Uruchomienie

Wymagane: Node.js i npm.

```bash
cd frontend
npm ci
npm start
```

Otwórz http://localhost:3000. Gra korzysta z lokalnego zestawu danych i mapy, więc backend ani baza danych nie są wymagane. Fonty Google są opcjonalne — w razie braku sieci używany jest font systemowy.

## Zasady

- Kliknij **Zaczynamy**, aby uruchomić timer.
- Wpisz stolicę po polsku lub angielsku — poprawna odpowiedź jest zaliczana automatycznie, bez klawisza **Enter**. Wielkość liter, znaki diakrytyczne i spacje na początku lub końcu nie mają znaczenia.
- **Esc** lub **Pomiń na razie** przenosi kraj na koniec kolejki. Spacje w nazwach stolic działają normalnie.
- Możesz próbować ponownie bez kary i bez limitu czasu.
- Po odgadnięciu wszystkich stolic albo zakończeniu rundy zobaczysz wynik i pełny atlas odpowiedzi. Wynik jest przechowywany w obrębie bieżącej sesji przeglądarki, również po odświeżeniu strony.

Zestaw zachowuje 45 krajów z oryginalnej gry. Dane i polskie nazwy znajdują się w `frontend/src/data/countries.json`; pole `name` odpowiada nazwom na mapie, `label` jest nazwą wyświetlaną, a `capital` i `englishCapital` są akceptowanymi odpowiedziami. Opcjonalne `aliases` pozwala dodać kolejne warianty.

## Testy i build

```bash
cd frontend
npm test -- --watchAll=false --runInBand
npm run build
```

Build znajduje się w `frontend/build`. Hosting musi przekierowywać ścieżki aplikacji (w tym `/results`) na `index.html`.

## Starszy backend

Oryginalne API Django pozostaje w `backend/` jako niezależna część projektu; nowy frontend go nie wywołuje. Nie jest wymagane do gry.

Flagi państw są lokalnymi plikami SVG w `frontend/public/flags/`, pochodzącymi z zestawu [flag-icons](https://github.com/lipis/flag-icons) na licencji MIT (kopia licencji w tym katalogu). Pole `code` w danych państwa określa plik flagi.
