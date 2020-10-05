---
layout: post
title: Usuń nieużywany JavaScript
description: Dowiedz się, jak przejść audyt „Usuń nieużywany JavaScript” firmy Lighthouse.
web_lighthouse:
- unused-javascript
date: 2020-07-07
---

Niewykorzystany kod JavaScript może spowolnić ładowanie strony:

- Jeśli JavaScript [blokuje renderowanie] , przeglądarka musi pobrać, przeanalizować, skompilować i ocenić skrypt, zanim będzie mogła wykonać wszystkie inne prace potrzebne do renderowania strony.
- Nawet jeśli JavaScript jest asynchroniczny (tj. Nie blokuje renderowania), podczas pobierania kod konkuruje o przepustowość z innymi zasobami, co ma znaczący wpływ na wydajność. Wysyłanie nieużywanego kodu przez sieć jest również marnotrawstwem dla użytkowników mobilnych, którzy nie mają nieograniczonych planów transmisji danych.

## Jak nieużywany audyt JavaScript kończy się niepowodzeniem

[Lighthouse oznacza](https://developers.google.com/web/tools/lighthouse/) każdy plik JavaScript z więcej niż 20 kibibajtami nieużywanego kodu:

<figure class="w-figure"><img class="w-screenshot" src="remove-unused-javascript.jpg" alt="Zrzut ekranu audytu."><figcaption class="w-figcaption">Kliknij wartość w kolumnie <b>URL,</b> aby otworzyć kod źródłowy skryptu w nowej karcie.</figcaption></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak usunąć nieużywany JavaScript

### Wykryj nieużywany JavaScript

Karta [Pokrycie] w Chrome DevTools zawiera zestawienie wiersz po wierszu nieużywanego kodu.

Klasa [`Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage) w Puppeteer może pomóc zautomatyzować proces wykrywania nieużywanego kodu i wyodrębniania używanego kodu.

### Zbuduj narzędzie wspierające usuwanie nieużywanego kodu

Sprawdź następujące narzędzia. [Zgłoś] testy, aby dowiedzieć się, czy Twój pakiet obsługuje funkcje, które ułatwiają unikanie lub usuwanie nieużywanego kodu:

- [Podział kodu]
- [Eliminacja nieużywanego kodu]
- [Niewykorzystany importowany kod]

## Zasoby

- [Kod źródłowy do audytu **Usuń nieużywany kod**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-javascript.js)
- [Usuń nieużywany kod](/remove-unused-code/)
- [Dodanie interaktywności z JavaScriptem](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript)
- [Podział kodu](https://bundlers.tooling.report/code-splitting/)
- [Eliminacja martwego kodu](https://bundlers.tooling.report/transformations/dead-code/)
- [Martwy importowany kod](https://bundlers.tooling.report/transformations/dead-code-dynamic/)
- [Znajdź nieużywany kod JavaScript i CSS za pomocą zakładki Pokrycie w Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/coverage)
- [klasa: `Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage)


[blokuje renderowanie]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript
[Pokrycie]: https://developers.google.com/web/tools/chrome-devtools/coverage
[Podział kodu]: https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage
[Eliminacja nieużywanego kodu]: https://bundlers.tooling.report/code-splitting/
[Niewykorzystany importowany kod]: https://bundlers.tooling.report/transformations/dead-code/
[Zgłoś]: https://bundlers.tooling.report/transformations/dead-code-dynamic/