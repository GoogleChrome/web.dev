---
layout: Poczta
title: Jak działa wyszukiwarka
authors:
- ekharvey
date: 2018-11-05
description: Wyszukiwarki to cyfrowa wersja bibliotekarza. Korzystają z obszernego indeksu, aby znaleźć odpowiednie informacje do zapytania. Zrozumienie podstaw wyszukiwania przygotuje Cię do znalezienia treści dla użytkowników.
web_lighthouse: Nie dotyczy
---

## Co robi wyszukiwarka?

To jest edycja manualna Wyszukiwarki to cyfrowa wersja bibliotekarza. Korzystają z obszernego indeksu, aby znaleźć odpowiednie informacje do zapytania. Zrozumienie podstaw wyszukiwania przygotuje Cię do **znalezienia** treści dla użytkowników.

## Jak roboty przeglądają internet

Czołganie się przypomina czytanie wszystkich książek w bibliotece. Zanim wyszukiwarki będą mogły przynieść jakiekolwiek wyniki wyszukiwania, muszą uzyskać jak najwięcej informacji z sieci. W tym celu wyszukiwarki używają robota - programu, który przemieszcza się z witryny do witryny i działa jak przeglądarka.

Jeśli brakuje książki lub dokumentu lub jest on uszkodzony, robot nie może ich odczytać. Przeszukiwacze próbują pobrać każdy adres URL, aby określić stan dokumentu. Jeśli dokument zwróci kod statusu błędu, roboty indeksujące nie mogą użyć żadnej z jego treści i mogą ponownie spróbować podać adres URL w późniejszym czasie. Dzięki temu do indeksu trafiają tylko publicznie dostępne dokumenty.

Jeśli roboty indeksujące wykryją kod stanu przekierowania (np. 301 lub 302), wykonują przekierowanie do nowego adresu URL i kontynuują pod tym kątem. Po uzyskaniu pomyślnej odpowiedzi, co oznacza, że znaleźli dokument dostępny dla użytkowników, sprawdzają, czy można go zindeksować, a następnie pobierają zawartość.

To sprawdzenie obejmuje kod HTML i całą zawartość wymienioną w kodzie HTML, taką jak obrazy, filmy lub JavaScript. Przeszukiwacze również wyodrębniają odsyłacze z dokumentów HTML, tak aby przeszukiwacz mógł również odwiedzić połączone adresy URL. Poniższe linki pokazują, w jaki sposób roboty indeksujące znajdują nowe strony w sieci.

Roboty nie klikają aktywnie linków ani przycisków, tylko wysyłają adresy URL do kolejki w celu ich późniejszego zindeksowania. Podczas uzyskiwania dostępu do nowego adresu URL nie są dostępne żadne pliki cookie, pracownicy usług ani pamięć lokalna (taka jak IndexedDB).

## Budowanie indeksu

Po pobraniu dokumentu przeszukiwacz przekazuje treść wyszukiwarce w celu dodania jej do indeksu. Wyszukiwarka renderuje teraz i analizuje treść, aby ją zrozumieć. Renderowanie oznacza wyświetlanie strony tak, jak przeglądałaby to przeglądarka ( [z pewnymi ograniczeniami](https://developers.google.com/search/docs/guides/rendering) ).

Wyszukiwarki sprawdzają słowa kluczowe, tytuł, linki, nagłówki, tekst i wiele innych rzeczy. Są to tak zwane **sygnały,** które opisują zawartość i kontekst strony. Sygnały pozwalają wyszukiwarkom odpowiedzieć na każde zapytanie za pomocą najlepszej możliwej strony.

Wyszukiwarki mogą znaleźć tę samą treść pod różnymi adresami URL. Na przykład przepis na „szarlotkę” może znajdować się pod `/recipes/apple-pie` i pod `/recipes/1234` . Aby uniknąć indeksowania i dwukrotnego wyświetlania przepisu, wyszukiwarki określają, jaki powinien być główny adres URL i odrzucają alternatywne adresy URL zawierające tę samą zawartość.

## Dostarczanie najbardziej przydatnych wyników

Wyszukiwarki wykonują więcej pracy niż po prostu dopasowując zapytanie do słów kluczowych w indeksie. Aby uzyskać przydatne wyniki, mogą wziąć pod uwagę kontekst, alternatywne sformułowania, lokalizację użytkownika i nie tylko. Na przykład „dolina krzemowa” może odnosić się do regionu geograficznego lub programu telewizyjnego. Ale jeśli zapytaniem jest „rzut doliny krzemu”, wyniki dotyczące regionu nie są zbyt pomocne.

Niektóre zapytania mogą być pośrednie, np. „Piosenka z pulp fiction”, a wyszukiwarki muszą je zinterpretować i pokazać wyniki dotyczące muzyki w filmie. Gdy użytkownik czegoś szuka, wyszukiwarki określają najbardziej przydatne wyniki, a następnie pokazują je użytkownikowi. Ranking lub porządkowanie stron odbywa się na podstawie zapytania. Kolejność może często zmieniać się w czasie, jeśli dostępne będą lepsze informacje.

## Kolejne kroki: jak zoptymalizować pod kątem wyszukiwarek

Teraz, gdy rozumiesz już podstawy działania wyszukiwarek, możesz dostrzec wartość w optymalizacji pod kątem wyszukiwarek. Nazywa się to SEO lub „Search Engine Optimization”. Upewniając się, że wyszukiwarki mogą znajdować i automatycznie rozpoznawać Twoje treści, poprawiasz widoczność swojej witryny dla odpowiednich wyszukiwań. Może to spowodować, że do Twojej witryny trafią bardziej zainteresowani użytkownicy. Audytuj swoją witrynę za pomocą Lighthouse i sprawdź wyniki SEO, aby zobaczyć, jak dobrze wyszukiwarki mogą wyświetlać Twoje treści.
