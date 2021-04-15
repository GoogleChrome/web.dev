---
layout: post
title: Czas na interaktywność
description: Dowiedz się o mierniku Time to Interactive Lighthouse oraz o tym, jak go mierzyć i optymalizować.
date: '2019-05-02'
updated: '2019-10-10'
web_lighthouse:
  - interaktywny
---

Time to Interactive (TTI) to jeden z sześciu wskaźników śledzonych w sekcji **Performance** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Pomiar TTI jest ważny, ponieważ niektóre witryny optymalizują widoczność treści kosztem interaktywności. Może to powodować frustrujące wrażenia użytkownika: witryna wydaje się być gotowa, ale gdy użytkownik próbuje z nią wejść w interakcję, nic się nie dzieje.

Latarnia wyświetla TTI w kilka sekund:

<figure class="w-figure"><img class="w-screenshot" src="interactive.png" alt="Zrzut ekranu audytu Lighthouse Time to Interactive"></figure>

## Co mierzy TTI

TTI mierzy, ile czasu zajmuje strona, aby stała się w *pełni* interaktywna. Strona jest uważana za w pełni interaktywną, gdy:

- Strona wyświetla przydatne treści, które są mierzone przez [pierwszą farbę treści](/first-contentful-paint) ,
- Programy obsługi zdarzeń są rejestrowane dla większości widocznych elementów strony, a
- Strona reaguje na interakcje użytkownika w ciągu 50 milisekund.

{% Aside %} Zarówno [pierwszy stan bezczynności procesora, jak](/first-cpu-idle) i TTI mierzą, kiedy strona jest gotowa do wprowadzenia danych przez użytkownika. Pierwszy bezczynność procesora występuje, gdy użytkownik może *rozpocząć* interakcję ze stroną; TTI występuje, gdy użytkownik jest w *pełni* zdolny do interakcji ze stroną. Zobacz [Pierwsze interaktywne i konsekwentnie interaktywne Google,](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) jeśli interesują Cię dokładne obliczenia dla każdego wskaźnika. {% endAside %}

## Jak Lighthouse określa Twój wynik TTI

Wynik TTI to porównanie TTI Twojej strony i TTI dla prawdziwych witryn internetowych na podstawie [danych z archiwum HTTP](https://httparchive.org/reports/loading-speed#ttci) . Na przykład witryny działające w dziewięćdziesiątym dziewiątym centylu renderują TTI w około 2,2 sekundy. Jeśli TTI Twojej witryny wynosi 2,2 sekundy, wynik TTI wynosi 99.

Ta tabela pokazuje, jak interpretować wynik TTI:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Metryka TTI<br> (w sekundy)</th>
        <th>Kodowanie kolorami</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3,8</td>
        <td>Zielony (szybki)</td>
      </tr>
      <tr>
        <td>3,9–7,3</td>
        <td>Pomarańczowy (umiarkowany)</td>
      </tr>
      <tr>
        <td>Ponad 7,3</td>
        <td>Czerwony (wolno)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój wynik TTI

Jednym z ulepszeń, które może mieć szczególnie duży wpływ na TTI, jest opóźnianie lub usuwanie niepotrzebnej pracy JavaScript. Poszukaj możliwości [optymalizacji JavaScript](/fast#optimize-your-javascript) . W szczególności rozważ [ograniczenie ładunków JavaScript poprzez dzielenie kodu](/reduce-javascript-payloads-with-code-splitting) i [zastosowanie wzorca PRPL](/apply-instant-loading-with-prpl) . [Optymalizacja JavaScript innych firm] również daje znaczące ulepszenia w niektórych witrynach.

Te dwa audyty diagnostyczne zapewniają dodatkowe możliwości ograniczenia pracy JavaScript:

- [Zminimalizuj pracę głównego wątku](/mainthread-work-breakdown)
- [Skróć czas wykonywania JavaScript](/bootup-time)

## Śledzenie TTI na urządzeniach prawdziwych użytkowników

Aby dowiedzieć się, jak mierzyć, kiedy TTI faktycznie występuje na urządzeniach użytkowników, zobacz stronę Google [User-centric Performance Metrics] . W sekcji [Śledzenie TTI] opisano, jak programowo uzyskać dostęp do danych TTI i przesłać je do Google Analytics.

{% Aside %} TTI może być trudne do wyśledzenia na wolności. Tracking [First Input Delay](https://developers.google.com/web/updates/2018/05/first-input-delay) może być dobrym proxy dla TTI. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Kod źródłowy audytu **Time to Interactive**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/interactive.js)
- [Przewodnik po punktacji Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Pierwszy interaktywny i konsekwentnie interaktywny](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Optymalizacja uruchamiania JavaScript](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/)
- [Zmniejsz liczbę ładunków JavaScript dzięki funkcji Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [Zoptymalizuj zasoby innych firm](/fast/#optimize-your-third-party-resources)


[User-centric Performance Metrics]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[Śledzenie TTI]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti
[Optymalizacja JavaScript innych firm]: /fast/#optimize-your-third-party-resources