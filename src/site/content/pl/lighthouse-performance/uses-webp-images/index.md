---
layout: post
title: Wyświetlaj obrazy w formatach nowej generacji
description: Dowiedz się więcej o audycie uses-webp-images.
date: '2019-05-02'
updated: '2020-05-29'
codelabs:
  - codelab-serve-images-webp
web_lighthouse:
  - używa-webp-images
---

Sekcja Możliwości w raporcie Lighthouse zawiera wszystkie obrazy w starszych formatach obrazów, pokazując potencjalne oszczędności uzyskane dzięki udostępnianiu wersji tych obrazów w sieci Web:

<figure class="w-figure"><img class="w-screenshot" src="uses-webp-images.png" alt="Zrzut ekranu obrazów Lighthouse Serve w audycie formatów nowej generacji"></figure>

## Po co udostępniać obrazy w formacie WebP

JPEG 2000, JPEG XR i WebP to formaty obrazów, które charakteryzują się lepszą kompresją i jakością w porównaniu ze starszymi odpowiednikami JPEG i PNG. Kodowanie obrazów w tych formatach, a nie w formacie JPEG lub PNG, oznacza, że będą ładować się szybciej i zużywać mniej danych komórkowych.

WebP jest obsługiwany w przeglądarkach Chrome i Opera i zapewnia lepszą stratną i bezstratną kompresję obrazów w Internecie. Zobacz [Nowy format obrazu dla sieci,](https://developers.google.com/speed/webp/) aby uzyskać więcej informacji na temat WebP.

{% Aside 'codelab' %} [Twórz obrazy WebP za pomocą wiersza poleceń](/codelab-serve-images-webp) {% endAside %}

## Jak Lighthouse oblicza potencjalne oszczędności

Lighthouse zbiera każdy obraz BMP, JPEG i PNG na stronie, a następnie konwertuje każdy z nich na WebP, raportując potencjalne oszczędności w oparciu o dane dotyczące konwersji.

{% Aside 'note' %} Lighthouse pomija obraz w swoim raporcie, jeśli potencjalne oszczędności są mniejsze niż 8 KB. {% endAside %}

## Zgodność z przeglądarkami

Obsługa przeglądarek nie jest uniwersalna w przypadku WebP, ale podobne oszczędności powinny być dostępne w większości głównych przeglądarek w alternatywnym formacie nowej generacji. Do obsługi innych przeglądarek musisz podać zastępczy obraz PNG lub JPEG. Zobacz [Jak mogę sprawdzić, czy przeglądarka obsługuje WebP?](https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp) aby zapoznać się z przeglądem technik awaryjnych i poniższą listą dotyczącą obsługi formatów graficznych przez przeglądarki.

Aby zobaczyć bieżącą obsługę przeglądarek dla każdego formatu następnej generacji, sprawdź poniższe wpisy:

- [WebP](https://caniuse.com/#feat=webp)
- [JPEG 2000](https://caniuse.com/#feat=jpeg2000)
- [JPEG XR](https://caniuse.com/#feat=jpegxr)

## Zasoby

- [Kod źródłowy do audytu wyświetlanych **obrazów w formatach nowej generacji**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-webp-images.js)
- [Użyj obrazów WebP](/serve-images-webp)

<!-- https://www.reddit.com/r/webdev/comments/gspjwe/serve_images_in_nextgen_formats/ -->
