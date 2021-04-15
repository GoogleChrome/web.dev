---
layout: post
title: Upewnij się, że tekst pozostaje widoczny podczas ładowania czcionek internetowych
description: Dowiedz się, jak korzystać z interfejsu API wyświetlania czcionek, aby upewnić się, że tekst strony internetowej będzie zawsze widoczny dla użytkowników.
date: '2019-05-02'
updated: '2020-04-29'
web_lighthouse:
  - wyświetlanie czcionek
---

Czcionki to często duże pliki, których ładowanie zajmuje trochę czasu. Niektóre przeglądarki ukrywają tekst do momentu wczytania czcionki, powodując [błysk niewidocznego tekstu (FOIT)](/avoid-invisible-text) .

## Jak nieudany jest audyt wyświetlania czcionek Lighthouse

[Lighthouse oznacza](https://developers.google.com/web/tools/lighthouse/) wszystkie adresy URL czcionek, które mogą wyświetlać niewidoczny tekst:

<figure class="w-figure"><img class="w-screenshot" src="font-display.png" alt="Zrzut ekranu Lighthouse Upewnij się, że tekst pozostaje widoczny podczas audytu ładowania czcionek internetowych"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak uniknąć wyświetlania niewidocznego tekstu

Najłatwiejszym sposobem uniknięcia wyświetlania niewidocznego tekstu podczas ładowania czcionek niestandardowych jest tymczasowe wyświetlenie czcionki systemowej. Włączając `font-display: swap` w stylu `@font-face` , możesz uniknąć FOIT w większości nowoczesnych przeglądarek:

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

[Interfejs API wyświetlania czcionek](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) określa sposób wyświetlania czcionki. `swap` mówi przeglądarce, że tekst wykorzystujący czcionkę powinien być natychmiast wyświetlany przy użyciu czcionki systemowej. Gdy czcionka niestandardowa jest gotowa, zastępuje czcionkę systemową. (Aby uzyskać więcej informacji, zobacz [Unikaj niewidocznego tekstu podczas ładowania](/avoid-invisible-text) postu).

### Wstępne ładowanie czcionek internetowych

Użyj `<link rel="preload">` aby wcześniej pobrać pliki czcionek. Ucz się więcej:

- [Wczytaj wstępnie czcionki internetowe, aby przyspieszyć ładowanie (Codelab)](/codelab-preload-web-fonts/)
- [Zapobiegaj przesuwaniu się układu i błyskom niewidocznego tekstu (FOIT), wstępnie ładując opcjonalne czcionki](/preload-optional-fonts/)

### Czcionki Google

Dodaj `&display=swap` [parametr](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#Basics_anatomy_of_a_URL) do końca swojej Google Fonts URL:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## Wsparcie przeglądarki

Warto wspomnieć, że nie wszystkie główne przeglądarki obsługują `font-display: swap` , więc może być konieczne wykonanie trochę więcej pracy, aby naprawić problem z niewidocznym tekstem.

{% Aside 'codelab' %} Zajrzyj do [książki Unikaj flashowania niewidocznego tekstu,](/codelab-avoid-invisible-text) aby dowiedzieć się, jak unikać FOIT we wszystkich przeglądarkach. {% endAside %}

## Zasoby

- [Source code for **Ensure text remains visible during webfont load** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js)
- [Unikaj niewidocznego tekstu podczas ładowania](/avoid-invisible-text)
- [Kontrolowanie wydajności czcionek za pomocą wyświetlania czcionek](https://developers.google.com/web/updates/2016/02/font-display)
- [Wczytaj wstępnie czcionki internetowe, aby przyspieszyć ładowanie (Codelab)](/codelab-preload-web-fonts/)
- [Zapobiegaj przesuwaniu się układu i błyskom niewidocznego tekstu (FOIT), wstępnie ładując opcjonalne czcionki](/preload-optional-fonts/)
