# Dane regionalne Capitalrace

Stan weryfikacji: 3 listopada 2026 r.

## Zakres

Europa zachowuje oryginalne 45 krajów. Nowe zestawy: Azja 47, Afryka 54, Ameryka Północna 23 (w tym Ameryka Środkowa i Karaiby), Ameryka Południowa 12. Rosja i Cypr są przypisane do Europy. Wśród nowych zestawów uwzględniono państwa członkowskie ONZ i Palestynę, bez terytoriów zależnych. Jest to jawny podział na zestawy gry, a nie próba przedstawienia wszystkich możliwych podziałów geograficznych.

- [ONZ: członkostwo](https://research.un.org/en/unmembers), [państwa-obserwatorzy](https://www.un.org/en/about-us/non-member-states).
- Polskie nazewnictwo: [KSNG — urzędowy wykaz nazw państw i terytoriów](https://www.gov.pl/web/ksng/Urzedowy-wykaz-nazw-panstw-i-terytoriow-niesamodzielnych). Gra akceptuje też angielskie nazwy oraz wybrane synonimy.

## Mapy i współrzędne

Mapy nowych regionów są wycinkami [Natural Earth — admin 0, 1:50m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson). Geometrie wybrano po kodzie ISO, nazwy powiązano z identyfikatorami gry, a współrzędne granic zaokrąglono do czterech miejsc po przecinku. Oryginalna mapa Europy pozostała bez zmian.

Współrzędne miast pochodzą z [Natural Earth — populated places](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_populated_places_simple.geojson). Starsze oznaczenia stolic w tym źródle nie są używane automatycznie: Gitega została dobrana po nazwie miasta, a Ciudad de la Paz, Sri Dźajawardanapura Kotte i Jerozolima Wschodnia mają jawnie podane współrzędne punktów odniesienia. Współrzędne są przybliżonymi lokalizacjami miast do quizu, nie danymi adresowymi.

Natural Earth udostępnia dane jako [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Flagi pochodzą z [flag-icons](https://github.com/lipis/flag-icons); licencja MIT jest w `frontend/public/flags/LICENSE`.

`region-map-layouts.json` opisuje obwiednie geometrii w projekcji azymutalnej równopowierzchniowej o rotacji zapisanej w `regions.js`. Zostały obliczone funkcją `geoPath(projection).bounds(featureCollection)` dla skali 1 i przesunięcia `[0, 0]`. Pole `cameraCenter` jest odwrotną projekcją środka obwiedni. Mapa dopasowuje skalę do szerokości i wysokości widoku z marginesem, dzięki czemu cały region jest widoczny przy 1×.

## Zweryfikowane przypadki stolic

- Gwinea Równikowa: **Ciudad de la Paz**, zgodnie z [komunikatem prezydencji z 2 stycznia 2026](https://www.guineaecuatorialpress.com/noticias/el_presidente_de_la_republica_proclama_la_ciudad_de_la_paz_como_capital_de_la_republica_de_guinea_ecuatorial_con_la_firma_de_un_decreto_ley). Malabo nie jest akceptowane jako aktualna stolica. Akceptowane są także wcześniejsze nazwy nowego miasta: Oyala i Djibloho.
- Burundi: **Gitega**; Bużumbura pozostaje ośrodkiem gospodarczym. [Portal premiera Burundi](https://primature.gov.bi/presentation-generale/).
- RPA: **Pretoria, Kapsztad i Bloemfontein** są akceptowane, zgodnie z podziałem funkcji administracyjnych, ustawodawczych i sądowniczych. [Rząd RPA](https://www.gov.za/about-sa/south-africas-provinces).
- Boliwia: **Sucre** oraz **La Paz** — konstytucyjna stolica i siedziba rządu. [Ambasada Boliwii](https://bolivianembassy.ca/bolivia/el-pais/datos-generales/).
- Eswatini: **Mbabane i Lobamba** — funkcje administracyjne oraz królewskie i ustawodawcze. [Unia Afrykańska](https://au.int/en/cities/lobambaroyal-and-legislative-mbabane-administrative).
- Sri Lanka: główną odpowiedzią jest **Sri Dźajawardanapura Kotte**, z akceptowanym wariantem **Kolombo** ze względu na jego funkcje rządowe. [Rada miejska Kotte](https://www.kotte.mc.gov.lk/index.php?Itemid=175&id=25&lang=en&option=com_content&view=article), [plan Urban Development Authority](https://www.uda.gov.lk/attachments/dev-plans-2021-2030/kotte_development_plan_Eng.pdf.pdf).
- Indonezja: **Dżakarta**. Nie traktujemy planowanego przeniesienia do Nusantary jako zakończonego. [Oficjalny komunikat IKN o celu na 2028 r.](https://ikn.go.id/storage/press-release/2025/20250228.2siaran-pers-membangun-ibu-kota-politik-yang-siap-hadapi-masa-depan.pdf), [orzeczenie Sądu Konstytucyjnego z 2026 r.](https://www.mkri.id/public/content/persidangan/putusan/putusan_mkri_14254_1778573044.pdf).
- Palestyna: **Jerozolima Wschodnia** jako deklarowana stolica, z akceptowaną **Ramallah** jako siedzibą administracji. [Palestyńskie ministerstwo spraw zagranicznych](https://www.mofa.pna.ps/en-us/mn/our-position). Izrael ma w zestawie Jerozolimę; w wynikach odnotowano sporny status miasta.

Warianty pełnią funkcję ułatwienia edukacyjnego. Odpowiednie objaśnienia są częścią danych i pojawiają się w wynikach. Przy odgadniętym kraju mapa pokazuje wszystkie akceptowane warianty stolic, nie tylko główny punkt.

## Uzupełnienie: cały świat

Zestaw `world` składa się z 181 państw dotychczasowych regionów i 14 państw Oceanii zapisanych w `oceania.json`: łącznie 195 unikalnych państw. Powiązanie mapy nadal opiera się na Natural Earth; w widoku świata zachowano także geometrię terytoriów zależnych oraz Antarktydy jako kontekst. Terytoria zależne nie zwiększają liczby odpowiedzi, a ich kolorowanie może być powiązane z państwem macierzystym.

Projekcja Equal Earth jest dopasowana do obwiedni całej sfery (`geoPath(geoEqualEarth()).bounds({type: 'Sphere'})`, przy skali 1 i przesunięciu `[0,0]`). Zapobiega to zniekształceniom i ucinaniu mapy na południku zmiany daty, które występowałyby przy zastosowaniu projekcji azymutalnej do całego świata.

- Palau: **Ngerulmud**, zgodnie z [oficjalną stroną spotkania Pacific Islands Forum w Palau](https://55piflm.gov.pw/about). Nie używamy dawnego Koror; lokalizacja Ngerulmud jest podana jawnie, ponieważ starsza warstwa miast zawiera nazwę Melekeok.
- Kiribati: **Tarawa Południowa / South Tarawa**, z akceptowanymi nazwami Tarawa i Bairiki. [Millennium Challenge Corporation](https://www.mcc.gov/where-we-work/program/kiribati-threshold-program/).
- Nauru: brak oficjalnej stolicy; **Yaren** jest siedzibą władz i jest akceptowane jako odpowiedź w quizie, obok „brak oficjalnej stolicy”. [UNCTAD](https://dgff2021.unctad.org/wp-content/uploads/pdf/Dgff2021_Cp_520.pdf), [OECD](https://www.oecd.org/content/dam/oecd/en/publications/reports/2019/07/global-forum-on-transparency-and-exchange-of-information-for-tax-purposes-nauru-2019-second-round_3067e2a3/43120c29-en.pdf). Współrzędne Yaren podano jawnie.

Pozostałe punkty stolic Oceanii pochodzą z tej samej warstwy populated places Natural Earth. Dodatkowe flagi mają tę samą licencję flag-icons.
