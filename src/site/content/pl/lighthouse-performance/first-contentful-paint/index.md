---
layout: post
title: Pierwsza pełna treści farba
description: Dowiedz się o wskaźniku pierwszej treściowej farby Lighthouse oraz o tym, jak ją mierzyć i optymalizować.
date: '2019-05-02'
updated: '2019-10-10'
web_lighthouse:
  - pierwsza-treściwa-farba
---

First Contentful Paint (FCP) to jeden z sześciu wskaźników śledzonych w sekcji **Performance** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Lighthouse wyświetla FCP w kilka sekund:

<figure class="w-figure"><img class="w-screenshot" src="first-contentful-paint.png" alt="Zrzut ekranu z audytu Lighthouse First Contentful Paint"></figure>

## Co mierzy FCP

FCP mierzy, ile czasu zajmuje przeglądarce wyrenderowanie pierwszej części treści DOM po przejściu użytkownika na Twoją stronę. Obrazy, inne niż białe elementy `<canvas>` i pliki SVG na Twojej stronie są uważane za zawartość DOM; nic wewnątrz elementu iframe *nie jest* uwzględniane.

## Jak Lighthouse określa Twój wynik FCP

Twój wynik FCP to porównanie czasu FCP Twojej strony i czasu FCP dla rzeczywistych witryn internetowych na podstawie [danych z archiwum HTTP](https://httparchive.org/reports/loading-speed#fcp) . Na przykład witryny działające w dziewięćdziesiątym dziewiątym centylu renderują FCP w około 1,5 sekundy. Jeśli FCP Twojej witryny wynosi 1,5 sekundy, wynik FCP to 99.

Ta tabela pokazuje, jak interpretować wynik FCP:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Czas FCP<br> (w sekundy)</th>
        <th>Kodowanie kolorami</th>
        <th>Wynik FCP<br> (Percentyl archiwum HTTP)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–2</td>
        <td>Zielony (szybki)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>2–4</td>
        <td>Pomarańczowy (umiarkowany)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Ponad 4</td>
        <td>Czerwony (wolno)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój wynik FCP

One issue that's particularly important for FCP is font load time. Check out the [Ensure text remains visible during webfont load](/font-display) post for ways to speed up your font loads.

## Śledzenie FCP na urządzeniach prawdziwych użytkowników

To learn how to measure when FCP actually occurs on your users' devices, see Google's [User-centric Performance Metrics] page. The [Tracking FP/FCP] section describes how to programmatically access FCP data and submit it to Google Analytics.

Więcej informacji na temat zbierania danych dotyczących rzeczywistych użytkowników można znaleźć w artykule Google [Ocenianie wydajności ładowania w prawdziwym życiu z nawigacją i czasem zasobów](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) .

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Kod źródłowy do audytu **First Contentful Paint**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-contentful-paint.js)
- [Przewodnik po punktacji Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Specyfikacja czasu malowania](https://w3c.github.io/paint-timing)


[User-centric Performance Metrics]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[Tracking FP/FCP]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fpfcp