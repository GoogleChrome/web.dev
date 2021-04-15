---
layout: post
title: Unikaj nieskomponowanych animacji
description: Jak przejść audyt „Unikaj nieskomponowanych animacji”.
date: '2020-08-12'
web_lighthouse:
  - animacje nieskomponowane
---

Nieskomponowane animacje mogą wydawać się szarpane (tj. Nie gładkie) na słabszych telefonach lub gdy w głównym wątku są wykonywane zadania wymagające dużej wydajności. Janky animacje może zwiększyć [skumulowane przesunięcie układu](/cls/) (CLS) strony. Zmniejszenie CLS poprawi Twój wynik Lighthouse Performance.

## tło

Algorytmy przeglądarki do konwersji HTML, CSS i JavaScript na piksele są wspólnie nazywane *potokiem renderowania* .

<figure class="w-figure"><img src="rendering-pipeline.jpg" alt="Renderowanie składa się z następujących kolejnych kroków: JavaScript, styl, układ, malowanie, kompozyt."><figcaption class="w-figcaption">Potok renderowania.</figcaption></figure>

W porządku, jeśli nie rozumiesz, co oznacza każdy krok potoku renderowania. Kluczową rzeczą do zrozumienia w tej chwili jest to, że na każdym etapie potoku renderowania przeglądarka wykorzystuje wynik poprzedniej operacji do tworzenia nowych danych. Na przykład, jeśli kod wykonuje coś, co wyzwala układ, kroki Paint i Composite muszą zostać uruchomione ponownie. Animacja nieskomponowana to dowolna animacja, która wyzwala jeden z wcześniejszych kroków w potoku renderowania (styl, układ lub malowanie). Nieskomponowane animacje działają gorzej, ponieważ zmuszają przeglądarkę do większej pracy.

Zapoznaj się z następującymi zasobami, aby uzyskać szczegółowe informacje na temat potoku renderowania:

- [Wewnątrz spojrzenie na nowoczesne przeglądarki internetowe (część 3)]
- [Uprość złożoność malowania i zmniejsz obszary malowania]
- [Trzymaj się właściwości tylko dla kompozytora i zarządzaj liczbą warstw]

## Jak Lighthouse wykrywa nieskomponowane animacje

Gdy animacji nie można połączyć, Chrome zgłasza przyczyny niepowodzenia do śladu DevTools, który odczytuje Lighthouse. Lighthouse wyświetla listę węzłów DOM, które mają animacje, które nie zostały połączone, wraz z przyczynami niepowodzeń dla każdej animacji.

## Jak zapewnić kompozycję animacji

Zobacz [Trzymaj się właściwości tylko dla kompozytora i zarządzaj liczbą warstw](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count) i [animacjami o wysokiej wydajności] .

## Zasoby

- [Kod źródłowy dla audytu *Unikaj niezłożonych animacji*](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/non-composited-animations.js)
- [Trzymaj się właściwości tylko dla kompozytora i zarządzaj liczbą warstw](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
- [Animacje o wysokiej wydajności](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [Uprość złożoność malowania i zmniejsz obszary malowania](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas)
- [Wewnątrz spojrzenie na nowoczesne przeglądarki internetowe (część 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)


[Trzymaj się właściwości tylko dla kompozytora i zarządzaj liczbą warstw]: https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count
[animacjami o wysokiej wydajności]: https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
[Uprość złożoność malowania i zmniejsz obszary malowania]: https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas
[Wewnątrz spojrzenie na nowoczesne przeglądarki internetowe (część 3)]: https://developers.google.com/web/updates/2018/09/inside-browser-part3