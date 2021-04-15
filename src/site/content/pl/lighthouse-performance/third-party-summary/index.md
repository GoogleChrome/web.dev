---
layout: post
title: Zmniejsz wpływ kodu innych firm
description: Dowiedz się, jak kod firm zewnętrznych, np. Sieci reklamowe i usługi analityczne, wpływa na wydajność ładowania strony i jak możesz zoptymalizować kod firm zewnętrznych.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - podsumowanie strony trzeciej
---

Aby dodać sieć reklamową, przycisk mediów społecznościowych, test A / B lub usługę analityczną do swojej strony, zwykle musisz dodać skrypt innej firmy do kodu HTML. Te [skrypty innych firm mogą znacząco wpłynąć na wydajność ładowania strony](/third-party-javascript/) .

## Jak nie udaje się audyt Lighthouse pod kątem kodu stron trzecich

Lighthouse oznacza strony z kodem innej firmy, który blokuje [główny wątek] na 250 ms lub dłużej:

<figure class="w-figure"><img class="w-screenshot" src="third-party-summary.png" alt="Zrzut ekranu z latarni morskiej Zmniejsz wpływ audytu kodu stron trzecich"></figure>

Skrypt innej firmy to dowolny skrypt hostowany w domenie innej niż domena adresu URL skontrolowanego przez firmę Lighthouse. Podczas ładowania strony Lighthouse oblicza, jak długo każdy ze skryptów innych firm blokuje główny wątek. Jeśli całkowity czas blokowania jest większy niż 250 ms, audyt kończy się niepowodzeniem.

## Jak zmniejszyć wpływ kodu firm trzecich

Zobacz [Identyfikowanie powolnych skryptów innych firm,](/identify-slow-third-party-javascript/) aby dowiedzieć się, jak używać narzędzi Chrome DevTools i innych audytów Lighthouse do wykrywania problematycznego kodu innych firm, a także [Efektywne ładowanie kodu JavaScript innej firmy na](/efficiently-load-third-party-javascript/) potrzeby strategii optymalizacji.

## Zasoby

- [Source code for **Reduce the impact of third-party code** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/third-party-summary.js)
- [Ładowanie JavaScript innej firmy](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/)


[główny wątek]: https://developer.mozilla.org/en-US/docs/Glossary/Main_thread