---
layout: post
title: Zachowaj niską liczbę żądań i małe rozmiary transferów
description: Dowiedz się, jak duża liczba zasobów i duże rozmiary transferów wpływają na wydajność ładowania. Poznaj strategie zmniejszania liczby żądań i rozmiarów transferów.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
- podsumowanie zasobów
---

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) raportuje, ile żądań sieciowych zostało wysłanych i ile danych zostało przesłanych podczas wczytywania strony:

<figure class="w-figure"><img class="w-screenshot" src="resource-summary.png" alt="Zrzut ekranu żądania Lighthouse Keep liczy się jako mały, a audyt wielkości transferu"></figure>

- Wartości **Żądania** i **Rozmiar transferu** w wierszu **Suma** są obliczane przez dodanie wartości w wierszach **Obraz** , **Skrypt** , **Czcionka** , **Arkusz stylów** , **Inne** , **Dokument** i **Media** .
- Kolumna Firma **zewnętrzna** nie uwzględnia wartości wiersza **Suma** . Jego celem jest uświadomienie Ci, ile wszystkich żądań i jaka część całkowitego rozmiaru transferu pochodzi z domen zewnętrznych. Żądania stron trzecich mogą być połączeniem dowolnego innego typu zasobów.

{% Aside %} Like all of the **Diagnostics** audits, the **Keep request counts low and transfer sizes small** audit does not directly affect your **Performance** score. However, reducing request counts or transfer sizes may improve other **Performance** metrics. {% endAside %}

## Jak zmniejszyć liczbę zasobów i rozmiary transferu

Wpływ dużej liczby zasobów lub dużych rozmiarów transferu na wydajność ładowania zależy od typu żądanego zasobu.

### CSS i JavaScript

Żądania dotyczące plików CSS i JavaScript domyślnie blokują renderowanie. Innymi słowy, przeglądarki nie mogą renderować treści na ekranie, dopóki wszystkie żądania CSS i JavaScript nie zostaną zakończone. Jeśli którykolwiek z tych plików jest hostowany na wolnym serwerze, ten jeden wolny serwer może opóźnić cały proces renderowania. Zobacz [Optymalizacja JavaScript] , [Optymalizacja zasobów stron trzecich] i [Optymalizacja CSS,] aby dowiedzieć się, jak dostarczyć tylko ten kod, którego faktycznie potrzebujesz.

Dane, których to dotyczy: [wszystkie]

### Obrazy

Żądania obrazów nie blokują renderowania, jak CSS i JavaScript, ale nadal mogą negatywnie wpływać na wydajność ładowania. Częstym problemem jest sytuacja, gdy użytkownik mobilny ładuje stronę i widzi, że obrazy zaczęły się ładować, ale ukończenie zajmie trochę czasu. Zobacz [Optymalizowanie obrazów,] aby dowiedzieć się, jak szybciej ładować obrazy.

Dane, których dotyczy problem: [Pierwsza treściwa farba] , [pierwsza znacząca farba] , [indeks prędkości]

### Czcionki

Nieefektywne ładowanie plików czcionek może powodować niewidoczny tekst podczas ładowania strony. Zobacz [Optymalizowanie czcionek,] aby dowiedzieć się, jak domyślnie ustawić czcionkę dostępną na urządzeniu użytkownika, a następnie przełączyć się na czcionkę niestandardową po zakończeniu pobierania.

Dane, których dotyczy problem: [Pierwsza treściwa farba](/first-contentful-paint)

### Dokumenty

Jeśli Twój plik HTML jest duży, przeglądarka musi poświęcić więcej czasu na analizowanie kodu HTML i tworzenie drzewa DOM na podstawie przeanalizowanego kodu HTML.

Dane, których dotyczy problem: [Pierwsza treściwa farba](/first-contentful-paint)

### Głoska bezdźwięczna

Animowane pliki GIF są często bardzo duże. Zobacz [Zastąp GIF-y filmami,] aby dowiedzieć się, jak szybciej ładować animacje.

Dane, których dotyczy problem: [Pierwsza treściwa farba](/first-contentful-paint)

## Użyj budżetów wydajności, aby zapobiec regresjom

Po zoptymalizowaniu kodu w celu zmniejszenia liczby żądań i rozmiarów transferów zobacz [Ustawianie budżetów wydajnościowych,](/fast#set-performance-budgets) aby dowiedzieć się, jak zapobiegać regresjom.

## Zasoby

[Source code for **Keep request counts low and transfer sizes small** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/resource-summary.js)


[Optymalizacja CSS,]: /fast#optimize-your-css
[Optymalizacja JavaScript]: /fast#optimize-your-javascript
[Optymalizacja zasobów stron trzecich]: /fast#optimize-your-third-party-resources
[wszystkie]: /lighthouse-performance#metrics
[Optymalizowanie obrazów,]: /fast#optimize-your-images
[Pierwsza treściwa farba]: /first-contentful-paint
[pierwsza znacząca farba]: /first-meaningful-paint
[indeks prędkości]: /speed-index
[Optymalizowanie czcionek,]: /fast/#optimize-web-fonts
[Zastąp GIF-y filmami,]: /replace-gifs-with-videos/