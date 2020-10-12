---
layout: post
title: Udostępniaj zasoby statyczne za pomocą wydajnych zasad pamięci podręcznej
description: Dowiedz się, jak buforowanie statycznych zasobów strony internetowej może poprawić wydajność i niezawodność dla powracających użytkowników.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
- używa-long-cache-ttl
---

Buforowanie HTTP może przyspieszyć ładowanie strony przy kolejnych wizytach.

Gdy przeglądarka żąda zasobu, serwer dostarczający zasób może powiedzieć przeglądarce, jak długo powinna tymczasowo przechowywać lub *buforować* zasób. W przypadku każdego kolejnego żądania dotyczącego tego zasobu przeglądarka korzysta z jego kopii lokalnej, zamiast pobierać ją z sieci.

## Jak zawodzi audyt zasad pamięci podręcznej Lighthouse

[Lighthouse oznacza](https://developers.google.com/web/tools/lighthouse/) wszystkie statyczne zasoby, które nie są buforowane:

<figure class="w-figure"><img class="w-screenshot" src="uses-long-cache-ttl.png" alt="Zrzut ekranu przedstawiający statyczne zasoby Lighthouse Serve z wydajnym audytem zasad pamięci podręcznej"></figure>

Lighthouse uważa, że zasób można zapisać w pamięci podręcznej, jeśli spełnione są wszystkie następujące warunki:

- Zasób to czcionka, obraz, plik multimedialny, skrypt lub arkusz stylów.
- Zasób ma [kod stanu HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) `200` , `203` lub `206` .
- Zasób nie ma jawnej zasady braku pamięci podręcznej.

Kiedy strona nie przejdzie audytu, Lighthouse wyświetla wyniki w tabeli z trzema kolumnami:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td><strong>URL</strong></td>
        <td>Lokalizacja zasobu, który można zapisać w pamięci podręcznej</td>
      </tr>
      <tr>
        <td><strong>Cache TTL</strong></td>
        <td>Bieżący czas trwania pamięci podręcznej zasobu</td>
      </tr>
      <tr>
        <td><strong>Rozmiar</strong></td>
        <td>Szacunkowa liczba danych, które użytkownicy zapisaliby, gdyby oznaczony zasób został zapisany w pamięci podręcznej</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Jak buforować zasoby statyczne przy użyciu buforowania HTTP

Configure your server to return the `Cache-Control` HTTP response header:

```js
Cache-Control: max-age=31536000
```

Dyrektywa `max-age` mówi przeglądarce, jak długo powinna buforować zasób w ciągu kilku sekund. Ten przykład ustawia czas trwania na `31536000` , co odpowiada 1 rokowi: 60 sekund × 60 minut × 24 godziny × 365 dni = 31536000 sekund.

Jeśli to możliwe, przechowuj niezmienne zasoby statyczne w pamięci podręcznej przez długi czas, na przykład rok lub dłużej.

{% Aside %} One risk of long cache durations is that your users won't see updates to static files. You can avoid this issue by configuring your build tool to embed a hash in your static asset filenames so that each version is unique, prompting the browser to fetch the new version from the server. (To learn how to embed hashes using webpack, see webpack's [Caching](https://webpack.js.org/guides/caching/) guide.) {% endAside %}

Użyj `no-cache` jeśli zasób się zmienia i aktualność ma znaczenie, ale nadal chcesz uzyskać niektóre korzyści z szybkości buforowania. Przeglądarka nadal buforuje zasób, który jest ustawiony na `no-cache` ale najpierw sprawdza serwer, aby upewnić się, że zasób jest nadal aktualny.

Dłuższy czas przechowywania w pamięci podręcznej nie zawsze jest lepszy. Ostatecznie to Ty decydujesz, jaki jest optymalny czas trwania pamięci podręcznej dla Twoich zasobów.

There are many directives for customizing how the browser caches different resources. Learn more about caching resources in [The HTTP cache: your first line of defense guide](/http-cache) and [Configuring HTTP caching behavior codelab](/codelab-http-cache).

## Jak zweryfikować odpowiedzi zapisane w pamięci podręcznej w Chrome DevTools

Aby sprawdzić, jakie zasoby przeglądarka pobiera z pamięci podręcznej, otwórz kartę **Sieć** w Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

Kolumna **Rozmiar** w Chrome DevTools może pomóc Ci sprawdzić, czy zasób został zapisany w pamięci podręcznej:

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="size.png" alt="Kolumna Rozmiar."></figure>

Chrome obsługuje najczęściej żądane zasoby z pamięci podręcznej, która jest bardzo szybka, ale jest czyszczona po zamknięciu przeglądarki.

Aby sprawdzić, czy nagłówek `Cache-Control` zasobu jest ustawiony zgodnie z oczekiwaniami, sprawdź jego dane nagłówka HTTP:

1. Kliknij adres URL żądania w kolumnie **Nazwa** w tabeli Żądania.
2. Kliknij kartę **Nagłówki** .

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="cache-control-header.png" alt="Sprawdzanie nagłówka Cache-Control na karcie Nagłówki"><figcaption class="w-figcaption">Sprawdzanie nagłówka <code>Cache-Control</code> na karcie <b>Nagłówki</b> .</figcaption></figure>

## Zasoby

- [Source code for **Serve static assets with an efficient cache policy** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js)
- [Specyfikacja Cache-Control](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
- [Cache-Control (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
