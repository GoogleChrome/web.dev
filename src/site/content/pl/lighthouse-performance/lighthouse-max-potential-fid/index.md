---
layout: post
title: Maksymalne potencjalne opóźnienie pierwszego wejścia
description: Dowiedz się o mierniku Max Potential First Input Delay firmy Lighthouse oraz o tym, jak je mierzyć i optymalizować.
date: 2019-05-02
updated: 2019-10-16
web_lighthouse:
- max-potencjał-fid
---

Maksymalne potencjalne opóźnienie pierwszego wejścia (FID) to jedna z metryk śledzonych w sekcji **Wydajność** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Lighthouse wyświetla maksymalny potencjał FID w milisekundach:

<figure class="w-figure"><img class="w-screenshot" src="max-potential-fid.png" alt="Zrzut ekranu audytu Lighthouse Max Potential First Input Delay."></figure>

## Co mierzy maksymalny potencjał FID

Max Potential FID mierzy najgorsze [opóźnienie pierwszego wejścia,] którego mogą doświadczyć użytkownicy. Opóźnienie pierwszego wejścia mierzy czas od pierwszej interakcji użytkownika z witryną, na przykład kliknięcia przycisku, do momentu, w którym przeglądarka jest w stanie rzeczywiście odpowiedzieć na tę interakcję.

Lighthouse oblicza maksymalny potencjał FID, znajdując czas trwania [najdłuższego zadania] po [pierwszej treściwej farbie] . Zadania przed pierwszą treścią malowania są wykluczone, ponieważ jest mało prawdopodobne, aby użytkownik próbował wchodzić w interakcję z twoją stroną, zanim jakakolwiek zawartość zostanie wyrenderowana na ekranie, co mierzy First Contentful Paint.

## Jak Lighthouse określa maksymalny potencjalny wynik FID

<!-- TODO(kaycebasques): In the FCP doc we link to the HTTP Archive report of FCP data.
     If we get a similar report for MPFID we should link to that.
     https://web.dev/first-contentful-paint/#how-lighthouse-determines-your-fcp-score -->

Twój maksymalny potencjalny wynik FID to porównanie maksymalnego potencjalnego czasu FID Twojej strony i maksymalnego potencjalnego czasu FID dla rzeczywistych witryn internetowych na podstawie danych z [archiwum HTTP](https://httparchive.org) . Na przykład, jeśli Twój maksymalny potencjalny wynik FID w Lighthouse jest zielony, oznacza to, że Twoja strona działa lepiej niż 90% prawdziwych witryn.

Ta tabela pokazuje, jak interpretować wynik TBT:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Maksymalny potencjalny czas FID<br> (w milisekundach)</th>
        <th>Kodowanie kolorami</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–130</td>
        <td>Zielony (szybki)</td>
      </tr>
      <tr>
        <td>130-250 ° C</td>
        <td>Pomarańczowy (umiarkowany)</td>
      </tr>
      <tr>
        <td>Ponad 250</td>
        <td>Czerwony (wolno)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój maksymalny potencjalny wynik FID

Jeśli próbujesz wprowadzić znaczną poprawę wyniku maksymalnego potencjalnego FID, zobacz [Jak poprawić swój wynik TTI] . Strategie znacznej poprawy maksymalnego potencjału FID są w dużej mierze takie same, jak strategie poprawy TTI.

Jeśli chcesz zoptymalizować swój maksymalny potencjał FID, musisz skrócić czas trwania najdłuższych zadań, ponieważ to jest to, co technicznie mierzy Max Potential FID. Jednym ze sposobów jest strategia [Idle Until Urgent](https://philipwalton.com/articles/idle-until-urgent/) .

## Jak przechwytywać dane pola FID

Lighthouse's measurement of Max Potential FID is [lab data]. To capture real FID data as your users load your pages, use Google's [First Input Delay library](https://github.com/GoogleChromeLabs/first-input-delay). Once you're capturing FID data, you can report it as an event to your preferred analytics tool.

Ponieważ FID mierzy, kiedy faktyczni użytkownicy po raz pierwszy wchodzą w interakcję z Twoją stroną, jest on bardziej z natury zmienny niż typowe wskaźniki wydajności. Zobacz [Analizowanie i raportowanie danych FID,] aby uzyskać wskazówki dotyczące oceny gromadzonych danych FID.

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Kod źródłowy audytu **maksymalnego potencjalnego opóźnienia pierwszego wejścia**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/max-potential-fid.js)
- [Opóźnienie pierwszego wejścia]
- [Czas na interaktywność](/interactive/)
- [Czy długie zadania JavaScript opóźniają Twój Time to Interactive?](/long-tasks-devtools)
- [Pierwsza farba i pierwsza zadowalająca farba](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint)
- [Jak myśleć o narzędziach prędkości]


[Analizowanie i raportowanie danych FID,]: https://developers.google.com/web/updates/2018/05/first-input-delay#analyzing_and_reporting_on_fid_data
[opóźnienie pierwszego wejścia,]: https://developers.google.com/web/updates/2018/05/first-input-delay
[Jak poprawić swój wynik TTI]: /interactive/#how-to-improve-your-tti-score
[pierwszej treściwej farbie]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint
[Opóźnienie pierwszego wejścia]: https://developers.google.com/web/updates/2018/05/first-input-delay
[lab data]: https://developers.google.com/web/fundamentals/performance/speed-tools#field_data
[najdłuższego zadania]: https://developers.google.com/web/fundamentals/performance/speed-tools#lab_data
[Jak myśleć o narzędziach prędkości]: /long-tasks-devtools#what-are-long-tasks