---
layout: post
title: Efektywnie koduj obrazy
description: Dowiedz się o audycie zoptymalizowanych obrazów.
date: '2019-05-02'
updated: '2020-06-20'
web_lighthouse:
  - używa zoptymalizowanych-obrazów
---

Sekcja Możliwości raportu Lighthouse zawiera listę wszystkich niezoptymalizowanych obrazów z potencjalnymi oszczędnościami w [kibibajtach (KiB)](https://en.wikipedia.org/wiki/Kibibyte) . Zoptymalizuj te obrazy, aby strona ładowała się szybciej i zużywała mniej danych:

<figure class="w-figure"><img class="w-screenshot" src="uses-optimized-images.png" alt="Zrzut ekranu latarni morskiej Efektywnie koduj audyt obrazów"></figure>

## Jak Lighthouse oznacza obrazy jako optymalne

Lighthouse zbiera wszystkie obrazy JPEG lub BMP na stronie, ustawia poziom kompresji każdego obrazu na 85, a następnie porównuje wersję oryginalną z wersją skompresowaną. Jeśli potencjalne oszczędności wynoszą 4 KB lub więcej, Lighthouse oflaguje obraz jako optymalizowalny.

## Jak zoptymalizować obrazy

Istnieje wiele kroków, które możesz podjąć, aby zoptymalizować swoje obrazy, w tym:

- [Korzystanie z sieci CDN obrazów](/image-cdns/)
- [Kompresja obrazów](/use-imagemin-to-compress-images)
- [Zastępowanie animowanych plików GIF wideo](/replace-gifs-with-videos)
- [Leniwe ładowanie obrazów](/use-lazysizes-to-lazyload-images)
- [Dostarczanie responsywnych obrazów](/serve-responsive-images)
- [Dostarczanie obrazów o prawidłowych wymiarach](/serve-images-with-correct-dimensions)
- [Korzystanie z obrazów WebP](/serve-images-webp)

## Optymalizuj obrazy za pomocą narzędzi GUI

Innym podejściem jest przepuszczanie obrazów przez optymalizator, który instalujesz na swoim komputerze i uruchamiasz jako GUI. Na przykład dzięki [ImageOptim](https://imageoptim.com/mac) przeciągasz i upuszczasz obrazy do jego interfejsu użytkownika, a następnie automatycznie kompresuje obrazy bez zauważalnego pogorszenia jakości. Jeśli prowadzisz małą witrynę i możesz obsługiwać ręczną optymalizację wszystkich obrazów, ta opcja jest prawdopodobnie wystarczająco dobra.

[Squoosh](https://squoosh.app/) to kolejna opcja. Squoosh jest utrzymywany przez zespół Google Web DevRel.

## Zasoby

- [Source code for **Efficiently encode images** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-optimized-images.js)
