---
layout: post
title: Indeks prędkości
description: Dowiedz się o wskaźniku prędkości Lighthouse i jak go zoptymalizować.
date: '2019-05-02'
updated: '2019-10-10'
web_lighthouse:
  - indeks prędkości
---

Indeks prędkości to jeden z sześciu wskaźników śledzonych w sekcji **Wydajność** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Latarnia wyświetla indeks prędkości w ciągu kilku sekund:

<figure class="w-figure"><img class="w-screenshot" src="speed-index.png" alt="Zrzut ekranu z audytu Lighthouse Speed Index"></figure>

## Co mierzy indeks prędkości

Indeks szybkości mierzy, jak szybko treść jest wyświetlana wizualnie podczas ładowania strony. Lighthouse najpierw rejestruje wideo wczytywania strony w przeglądarce i oblicza wizualną progresję między klatkami. Następnie Lighthouse używa modułu [Speedline Node.js](https://github.com/paulirish/speedline) do wygenerowania wyniku Speed Index.

{% Aside %} Speedline opiera się na tych samych zasadach, co [oryginalny indeks szybkości wprowadzony przez WebpageTest.org](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index) , ale oblicza progresję wizualną między klatkami przy użyciu [indeksu podobieństwa strukturalnego (SSIM)](https://en.wikipedia.org/wiki/Structural_similarity) zamiast odległości histogramu. {% endAside %}

## Jak Lighthouse określa Twój wynik w indeksie prędkości

Twój wynik Speed Index to porównanie indeksu szybkości Twojej strony i wskaźników szybkości rzeczywistych witryn internetowych na podstawie [danych z archiwum HTTP](https://bigquery.cloud.google.com/table/httparchive:lighthouse.2019_03_01_mobile?pli=1) .

Ta tabela pokazuje, jak interpretować wynik indeksu prędkości:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Indeks prędkości<br> (w sekundy)</th>
        <th>Kodowanie kolorami</th>
        <th>Wynik wskaźnika prędkości</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–4,3</td>
        <td>Zielony (szybki)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>4,4–5,8</td>
        <td>Pomarańczowy (umiarkowany)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Ponad 5,8</td>
        <td>Czerwony (wolno)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój wskaźnik szybkości

Chociaż wszystko, co zrobisz, aby przyspieszyć ładowanie strony, poprawi Twój wskaźnik szybkości, rozwiązanie wszelkich problemów wykrytych podczas tych audytów diagnostycznych powinno mieć szczególnie duży wpływ:

- [Zminimalizuj pracę głównego wątku](/mainthread-work-breakdown)
- [Skróć czas wykonywania JavaScript](/bootup-time)
- [Upewnij się, że tekst pozostaje widoczny podczas ładowania czcionek internetowych](/font-display)

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Kod źródłowy do audytu **Speed Index**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/speed-index.js)
- [Przewodnik po punktacji Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Speedline](https://github.com/paulirish/speedline)
- [Indeks prędkości WebPagetest](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)
