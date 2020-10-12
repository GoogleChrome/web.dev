---
layout: post
title: Zminimalizuj pracę głównego wątku
description: Dowiedz się o głównym wątku przeglądarki i o tym, jak zoptymalizować swoją stronę internetową, aby zmniejszyć obciążenie głównego wątku i poprawić wydajność.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
- podział pracy głównego wątku
---

Proces [renderowania](https://developers.google.com/web/updates/2018/09/inside-browser-part3) przeglądarki zamienia kod w stronę internetową, z którą użytkownicy mogą wchodzić w interakcje. Domyślnie [główny wątek](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread) procesu renderowania zazwyczaj obsługuje większość kodu: analizuje HTML i buduje DOM, analizuje CSS i stosuje określone style oraz analizuje, ocenia i wykonuje JavaScript.

Główny wątek przetwarza również zdarzenia użytkownika. Tak więc za każdym razem, gdy główny wątek jest zajęty czymś innym, Twoja strona internetowa może nie reagować na interakcje użytkownika, co prowadzi do złych wrażeń.

## Jak zawodzi audyt pracy głównego wątku Lighthouse

Strony z flagami [Lighthouse,](https://developers.google.com/web/tools/lighthouse/) które podczas ładowania zajmują główny wątek dłużej niż 4 sekundy:

<figure class="w-figure"><img class="w-screenshot" src="mainthread-work-breakdown.png" alt="Zrzut ekranu audytu pracy Lighthouse Minimize"></figure>

Aby pomóc Ci zidentyfikować źródła obciążenia głównego wątku, Lighthouse pokazuje podział czasu procesora, gdy przeglądarka ładowała twoją stronę.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak zminimalizować pracę głównego wątku

Poniższe sekcje są zorganizowane w oparciu o kategorie zgłoszone przez Lighthouse. Zobacz [Anatomia ramki,](https://aerotwist.com/blog/the-anatomy-of-a-frame/) aby dowiedzieć się, jak Chromium renderuje strony internetowe.

See [Do less main thread work](https://developers.google.com/web/tools/chrome-devtools/speed/get-started#main) to learn how to use Chrome DevTools to to investigate exactly what your main thread is doing as the page loads.

### Ocena skryptu

- [Zoptymalizuj JavaScript innej firmy](/fast/#optimize-your-third-party-resources)
- [Usuń elementy obsługi wejścia](https://developers.google.com/web/fundamentals/performance/rendering/debounce-your-input-handlers)
- [Użyj pracowników internetowych](/off-main-thread/)

### Styl i układ

- [Zmniejsz zakres i złożoność obliczeń stylu](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)
- [Unikaj dużych, złożonych układów i niepotrzebnych zmian](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)

### Wykonanie

- [Trzymaj się właściwości tylko dla kompozytora i zarządzaj liczbą warstw](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
- [Uprość złożoność malowania i zmniejsz obszary malowania](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas)

### Parsowanie HTML i CSS

- [Wyodrębnij krytyczny CSS](/extract-critical-css/)
- [Zmniejsz CSS](/minify-css/)
- [Odłóż niekrytyczne CSS](/defer-non-critical-css/)

### Analiza i kompilacja skryptów

- [Zmniejsz liczbę ładunków JavaScript dzięki dzieleniu kodu](/reduce-javascript-payloads-with-code-splitting/)
- [Usuń nieużywany kod](/remove-unused-code/)

### Zbieranie śmieci

- [Monitoruj całkowite wykorzystanie pamięci swojej strony internetowej za pomocą `measureMemory()`](/monitor-total-page-memory-usage/)

## Zasoby

- [Kod źródłowy dla audytu **pracy Minimalizuj główny wątek**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)
- [Główny wątek (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread)
- [Wewnątrz spojrzenie na nowoczesną przeglądarkę internetową (część 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
