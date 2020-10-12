---
layout: post
title: Farba o największej zawartości
description: Dowiedz się o mierniku największej zawartości farby Lighthouse oraz o tym, jak je mierzyć i optymalizować.
date: 2020-01-10
web_lighthouse:
- największa-zawartość-farba
---

Farba o największej zawartości (LCP) to jedna z metryk śledzonych w sekcji **Wydajność** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Lighthouse wyświetla LCP w kilka sekund:

<figure class="w-figure"><img class="w-screenshot" src="largest-contentful-paint.png" alt="Zrzut ekranu audytu największej zawartości w latarni morskiej"></figure>

## Co mierzy LCP

LCP mierzy, kiedy największy element treści w rzutni jest renderowany na ekranie. Jest to przybliżone, gdy główna zawartość strony jest widoczna dla użytkowników. Aby uzyskać więcej informacji na temat określania LCP, patrz [Zdefiniowana największa zawartość farby] .

## Jak Lighthouse określa Twój wynik LCP

Obsługa przeglądarki LCP uruchomiona w [Chrome 77] . Lighthouse wyodrębnia dane LCP z [narzędzia śledzenia Chrome](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) .

Poniższa tabela pokazuje, jak interpretować wynik LCP:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Czas LCP<br> (w sekundy)</th>
        <th>Kodowanie kolorami</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-2,5</td>
        <td>Zielony (szybki)</td>
      </tr>
      <tr>
        <td>2,5-4</td>
        <td>Pomarańczowy (umiarkowany)</td>
      </tr>
      <tr>
        <td>Ponad 4</td>
        <td>Czerwony (wolno)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój wynik LCP

Zobacz, [jak ulepszyć największą zawartość w swojej witrynie] .

## Zasoby

- [Kod źródłowy dla audytu **największej zawartości**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/largest-contentful-paint.js)
- [Farba o największej zawartości](/largest-contentful-paint/)
- [Największy Contentful Paint API](https://wicg.github.io/largest-contentful-paint/)
- [Nowość w Chrome 77: największa zawartość farby](https://developers.google.com/web/updates/2019/09/nic77#lcp)


[Zdefiniowana największa zawartość farby]: /largest-contentful-paint/#largest-contentful-paint-defined
[Chrome 77]: https://developers.google.com/web/updates/2019/09/nic77#lcp
[jak ulepszyć największą zawartość w swojej witrynie]: /largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site