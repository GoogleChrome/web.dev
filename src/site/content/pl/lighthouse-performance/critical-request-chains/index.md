---
layout: post
title: Unikaj łączenia krytycznych żądań
description: Dowiedz się, jakie są krytyczne łańcuchy żądań, jak wpływają na wydajność strony internetowej i jak możesz zmniejszyć ten efekt.
date: '2019-05-02'
updated: '2020-04-29'
web_lighthouse:
  - łańcuchy żądań krytycznych
---

[Łańcuchy żądań krytycznych](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) to seria zależnych żądań sieciowych, które są ważne dla renderowania strony. Im większa długość łańcuchów i większe rozmiary pobierania, tym większy wpływ na wydajność ładowania strony.

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) zgłasza krytyczne żądania załadowane z wysokim priorytetem:

<figure class="w-figure"><img class="w-screenshot" src="critical-request-chains.png" alt="Zrzut ekranu audytu głębokości krytycznych żądań Lighthouse Minimize"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak Lighthouse identyfikuje krytyczne łańcuchy żądań

Lighthouse używa priorytetu sieci jako proxy do identyfikowania krytycznych zasobów blokujących renderowanie. Więcej informacji o tym, jak Chrome definiuje te priorytety, znajdziesz w Google [Chrome Resource Priorities and Scheduling](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) .

Dane o krytycznych łańcuchach żądań, rozmiarach zasobów i czasie spędzonym na ich pobieraniu są pobierane z [protokołu Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol) .

## Jak zmniejszyć wpływ krytycznych łańcuchów żądań na wydajność

Skorzystaj z wyników audytu krytycznych łańcuchów żądań, aby w pierwszej kolejności wskazać zasoby, które mają największy wpływ na ładowanie strony:

- Zminimalizuj liczbę krytycznych zasobów: wyeliminuj je, odrocz ich pobieranie, oznacz je jako `async` i tak dalej.
- Zoptymalizuj liczbę krytycznych bajtów, aby skrócić czas pobierania (liczba podróży w obie strony).
- Zoptymalizuj kolejność ładowania pozostałych krytycznych zasobów: pobierz wszystkie krytyczne zasoby tak wcześnie, jak to możliwe, aby skrócić krytyczną długość ścieżki.

Dowiedz się więcej o optymalizacji [obrazów](/use-imagemin-to-compress-images) , [JavaScript](/apply-instant-loading-with-prpl) , [CSS](/defer-non-critical-css) i [czcionek internetowych](/avoid-invisible-text) .

## Zasoby

[Kod źródłowy do audytu **głębokości krytycznych żądań minimalizuj**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)
