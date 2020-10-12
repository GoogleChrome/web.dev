---
layout: post
title: Zmniejsz JavaScript
description: Dowiedz się o audycie niezminimalizowanym javascript.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
- unminified-javascript
---

Zmniejszanie plików JavaScript może zmniejszyć rozmiary ładunku i skrócić czas analizy skryptu. Sekcja Możliwości raportu Lighthouse zawiera listę wszystkich niezminimalizowanych plików JavaScript, wraz z potencjalnymi oszczędnościami w [kibibajtach (KiB),](https://en.wikipedia.org/wiki/Kibibyte) gdy te pliki są zminimalizowane:

<figure class="w-figure"><img class="w-screenshot" src="unminified-javascript.png" alt="Zrzut ekranu audytu Lighthouse Minify JavaScript"></figure>

## Jak zminimalizować pliki JavaScript

Minifikacja to proces usuwania białych znaków i dowolnego kodu, który nie jest konieczny do utworzenia mniejszego, ale doskonale poprawnego pliku kodu. [Terser](https://github.com/terser-js/terser) to popularne narzędzie do kompresji JavaScript. Pakiet webpack v4 zawiera domyślnie wtyczkę do tej biblioteki, która umożliwia tworzenie zminimalizowanych plików kompilacji.

## Zasoby

- [Kod źródłowy do audytu **Minify JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-javascript.js)
