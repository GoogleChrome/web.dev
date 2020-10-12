---
layout: post
title: Użyj formatów wideo dla animowanych treści
description: Dowiedz się o skutecznym audycie treści animowanych.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
- wydajna-animowana-treść
---

Sekcja Możliwości raportu Lighthouse zawiera listę wszystkich animowanych plików GIF wraz z szacunkowymi oszczędnościami w sekundach uzyskanymi dzięki konwersji tych plików GIF na wideo:

<figure class="w-figure"><img class="w-screenshot" src="efficient-animated-content.png" alt="Zrzut ekranu z latarni morskiej Użyj formatów wideo do audytu zawartości animowanej"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Dlaczego warto zastąpić animowane pliki GIF wideo

Duże pliki GIF są nieefektywne do dostarczania animowanych treści. Konwertując duże pliki GIF na filmy, możesz znacznie zaoszczędzić na przepustowości użytkowników. Rozważ użycie wideo MPEG4 / WebM dla animacji i PNG / WebP dla obrazów statycznych zamiast GIF, aby zaoszczędzić bajty sieciowe.

## Twórz filmy MPEG

Istnieje wiele sposobów konwertowania plików GIF na wideo. [FFmpeg](https://ffmpeg.org/) to narzędzie używane w tym przewodniku. Aby użyć FFmpeg do konwersji GIF, `my-animation.gif` na wideo MP4, uruchom następujące polecenie w konsoli:

`ffmpeg -i my-animation.gif my-animation.mp4`

To mówi FFmpeg, aby wziął `my-animation.gif` jako dane wejściowe, co jest oznaczone flagą `-i` , i przekonwertował go na wideo o nazwie `my-animation.mp4` .

## Twórz filmy WebM

Filmy WebM są znacznie mniejsze niż filmy MP4, ale nie wszystkie przeglądarki obsługują WebM, więc warto wygenerować oba.

Aby użyć FFmpeg do przekonwertowania `my-animation.gif` na wideo WebM, uruchom następujące polecenie w konsoli:

`ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm`

## Zastąp obraz GIF wideo

Animowane GIF-y mają trzy kluczowe cechy, które musi odtworzyć wideo:

- Grają automatycznie.
- Zapętlają się w sposób ciągły (zwykle, ale można zapobiec zapętleniu).
- Milczą.

Na szczęście możesz odtworzyć te zachowania za pomocą elementu `<video>` .

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

## Zasoby

- [Source code for **Use video formats for animated content** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/efficient-animated-content.js)
- [Zastąp animowane pliki GIF wideo, aby przyspieszyć ładowanie strony](/replace-gifs-with-videos)
- [Zastąp GIF-y kodem wideo](/codelab-replace-gifs-with-video)
