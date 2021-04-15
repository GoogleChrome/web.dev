---
layout: post
title: Wstępne ładowanie żądań kluczy
description: Dowiedz się o audycie zastosowań i ponownego ładowania wstępnego.
date: '2019-05-02'
updated: '2020-06-04'
web_lighthouse:
  - używa-rel-preload
---

Sekcja Możliwości raportu Lighthouse oznacza trzeci poziom żądań w łańcuchu żądań krytycznych jako kandydatów do wstępnego ładowania:

<figure class="w-figure"><img class="w-screenshot" src="uses-rel-preload.png" alt="Zrzut ekranu audytu żądań kluczy Lighthouse Preload"></figure>

## Jak flagi Lighthouse określają kandydatów do wstępnego ładowania

Załóżmy, że [łańcuch żądań krytycznych](/critical-request-chains) Twojej strony wygląda następująco:

```html
index.html
|--app.js
   |--styles.css
   |--ui.js
```

Twój plik `index.html` deklaruje `<script src="app.js">` . Po uruchomieniu `app.js` `fetch()` w celu pobrania `styles.css` i `ui.js` Strona nie jest kompletna, dopóki te 2 ostatnie zasoby nie zostaną pobrane, przeanalizowane i wykonane. Korzystając z powyższego przykładu, Lighthouse `styles.css` i `ui.js` jako kandydatów.

The potential savings are based on how much earlier the browser would be able to start the requests if you declared preload links. For example, if `app.js` takes 200ms to download, parse, and execute, the potential savings for each resource is 200ms since `app.js` is no longer a bottleneck for each of the requests.

Żądania wczytywania wstępnego mogą przyspieszyć ładowanie stron.

<figure>   <img src="before.png" alt="Without preload links, styles.css and ui.js are requested only after
            app.js has been downloaded, parsed, and executed.">   <figcaption>     Without preload links, <code>styles.css</code> and     <code>ui.js</code> are requested only after <code>app.js</code> has been downloaded,     parsed, and executed.   </figcaption> </figure>

The problem here is that the browser only becomes aware of those last 2 resources after it downloads, parses, and executes `app.js`. But you know that those resources are important and should be downloaded as soon as possible.

## Zadeklaruj linki do wstępnego ładowania

Zadeklaruj linki do wstępnego ładowania w kodzie HTML, aby poinstruować przeglądarkę, aby jak najszybciej pobrała kluczowe zasoby.

```html
<head>
  ...
  <link rel="preload" href="styles.css" as="style">
  <link rel="preload" href="ui.js" as="script">
  ...
</head>
```

<figure>   <img src="after.png" alt="With preload links, styles.css and ui.js are requested at the same time
            as app.js.">   <figcaption>     With preload links, <code>styles.css</code> and     <code>ui.js</code> are requested at the same time as <code>app.js</code>.   </figcaption> </figure>

Aby uzyskać więcej wskazówek, zobacz także [Wstępne ładowanie krytycznych zasobów w celu przyspieszenia ładowania](/preload-critical-assets) .

### Zgodność z przeglądarkami

Od czerwca 2020 r. Wstępne ładowanie jest obsługiwane w przeglądarkach opartych na Chromium. Aby uzyskać aktualizacje, patrz [Zgodność przeglądarek](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#Browser_compatibility) .

### Utwórz obsługę narzędzi do wstępnego ładowania {: #tools}

Zobacz stronę [Tooling.Report's Preloading Assets](https://bundlers.tooling.report/non-js-resources/html/preload-assets/?utm_source=web.dev&utm_campaign=lighthouse&utm_medium=uses-rel-preload) .

## Zasoby

- [Kod źródłowy do audytu **żądań kluczy wczytywania wstępnego**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/uses-rel-preload.js)
