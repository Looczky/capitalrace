# Capitalrace

Dwie minigry geograficzne na mapach świata: stolice i państwa. Polski interfejs, mapa postępu i osobne podsumowania z odpowiedziami do powtórki.

## Uruchomienie

Wymagane: Node.js i npm.

```bash
cd frontend
npm ci
npm start
```

Otwórz http://localhost:3000. Gra korzysta z lokalnych zestawów danych i map, więc backend ani baza danych nie są wymagane. Fonty Google są opcjonalne — w razie braku sieci używany jest font systemowy.

## Zasady

- Kliknij **Zaczynamy**, aby uruchomić timer.
- Wpisz stolicę po polsku lub angielsku — poprawna odpowiedź jest zaliczana automatycznie, bez klawisza **Enter**. Wielkość liter, znaki diakrytyczne i spacje na początku lub końcu nie mają znaczenia.
- **Esc** lub **Pomiń na razie** przenosi kraj na koniec kolejki. Spacje w nazwach stolic działają normalnie.
- Możesz próbować ponownie bez kary i bez limitu czasu.
- Czerwony przycisk **Zakończ grę** otwiera potwierdzenie. Wybierz **Gram dalej**, aby wrócić do rundy, albo **Tak, zakończ grę**, aby zobaczyć wynik i pełny atlas odpowiedzi — także bez żadnej poprawnej odpowiedzi.
- Po odgadnięciu wszystkich stolic albo zakończeniu rundy zobaczysz wynik i pełny atlas odpowiedzi. Wynik jest przechowywany w obrębie bieżącej sesji przeglądarki, również po odświeżeniu strony.

Zestaw Europy zachowuje 45 krajów z oryginalnej gry. Dane i polskie nazwy znajdują się w `frontend/src/data/countries.json`; pole `name` odpowiada nazwom na mapie, `label` jest nazwą wyświetlaną, a `capital` i `englishCapital` są akceptowanymi odpowiedziami. Opcjonalne `aliases` pozwala dodać kolejne warianty.

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

## Wariant z mapą na pierwszym planie

Pełnoekranowa mapa z panelem odpowiedzi i statystykami na mapie jest domyślnym designem na `main`. Branch `design/map-first` zachowuje pierwszy wariant tego układu.

- Przesuwanie: przeciągnij mapę myszą lub palcem.
- Powiększenie: kółko myszy, gest dwóch palców lub przyciski **+ / −**, w zakresie **1–4×**.
- Przycisk **Pokaż całą Europę** przywraca początkowy środek i powiększenie.
- Po ustawieniu fokusu na mapie można używać strzałek, **+**, **−** oraz **Home**. Skróty mapy nie przechwytują wpisywania odpowiedzi.
- Przesunięcie mapy jest ograniczone, aby nie oddalić się bez końca od Europy. Zmiana pytania zachowuje wybraną pozycję mapy.

### Odgadnięte stolice na mapie

Przy powiększeniu **od 2×** pojawiają się granatowo-turkusowe punkty z polskimi nazwami **wyłącznie odgadniętych** stolic. Po oddaleniu poniżej 2× oznaczenia znikają. Punkt i napis zachowują czytelny rozmiar podczas zmiany zoomu; nie są pokazywane dla nieodgadniętych ani pominiętych krajów.

Współrzędne `capitalCoordinates` mają format `[długość geograficzna, szerokość geograficzna]` i pochodzą z [Natural Earth — Populated Places](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-populated-places/), z [pliku GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_populated_places_simple.geojson) (dane public domain).

## Druga minigra: państwa Europy

Wybierz **Państwa** w przełączniku minigier lub otwórz `/countries`. Wpisuj dowolne z 45 państw zestawu w dowolnej kolejności. Poprawna pełna nazwa automatycznie koloruje państwo na zielono. Gra kończy się po odgadnięciu wszystkich państw albo po potwierdzeniu czerwonego przycisku zakończenia.

- Akceptowane są nazwy polskie i angielskie, bez rozróżniania wielkości liter i znaków diakrytycznych, oraz warianty takie jak „Niderlandy” i „Czechia”.
- Powtórzone państwo nie zwiększa wyniku.
- Przed odgadnięciem mapa nie zdradza nazwy kraju w podpowiedziach. Ten tryb nie wskazuje wybranego kraju ani nie pokazuje nazw stolic.
- Wyniki państw są na `/countries/results`, zapisywane osobno od wyników stolic i zachowywane po odświeżeniu.
- Przełączenie minigry rozpoczyna nową rundę wybranego trybu.

## Regiony w obu minigrach

Wybierz region w nagłówku. Przełącznik **Stolice / Państwa** zachowuje wybrany region. Zmiana regionu rozpoczyna nową rundę wybranej minigry. Wyniki dziesięciu kombinacji regionu i minigry są przechowywane oddzielnie; starsze wyniki Europy pozostają obsługiwane.

| Region | Liczba państw | Stolice | Państwa |
| --- | ---: | --- | --- |
| Europa | 45 | `/` | `/countries` |
| Azja | 47 | `/play/asia` | `/play/asia/countries` |
| Afryka | 54 | `/play/africa` | `/play/africa/countries` |
| Ameryka Północna | 23 | `/play/north-america` | `/play/north-america/countries` |
| Ameryka Południowa | 12 | `/play/south-america` | `/play/south-america/countries` |

Zestaw Ameryki Północnej obejmuje Amerykę Środkową i Karaiby. Nowe zestawy obejmują państwa członkowskie ONZ oraz Palestynę; nie obejmują terytoriów zależnych. Rosja i Cypr pozostają w oryginalnym zestawie Europy i nie są powielane w Azji. Przyjęty podział jest opisany również w pomocy gry.

Dane regionalne znajdują się w `frontend/src/data/`, konfiguracja w `regions.js`, a mapy nowych regionów w `frontend/public/maps/`. Pozycje małych państw wyspiarskich są dodatkowo oznaczane punktami, aby można było dostrzec ich postęp. Przed odgadnięciem nie są ujawniane nazwy państw ani stolic.

Dla nazw, które są początkiem dłuższej odpowiedzi (np. Niger → Nigeria, Gwinea → Gwinea Bissau, Sana → Sanaa), gra krótko czeka na dokończenie wpisywania. Stolice wielofunkcyjne mają akceptowane warianty i objaśnienia na ekranie wyników; po odgadnięciu kraju w grze w stolice można zobaczyć te miasta na mapie od 2×.

Źródła, szczegóły aktualizacji stolic i zasady danych: [docs/data-sources.md](docs/data-sources.md).
