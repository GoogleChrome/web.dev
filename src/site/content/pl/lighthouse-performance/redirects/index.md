---
layout: post
title: Unikaj przekierowań do wielu stron
description: Dowiedz się, dlaczego przekierowania stron spowalniają jej ładowanie i jak ich unikać.
web_lighthouse:
- przekierowania
date: 2019-05-04
updated: 2019-09-19
---

Przekierowania spowalniają szybkość ładowania strony. Gdy przeglądarka żąda zasobu, który został przekierowany, serwer zwykle zwraca odpowiedź HTTP w następujący sposób:

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

Przeglądarka musi następnie wykonać kolejne żądanie HTTP w nowej lokalizacji, aby pobrać zasób. Ta dodatkowa podróż przez sieć może opóźnić ładowanie zasobu o setki milisekund.

## W jaki sposób audyt wielokrotnych przekierowań Lighthouse kończy się niepowodzeniem

Strony z flagami [Lighthouse,](https://developers.google.com/web/tools/lighthouse/) które mają wiele przekierowań:

<figure class="w-figure"><img class="w-screenshot" src="redirects.png" alt=""></figure>

Strona nie przejdzie tego audytu, jeśli ma dwa lub więcej przekierowań.

## Jak wyeliminować przekierowania

Wskaż łącza do oznaczonych zasobów w bieżących lokalizacjach zasobów. Szczególnie ważne jest unikanie przekierowań w zasobach wymaganych dla Twojej [krytycznej ścieżki renderowania](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) .

Jeśli używasz przekierowań, aby przekierowywać użytkowników mobilnych do mobilnej wersji swojej strony, rozważ przeprojektowanie witryny tak, aby korzystała z [elastycznego projektowania](https://developers.google.com/web/fundamentals/design-and-ux/responsive/) .

## Zasoby

- [Kod źródłowy audytu **Unikaj wielu przekierowań stron**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/redirects.js)
- [Przekierowania w HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
- [Unikaj przekierowań do strony docelowej](https://developers.google.com/speed/docs/insights/AvoidRedirects)
