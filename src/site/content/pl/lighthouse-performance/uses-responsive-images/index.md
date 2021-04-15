---
layout: post
title: Obrazy o odpowiednim rozmiarze
description: Dowiedz się o audycie obrazów responsywnych.
date: '2019-05-02'
updated: '2020-06-20'
web_lighthouse:
  - używa-responsywnych-obrazów
---

Sekcja Możliwości raportu Lighthouse zawiera listę wszystkich obrazów na Twojej stronie, które nie mają odpowiedniego rozmiaru, wraz z potencjalnymi oszczędnościami w [kibibajtach (KiB)](https://en.wikipedia.org/wiki/Kibibyte) . Zmień rozmiar tych obrazów, aby zaoszczędzić dane i skrócić czas ładowania strony:

<figure class="w-figure"><img class="w-screenshot" src="uses-responsive-images.png" alt="Zrzut ekranu audytu obrazów latarni morskiej o prawidłowym rozmiarze"></figure>

## Jak Lighthouse oblicza ponadwymiarowe obrazy

Lighthouse porównuje rozmiar renderowanego obrazu z rozmiarem rzeczywistego obrazu dla każdego obrazu na stronie. Renderowany rozmiar ma również wpływ na współczynnik pikseli urządzenia. Jeśli renderowany rozmiar jest co najmniej 4 KB mniejszy niż rozmiar rzeczywisty, obraz nie przechodzi audytu.

## Strategie prawidłowego rozmiaru obrazów

W idealnym przypadku strona nigdy nie powinna wyświetlać obrazów, które są większe niż wersja renderowana na ekranie użytkownika. Cokolwiek większe niż to powoduje tylko zmarnowane bajty i spowalnia czas ładowania strony.

Główna strategia wyświetlania obrazów o odpowiednich rozmiarach to „obrazy responsywne”. W przypadku elastycznych obrazów generujesz wiele wersji każdego obrazu, a następnie określasz, której wersji chcesz użyć w kodzie HTML lub CSS, korzystając z zapytań o media, wymiarów widocznego obszaru itd. Aby dowiedzieć się więcej, zobacz Wyświetlanie [responsywnych obrazów](/serve-responsive-images) .

[Graficzne sieci CDN](/image-cdns/) to kolejna główna strategia udostępniania obrazów o odpowiednich rozmiarach. Możesz myśleć o CDN obrazów, takich jak interfejsy API usług internetowych do przekształcania obrazów.

Inną strategią jest użycie formatów graficznych opartych na wektorach, takich jak SVG. Przy ograniczonej ilości kodu obraz SVG można skalować do dowolnego rozmiaru. Aby dowiedzieć się więcej, zobacz [Zastępowanie skomplikowanych ikon formatem SVG](https://developers.google.com/web/fundamentals/design-and-ux/responsive/images#replace_complex_icons_with_svg) .

Narzędzia takie jak [Gulp-responsive](https://www.npmjs.com/package/gulp-responsive) lub [responsive-images-generator](https://www.npmjs.com/package/responsive-images-generator) mogą pomóc zautomatyzować proces konwersji obrazu do wielu formatów. Istnieją również sieci CDN obrazów, które umożliwiają generowanie wielu wersji podczas przesyłania obrazu lub żądania go ze strony.

## Zasoby

- [Source code for **Properly size images** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-responsive-images.js)
- [Wyświetlaj obrazy o prawidłowych wymiarach](/serve-images-with-correct-dimensions)
