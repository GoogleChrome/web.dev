---
layout: post
title: Oznaczenia i miary czasu użytkownika
description: Dowiedz się, jak interfejs User Timing API może pomóc w uzyskaniu rzeczywistych danych o wydajności Twojej strony internetowej.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
- user-timings
---

## Co to jest interfejs User Timing API?

Szybka i responsywna aplikacja internetowa ma kluczowe znaczenie dla dobrego doświadczenia użytkownika. Pierwszym krokiem do poprawy wydajności jest określenie, gdzie spędza się czas.

Interfejs [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) umożliwia mierzenie wydajności JavaScript aplikacji. Robisz to, wstawiając wywołania API w swoim JavaScript, a następnie wyodrębniając szczegółowe dane dotyczące czasu, których możesz użyć do optymalizacji kodu. Możesz uzyskać dostęp do tych danych z JavaScript za pomocą interfejsu API lub przeglądając je w [nagraniach osi czasu Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference) .

Zajrzyj na stronę [HTML5 Rocks o interfejsie User Timing API,](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/) aby uzyskać szybkie wprowadzenie do korzystania z niego.

## Jak Lighthouse raportuje dane o czasie użytkownika

Gdy Twoja aplikacja korzysta z interfejsu User Timing API do dodawania znaczników (czyli znaczników czasu) i miar (czyli pomiarów czasu, który upłynął między znakami), zobaczysz je w raporcie [Lighthouse](https://developers.google.com/web/tools/lighthouse/) :

<figure class="w-figure"><img class="w-screenshot" src="user-timings.png" alt="Zrzut ekranu ze znacznikami czasu użytkownika Lighthouse i audytem środków"></figure>

Lighthouse wyodrębnia dane o czasie użytkownika z [narzędzia do profilowania zdarzeń śledzenia w Chrome](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) .

Ten audyt nie jest zorganizowany jako test pozytywny lub negatywny. To tylko okazja, aby odkryć przydatny interfejs API, który pomoże Ci zmierzyć wydajność Twojej aplikacji.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Zasoby

- [Source code for **User Timing marks and measures** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/user-timings.js)
- [User Timing API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)
- [User Timing API (HTML5 Rocks)](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/)
