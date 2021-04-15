---
layout: post
title: Zmniejsz CSS
description: Dowiedz się o audycie unminified-css.
date: '2019-05-02'
updated: '2020-05-29'
web_lighthouse:
  - unminified-css
---

The Opportunities section of your Lighthouse report lists all unminified CSS files, along with the potential savings in [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) when these files are minified:

<figure class="w-figure"><img class="w-screenshot" src="unminified-css.png" alt="Zrzut ekranu audytu Lighthouse Minify CSS"></figure>

## Jak zmniejszanie plików CSS może poprawić wydajność

Zmniejszanie plików CSS może poprawić wydajność ładowania strony. Pliki CSS są często większe, niż powinny. Na przykład:

```css
/* Header background should match brand colors. */
h1 {
  background-color: #000000;
}
h2 {
  background-color: #000000;
}
```

Można zredukować do:

```css
h1, h2 { background-color: #000000; }
```

Z punktu widzenia przeglądarki te 2 przykłady kodu są funkcjonalnie równoważne, ale drugi przykład wykorzystuje mniej bajtów. Minifikatory mogą dodatkowo poprawić wydajność bajtów poprzez usunięcie białych znaków:

```css
h1,h2{background-color:#000000;}
```

Niektóre minifier stosują sprytne sztuczki, aby zminimalizować liczbę bajtów. Na przykład wartość koloru `#000000` można dalej zredukować do `#000` , co jest jej skróconym odpowiednikiem.

Lighthouse zapewnia oszacowanie potencjalnych oszczędności na podstawie komentarzy i białych znaków, które znajduje w Twoim CSS. To ostrożne oszacowanie. Jak wspomniano wcześniej, minifier mogą przeprowadzać sprytne optymalizacje (takie jak zmniejszenie `#000000` do `#000` ), aby jeszcze bardziej zmniejszyć rozmiar pliku. Tak więc, jeśli używasz minifier, możesz zobaczyć więcej oszczędności niż podaje Lighthouse.

## Użyj minifier CSS, aby zminimalizować swój kod CSS

W przypadku małych witryn, których nie aktualizujesz często, prawdopodobnie możesz skorzystać z usługi online do ręcznego zmniejszania plików. Wklejasz swój CSS do interfejsu użytkownika usługi i zwraca on zminimalizowaną wersję kodu.

W przypadku profesjonalnych programistów prawdopodobnie chcesz skonfigurować zautomatyzowany przepływ pracy, który automatycznie minimalizuje CSS przed wdrożeniem zaktualizowanego kodu. Zwykle odbywa się to za pomocą narzędzia do kompilacji, takiego jak Gulp lub Webpack.

Learn how to minify your CSS code in [Minify CSS](/minify-css).

## Zasoby

- [Kod źródłowy do audytu **Minify CSS**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-css.js)
- [Zmniejsz CSS](/minify-css)
- [Zminimalizuj i skompresuj ładunki sieciowe](/reduce-network-payloads-using-text-compression)
