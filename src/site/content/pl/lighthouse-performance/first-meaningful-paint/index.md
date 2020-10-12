---
layout: post
title: Pierwsza znacząca farba
description: Dowiedz się o mierniku pierwszej znaczącej farby firmy Lighthouse oraz o tym, jak ją mierzyć i optymalizować.
date: 2019-05-02
updated: 2019-11-05
web_lighthouse:
- pierwsza znacząca-farba
---

{% Aside 'caution' %} Pierwsza znacząca farba (FMP) jest przestarzała w Lighthouse 6.0. W praktyce FMP był zbyt wrażliwy na małe różnice w ładowaniu strony, co prowadziło do niespójnych (bimodalnych) wyników. Ponadto definicja metryki opiera się na szczegółach implementacji specyficznych dla przeglądarki, co oznacza, że nie można jej ustandaryzować ani zaimplementować we wszystkich przeglądarkach internetowych. Idąc dalej, rozważ zamiast tego użycie [największej zawartości](/largest-contentful-paint/) . {% endAside %}

Pierwsza znacząca farba (FMP) to jeden z sześciu wskaźników śledzonych w sekcji **Wydajność** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Wyświetlacze Lighthouse wyświetlają FMP w kilka sekund:

<figure class="w-figure"><img class="w-screenshot" src="first-meaningful-paint.png" alt="Zrzut ekranu audytu Lighthouse First Meaningful Paint"></figure>

## Co mierzy FMP

FMP mierzy, kiedy podstawowa zawartość strony jest widoczna dla użytkownika. Nieprzetworzony wynik FMP to czas w sekundach między zainicjowaniem wczytywania strony przez użytkownika a wyświetleniem przez stronę głównej treści w części strony widocznej na ekranie. FMP zasadniczo pokazuje czas malowania, po którym następuje największa zmiana układu strony widocznej po przewinięciu. Dowiedz się więcej o szczegółach technicznych FMP w Google's [Time to First Meaningful Paint: podejście oparte na układzie](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view) .

[First Contentful Paint (FCP)](/first-contentful-paint) i FMP są często takie same, gdy pierwszy bit treści renderowanej na stronie zawiera zawartość w części strony widocznej na ekranie. Jednak te dane mogą się różnić, jeśli na przykład w elemencie iframe znajduje się treść w części strony widocznej po przewinięciu. FMP rejestruje, kiedy zawartość elementu iframe jest widoczna dla użytkownika, a FCP *nie* obejmuje zawartości iframe.

## Jak Lighthouse określa Twój wynik FMP

Podobnie jak FCP, FMP opiera się na [rzeczywistych danych o wydajności witryny z archiwum HTTP](https://httparchive.org/reports/loading-speed#fcp) .

Gdy FMP i FCP są takie same, ich wyniki są identyczne. Jeśli FMP występuje po FCP - na przykład gdy strona zawiera zawartość iframe - wynik FMP będzie niższy niż wynik FCP.

Na przykład, powiedzmy, że twój FCP wynosi 1,5 sekundy, a twój FMP wynosi 3 sekundy. Wynik FCP wyniósłby 99, ale wynik FMP wyniósłby 75.

Ta tabela pokazuje, jak interpretować wynik FMP:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Metryka FMP<br> (w sekundy)</th>
        <th>Kodowanie kolorami</th>
        <th>Wynik FMP<br> (Percentyl archiwum HTTP FCP)</th>
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

## Jak poprawić swój wynik FMP

Zobacz, [jak ulepszyć największą zawartość w swojej witrynie] . Strategie poprawy FMP są w dużej mierze takie same, jak strategie ulepszania największej zawartości farby.

## Śledzenie FMP na urządzeniach prawdziwych użytkowników

To learn how to measure when FMP actually occurs on your users' devices, see Google's [User-centric Performance Metrics] page. The [Tracking FMP using hero elements] section describes how to programmatically access FCP data and submit it to Google Analytics.

Więcej informacji na temat zbierania danych dotyczących rzeczywistych użytkowników można znaleźć w artykule Google [Ocenianie wydajności ładowania w prawdziwym życiu z nawigacją i czasem zasobów](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) . [Oznaczenia i miary czasu użytkownika Audyt Lighthouse](/user-timings) umożliwia wyświetlenie danych dotyczących czasu użytkownika w raporcie.

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Kod źródłowy audytu **First Meaningful Paint**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-meaningful-paint.js)
- [Przewodnik po punktacji Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Czas do pierwszego znaczącego malowania: podejście oparte na układzie](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)
- [Farba o największej zawartości](/largest-contentful-paint)


[User-centric Performance Metrics]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[Tracking FMP using hero elements]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fmp_using_hero_elements
[jak ulepszyć największą zawartość w swojej witrynie]: /largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site