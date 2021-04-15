---
layout: post
title: Pierwszy bezczynny procesor
description: Dowiedz się o mierniku pierwszego bezczynności procesora Lighthouse i jak go zoptymalizować.
date: '2019-05-02'
updated: '2019-11-05'
web_lighthouse:
  - first-cpu-idle
---

{% Aside 'caution' %} Pierwszy bezczynny procesor jest przestarzały w Lighthouse 6.0. Chociaż niektórzy odkryli, że First CPU Idle oferuje bardziej miarodajny pomiar niż [Time To Interactive](/interactive) , różnica nie jest na tyle znacząca, aby uzasadniać utrzymywanie dwóch podobnych wskaźników. Idąc dalej, zamiast tego rozważ użycie [Całkowitego czasu blokowania](/lighthouse-total-blocking-time/) i [czasu do interakcji](/interactive) . {% endAside %}

Pierwszy bezczynność procesora to jedna z sześciu metryk śledzonych w sekcji **Wydajność** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Lighthouse wyświetla pierwszy procesor bezczynny w ciągu kilku sekund:

<figure class="w-figure"><img class="w-screenshot" src="first-cpu-idle.png" alt="Zrzut ekranu audytu bezczynności procesora Lighthouse First"></figure>

## Co mierzy pierwszy stan bezczynności procesora

Pierwsza bezczynność procesora mierzy, jak długo strona staje się *minimalnie* interaktywna. Strona jest uważana za minimalnie interaktywną, gdy:

- Większość - ale niekoniecznie wszystkie - elementy interfejsu użytkownika na ekranie są interaktywne i
- Strona reaguje średnio na większość danych wprowadzanych przez użytkownika w rozsądnym czasie.

{% Aside %} Zarówno pierwszy stan bezczynności procesora, jak i [czas do interakcji](/interactive) mierzą, kiedy strona jest gotowa do wprowadzenia danych przez użytkownika. Pierwszy bezczynność procesora występuje, gdy użytkownik może *rozpocząć* interakcję ze stroną; TTI występuje, gdy użytkownik jest w *pełni* zdolny do interakcji ze stroną. Zobacz [Pierwsze interaktywne i konsekwentnie interaktywne Google,](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) jeśli interesują Cię dokładne obliczenia dla każdego wskaźnika. {% endAside %}

## W jaki sposób Lighthouse określa Twój pierwszy wynik bezczynności procesora

Wynik pierwszego bezczynności procesora to porównanie pierwszego czasu bezczynności procesora i pierwszego bezczynności procesora dla prawdziwych witryn internetowych na podstawie [danych z archiwum HTTP](https://httparchive.org/reports/loading-speed#ttfi) . Na przykład witryny działające w dziewięćdziesiątym piątym centylu renderują pierwszy procesor bezczynny w ciągu około 3 sekund. Jeśli pierwszy stan bezczynności procesora w Twojej witrynie wynosi 3 sekundy, wynik pierwszego bezczynności procesora wynosi 95.

Ta tabela pokazuje, jak interpretować wynik pierwszego bezczynności procesora:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Pierwsza metryka bezczynności procesora<br> (w sekundy)</th>
        <th>Kodowanie kolorami</th>
        <th>Pierwszy wynik bezczynności procesora<br> (Percentyl archiwum HTTP)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–4,7</td>
        <td>Zielony (szybki)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>4,8–6,5</td>
        <td>Pomarańczowy (umiarkowany)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Ponad 6,5</td>
        <td>Czerwony (wolno)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój pierwszy wynik bezczynności procesora

Zobacz [Jak poprawić swój wynik TTI] . Strategie poprawy pierwszego bezczynności procesora są w dużej mierze takie same, jak strategie poprawy TTI.

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Source code for **First CPU Idle** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-cpu-idle.js)
- [Przewodnik po punktacji Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Pierwszy interaktywny i konsekwentnie interaktywny](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Czas na interaktywność](/interactive/)


[Jak poprawić swój wynik TTI]: /interactive/#how-to-improve-your-tti-score