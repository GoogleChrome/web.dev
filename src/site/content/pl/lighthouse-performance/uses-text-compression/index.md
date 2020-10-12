---
layout: post
title: Włącz kompresję tekstu
description: Dowiedz się, jak włączenie kompresji tekstu może poprawić wydajność ładowania strony internetowej.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
- używa kompresji tekstu
---

Zasoby tekstowe powinny być obsługiwane z kompresją, aby zminimalizować łączną liczbę bajtów sieciowych. Sekcja Możliwości raportu Lighthouse zawiera listę wszystkich zasobów tekstowych, które nie są skompresowane:

<figure class="w-figure"><img class="w-screenshot" src="uses-text-compression.png" alt="Zrzut ekranu audytu kompresji Lighthouse Enable"></figure>

## Jak Lighthouse obsługuje kompresję tekstu

Lighthouse zbiera wszystkie odpowiedzi, które:

- Mają typy zasobów oparte na tekście.
- Nie dołączaj nagłówka `content-encoding` ustawionego na `br` , `gzip` lub `deflate` .

Następnie Lighthouse kompresuje każdy z nich za pomocą [GZIP,](https://www.gnu.org/software/gzip/) aby obliczyć potencjalne oszczędności.

Jeśli oryginalny rozmiar odpowiedzi jest mniejszy niż 1,4 KB lub jeśli potencjalne oszczędności kompresji są mniejsze niż 10% rozmiaru oryginalnego, Lighthouse nie oznacza tej odpowiedzi w wynikach.

{% Aside 'note' %} Potencjalne oszczędności wymienione w Lighthouse to potencjalne oszczędności, gdy odpowiedź jest kodowana za pomocą GZIP. Jeśli używa się Brotli, możliwe są jeszcze większe oszczędności. {% endAside %}

## Jak włączyć kompresję tekstu na serwerze

Włącz kompresję tekstu na serwerach, które obsługiwały te odpowiedzi, aby przejść ten audyt.

Gdy przeglądarka zażąda zasobu, użyje nagłówka żądania HTTP [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) aby wskazać obsługiwane algorytmy kompresji.

```text
Accept-Encoding: gzip, compress, br
```

Jeśli przeglądarka obsługuje [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) ( `br` ), należy użyć Brotli, ponieważ może on zmniejszyć rozmiar pliku zasobów bardziej niż inne algorytmy kompresji. Wyszukaj, `how to enable Brotli compression in <X>` , gdzie `<X>` to nazwa Twojego serwera. Od czerwca 2020 Brotli jest obsługiwany we wszystkich głównych przeglądarkach z wyjątkiem Internet Explorera, Safari na komputer i Safari na iOS. Aby uzyskać aktualizacje, patrz [Zgodność przeglądarek](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#Browser_compatibility) .

Użyj GZIP jako alternatywy dla Brotli. GZIP jest obsługiwany we wszystkich głównych przeglądarkach, ale jest mniej wydajny niż Brotli. Przykłady można znaleźć w sekcji [Konfiguracja serwera](https://github.com/h5bp/server-configs) .

Twój serwer powinien zwrócić nagłówek odpowiedzi HTTP [`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) aby wskazać, jakiego algorytmu kompresji użył.

```text
Content-Encoding: br
```

## Sprawdź, czy odpowiedź została skompresowana w Chrome DevTools

Aby sprawdzić, czy serwer skompresował odpowiedź:

{% Instruction 'devtools-network', 'ol' %}

1. Kliknij żądanie, które spowodowało odpowiedź, która Cię interesuje.
2. Kliknij kartę **Nagłówki** .
3. Sprawdź nagłówek `content-encoding` w sekcji **Nagłówki odpowiedzi** .

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="content-encoding.svg" alt="Nagłówek odpowiedzi kodowania treści"><figcaption class="w-figcaption">Nagłówek odpowiedzi <code>content-encoding</code> .</figcaption></figure>

Aby porównać skompresowane i zdekompresowane rozmiary odpowiedzi:

{% Instruction 'devtools-network', 'ol' %}

1. Włącz duże wiersze żądań. Zobacz [Używanie dużych wierszy żądań](https://developers.google.com/web/tools/chrome-devtools/network/reference#request-rows) .
2. Spójrz na kolumnę **Rozmiar pod** kątem odpowiedzi, która Cię interesuje. Najwyższa wartość to rozmiar skompresowany. Najniższa wartość to rozmiar po dekompresji.

Zobacz także [Zmniejszanie i kompresowanie ładunków sieciowych](/reduce-network-payloads-using-text-compression) .

## Zasoby

- [Source code for **Enable text compression** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-text-compression.js)
