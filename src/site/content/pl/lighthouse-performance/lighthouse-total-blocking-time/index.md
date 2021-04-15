---
layout: post
title: Całkowity czas blokowania
description: Dowiedz się o mierniku całkowitego czasu blokowania Lighthouse oraz o tym, jak go mierzyć i optymalizować.
web_lighthouse:
  - całkowity czas blokowania
date: '2019-10-09'
---

Całkowity czas blokowania (TBT) to jedna z metryk śledzonych w sekcji **Wydajność** raportu Lighthouse. Każdy wskaźnik obejmuje pewien aspekt szybkości ładowania strony.

Raport Lighthouse wyświetla TBT w milisekundach:

<figure class="w-figure"><img class="w-screenshot" src="total-blocking-time.jpg" alt="Zrzut ekranu audytu całkowitego czasu blokowania latarni morskiej"></figure>

## Jakie środki TBT

TBT mierzy całkowity czas, przez który strona nie reaguje na dane wejściowe użytkownika, takie jak kliknięcia myszą, stuknięcia ekranu lub naciśnięcia klawiatury. Suma jest obliczana przez dodanie *części blokującej* wszystkich [długich zadań] między [Pierwszą treścią malowania] a [Czasem do interakcji] . Każde zadanie, które trwa dłużej niż 50 ms, jest zadaniem długim. Czas po 50 ms jest częścią blokującą. Na przykład, jeśli Lighthouse wykryje zadanie o długości 70 ms, część blokująca będzie wynosić 20 ms.

## Jak Lighthouse określa Twój wynik TBT

Twój wynik TBT to porównanie czasu TBT Twojej strony i czasów TBT dla 10 000 najpopularniejszych witryn po załadowaniu na urządzenia mobilne. Dane najlepszych witryn obejmują 404 strony.

Ta tabela pokazuje, jak interpretować wynik TBT:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Czas TBT<br> (w milisekundach)</th>
        <th>Kodowanie kolorami</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–300</td>
        <td>Zielony (szybki)</td>
      </tr>
      <tr>
        <td>300-600</td>
        <td>Pomarańczowy (umiarkowany)</td>
      </tr>
      <tr>
        <td>Ponad 600</td>
        <td>Czerwony (wolno)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak poprawić swój wynik TBT

Zobacz, [co powoduje moje długie zadania?](/long-tasks-devtools/#what-is-causing-my-long-tasks) aby dowiedzieć się, jak zdiagnozować główną przyczynę długich zadań za pomocą panelu Wydajność w Chrome DevTools.

Ogólnie rzecz biorąc, najczęstszymi przyczynami długich zadań są:

- Niepotrzebne ładowanie, analizowanie lub wykonywanie kodu JavaScript. Analizując swój kod w panelu Wydajność, możesz odkryć, że główny wątek wykonuje pracę, która nie jest konieczna do załadowania strony. [Zmniejszenie ładunków JavaScript poprzez dzielenie kodu] , [usuwanie nieużywanego kodu] lub [wydajne ładowanie kodu JavaScript innej firmy] powinno poprawić wynik TBT.
- Nieefektywne instrukcje JavaScript. Na przykład po przeanalizowaniu kodu w panelu Wydajność załóżmy, że widzisz wywołanie `document.querySelectorAll('a')` które zwraca 2000 węzłów. Refaktoryzacja kodu w celu użycia bardziej szczegółowego selektora, który zwraca tylko 10 węzłów, powinna poprawić wynik TBT.

{% Aside %} Niepotrzebne ładowanie, analizowanie lub wykonywanie kodu JavaScript to zwykle dużo większa szansa na ulepszenia w większości witryn. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Zasoby

- [Kod źródłowy audytu **całkowitego czasu blokowania**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/total-blocking-time.js)
- [Czy długie zadania JavaScript opóźniają Twój Time to Interactive?](/long-tasks-devtools)
- [Pierwsza pełna treści farba](/first-contentful-paint/)
- [Czas na interaktywność](/interactive/)
- [Zmniejsz liczbę ładunków JavaScript dzięki dzieleniu kodu](/reduce-javascript-payloads-with-code-splitting/)
- [Usuń nieużywany kod](/remove-unused-code/)
- [Wydajnie ładuj zasoby innych firm](/efficiently-load-third-party-javascript/)


[długich zadań]: /long-tasks-devtools
[Pierwszą treścią malowania]: /first-contentful-paint/
[Czasem do interakcji]: /interactive/
[Zmniejszenie ładunków JavaScript poprzez dzielenie kodu]: /reduce-javascript-payloads-with-code-splitting/
[usuwanie nieużywanego kodu]: /remove-unused-code/
[wydajne ładowanie kodu JavaScript innej firmy]: /efficiently-load-third-party-javascript/