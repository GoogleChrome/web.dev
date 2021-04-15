---
layout: post
title: Skróć czas odpowiedzi serwera (TTFB)
description: Dowiedz się o audycie czasu do pierwszego bajtu.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - czas do pierwszego bajtu
---

Sekcja Możliwości raportu Lighthouse raportuje Czas do pierwszego bajtu, czyli czas, w jakim przeglądarka użytkownika otrzyma pierwszy bajt zawartości strony:

<figure class="w-figure"><img class="w-screenshot" src="time-to-first-byte.png" alt="Zrzut ekranu z audytem czasów odpowiedzi serwera Lighthouse jest niski (TTFB)"></figure>

## Długie czasy odpowiedzi serwera wpływają na wydajność

Ten audyt kończy się niepowodzeniem, gdy przeglądarka czeka dłużej niż 600 ms na odpowiedź serwera na żądanie głównego dokumentu. Użytkownicy nie lubią, gdy strony ładują się długo. Długie czasy odpowiedzi serwera są jedną z możliwych przyczyn długich ładowań stron.

Gdy użytkownicy przechodzą do adresu URL w przeglądarce internetowej, przeglądarka wysyła żądanie sieciowe w celu pobrania tej zawartości. Twój serwer odbiera żądanie i zwraca zawartość strony.

Serwer może wymagać dużo pracy, aby zwrócić stronę z całą treścią, której potrzebują użytkownicy. Na przykład, jeśli użytkownicy przeglądają swoją historię zamówień, serwer musi pobrać historię każdego użytkownika z bazy danych, a następnie wstawić tę zawartość na stronę.

Optymalizacja serwera, aby działał w ten sposób tak szybko, jak to możliwe, to jeden ze sposobów na skrócenie czasu, jaki użytkownicy spędzają na oczekiwaniu na załadowanie stron.

## Jak poprawić czasy odpowiedzi serwera

Pierwszym krokiem do skrócenia czasu odpowiedzi serwera jest zidentyfikowanie podstawowych zadań koncepcyjnych, które serwer musi wykonać, aby zwrócić zawartość strony, a następnie zmierzenie czasu trwania każdego z tych zadań. Po zidentyfikowaniu najdłuższych zadań poszukaj sposobów na ich przyspieszenie.

Istnieje wiele możliwych przyczyn powolnych odpowiedzi serwera, a zatem wiele sposobów na poprawę:

- Zoptymalizuj logikę aplikacji serwera, aby szybciej przygotowywać strony. Jeśli używasz struktury serwera, struktura może zawierać zalecenia, jak to zrobić.
- Zoptymalizuj sposób, w jaki serwer wysyła zapytania do baz danych lub dokonaj migracji do szybszych systemów baz danych.
- Zaktualizuj swój sprzęt serwerowy, aby mieć więcej pamięci lub procesora.

## Zasoby

- [Kod źródłowy audytu **Reduce Server Response Times (TTFB)**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/server-response-time.js)
- [Adaptacyjne serwowanie z Network Information API](/adaptive-serving-based-on-network-quality)
