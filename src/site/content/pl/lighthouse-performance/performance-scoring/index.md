---
layout: post
title: Ocena wydajności latarni morskiej
description: Dowiedz się, jak Lighthouse generuje ogólny wynik wydajności Twojej strony.
subhead: Jak Lighthouse oblicza ogólny wynik wydajności
date: '2019-09-19'
updated: '2020-06-12'
---

Ogólnie rzecz biorąc, tylko [metryki mają](/lighthouse-performance/#metrics) wpływ na wynik Lighthouse Performance, a nie wyniki Możliwości lub Diagnostyki. To powiedziawszy, poprawa możliwości i diagnostyka prawdopodobnie poprawią wartości metryki, więc istnieje związek pośredni.

Poniżej wyjaśniliśmy, dlaczego wynik może się zmieniać, jak się składa i jak Lighthouse ocenia poszczególne wskaźniki.

## Dlaczego Twój wynik się zmienia {: #fluctuations}

Duża zmienność ogólnego wyniku wydajności i wartości metryk nie jest spowodowana przez Lighthouse. Kiedy Twój wynik wydajności się zmienia, zwykle jest to spowodowane zmianami warunków podstawowych. Typowe problemy obejmują:

- Testy A / B lub zmiany w wyświetlanych reklamach
- Zmiany w routingu ruchu internetowego
- Testowanie na różnych urządzeniach, takich jak komputer stacjonarny o wysokiej wydajności i laptop o niskiej wydajności
- Rozszerzenia przeglądarki, które wprowadzają JavaScript i dodają / modyfikują żądania sieciowe
- Oprogramowanie antywirusowe

[Dokumentacja Lighthouse na temat zmienności](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md) opisuje to bardziej szczegółowo.

Co więcej, nawet jeśli Lighthouse może podać jeden ogólny wynik wydajności, bardziej przydatne może być myślenie o wydajności witryny jako o rozkładzie wyników, a nie o pojedynczej liczbie. Zobacz wprowadzenie do [metryk wydajności zorientowanych na użytkownika,](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics) aby zrozumieć, dlaczego.

## Jak jest ważony wynik wydajności {: #weightings}

Wynik wydajności to [średnia ważona](https://www.wikihow.com/Calculate-Weighted-Average#Weighted_Averages_without_Percentages_sub) wyników *metrycznych* . Oczywiście bardziej ważone wskaźniki mają większy wpływ na ogólny wynik wydajności. Wyniki metryczne nie są widoczne w raporcie, ale są obliczane pod maską.

{% Aside %} Wagi są tak dobrane, aby zapewnić wyważoną reprezentację postrzegania wydajności przez użytkownika. Wagi ulegały zmianie w czasie, ponieważ zespół Lighthouse regularnie prowadzi badania i zbiera opinie, aby zrozumieć, co ma największy wpływ na wydajność postrzeganą przez użytkowników. {% endAside %}

<figure class="w-figure">
  <p data-md-type="paragraph"><a href="https://googlechrome.github.io/lighthouse/scorecalc/"></a><img src="./score-calc.png" alt="Kalkulator punktacji latarni morskiej" style="max-width: 600px;"></p>
  <figcaption class="w-figcaption">Przeglądaj punktację za pomocą <a href="https://googlechrome.github.io/lighthouse/scorecalc/">kalkulatora punktacji Lighthouse</a></figcaption></figure>

### Latarnia morska 6

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Rewizja</th>
        <th>Waga</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">Pierwsza pełna treści farba</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Indeks prędkości</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Farba o największej zawartości</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Czas na interaktywność</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Całkowity czas blokowania</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Skumulowane przesunięcie układu</a></td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>

### Latarnia morska 5

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Rewizja</th>
        <th>Waga</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">Pierwsza pełna treści farba</a></td>
        <td>20%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Indeks prędkości</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">Pierwsza znacząca farba</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Czas na interaktywność</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">Pierwszy bezczynny procesor</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

### Jak określane są wyniki metryki {: # metric-score}

Gdy Lighthouse zakończy zbieranie metryk wydajności (najczęściej podawanych w milisekundach), konwertuje każdą surową wartość metryki na wynik metryki od 0 do 100, sprawdzając, gdzie wartość metryki przypada na jej rozkład punktacji Lighthouse. Dystrybucja punktacji to normalna dystrybucja logów pochodząca z metryk wydajności rzeczywistych danych wydajności witryny w [archiwum HTTP](https://httparchive.org/) .

Na przykład, największa zawartość treści (LCP) mierzy, kiedy użytkownik dostrzeże, że widoczna jest największa zawartość strony. Wartość metryki dla LCP reprezentuje czas między zainicjowaniem wczytywania strony przez użytkownika a wyświetleniem jej głównej treści. W oparciu o rzeczywiste dane witryny, witryny o najwyższej wydajności renderują LCP w około 1220 ms, więc wartość metryki jest mapowana na 99 punktów.

Idąc nieco głębiej, model krzywej punktacji Lighthouse wykorzystuje dane HTTPArchive do określenia dwóch punktów kontrolnych, które następnie określają kształt krzywej [logarytmiczno-normalnej](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law) . 25. percentyl danych HTTPArchive staje się wynikiem 50 (mediana punktu kontrolnego), a 8. percentyl staje się wynikiem 90 (dobry / zielony punkt kontrolny). Analizując poniższy wykres krzywej punktacji, zwróć uwagę, że między 0,50 a 0,92 istnieje prawie liniowa zależność między wartością metryki a wynikiem. Około 0,96 to „punkt malejących zwrotów”, ponieważ powyżej niego krzywa odsuwa się, wymagając coraz większej poprawy wskaźników, aby poprawić i tak już wysoki wynik.

<figure class="w-figure"><img src="./scoring-curve.png" alt="Obraz krzywej punktacji dla TTI" style="max-width: 600px;"><figcaption class="w-figcaption"><a href="https://www.desmos.com/calculator/o98tbeyt1t">Poznaj krzywą punktacji dla TTI</a> .</figcaption></figure>

### Jak jest obsługiwany komputer stacjonarny i telefon komórkowy {: #desktop}

Jak wspomniano powyżej, krzywe punktacji są określane na podstawie rzeczywistych danych dotyczących wydajności. Przed wersją Lighthouse v6 wszystkie krzywe wyników opierały się na danych dotyczących wydajności urządzeń mobilnych, jednak wersja Lighthouse na komputerach z nich korzystała. W praktyce prowadziło to do sztucznie zawyżonych wyników na pulpicie. Lighthouse v6 naprawił ten błąd, używając określonej punktacji na pulpicie. Chociaż z pewnością możesz spodziewać się ogólnych zmian w Twoim wyniku perfekcji z 5 do 6, wszystkie wyniki dla komputerów stacjonarnych będą znacząco różne.

### Jak wyniki są kodowane kolorami {: # color-coding}

Wyniki metryk i wynik perf są pokolorowane zgodnie z następującymi zakresami:

- 0 do 49 (czerwony): słaby
- 50 do 89 (pomarańczowy): wymaga poprawy
- 90 do 100 (zielony): dobrze

Aby zapewnić użytkownikom dobre wrażenia, witryny powinny starać się uzyskać dobry wynik (90–100). „Idealny” wynik 100 jest niezwykle trudny do osiągnięcia i nie jest oczekiwany. Na przykład przyjęcie wyniku od 99 do 100 wymaga mniej więcej takiej samej poprawy miernika, jaką wymagałoby 90 do 94.

### Co mogą zrobić programiści, aby poprawić swój wynik wydajności?

Najpierw użyj [kalkulatora punktacji Lighthouse,](https://googlechrome.github.io/lighthouse/scorecalc/) aby dowiedzieć się, jakie progi należy dążyć, aby osiągnąć określony wynik wydajności Lighthouse.

W raporcie Lighthouse sekcja **Możliwości** zawiera szczegółowe sugestie i dokumentację dotyczącą ich wdrażania. Ponadto sekcja **Diagnostyka** zawiera dodatkowe wskazówki, które deweloperzy mogą zbadać, aby jeszcze bardziej zwiększyć wydajność.

<!--
We don't think users care about the historical scoring rubrics, but we'd still prefer to keep them around because X
## Historical versions

### Lighthouse 3 and 4

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>23%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 2

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>29%</td>
      </tr>
    </tbody>
  </table>
</div>

-->
