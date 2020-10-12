---
layout: post
title: Wyeliminuj zasoby blokujące renderowanie
description: Dowiedz się o audycie zasobów blokujących renderowanie.
date: 2019-05-02
updated: 2020-08-11
web_lighthouse:
- zasoby blokujące renderowanie
---

Sekcja Możliwości w raporcie Lighthouse zawiera listę wszystkich adresów URL blokujących pierwsze malowanie strony. Celem jest zmniejszenie wpływu adresów URL blokujących renderowanie poprzez wstawianie krytycznych zasobów, odraczanie niekrytycznych zasobów i usuwanie wszystkiego, co nie jest używane.

<figure class="w-figure"><img class="w-screenshot" src="blocking-resources.png" alt="Zrzut ekranu z latarni morskiej Eliminacja audytu zasobów blokujących renderowanie"></figure>

## Które adresy URL są oznaczane jako zasoby blokujące renderowanie?

[Lighthouse oznacza](https://developers.google.com/web/tools/lighthouse/) dwa typy adresów URL blokujących renderowanie: skrypty i arkusze stylów.

Tag `<script>` który:

- Znajduje się w `<head>` dokumentu.
- Nie ma atrybutu `defer` .
- Nie ma atrybutu `async` .

Znacznik `<link rel="stylesheet">` który:

- Nie ma `disabled` atrybutu. Gdy ten atrybut jest obecny, przeglądarka nie pobiera arkusza stylów.
- Nie ma atrybutu `media` który pasuje do urządzenia użytkownika.

## Jak zidentyfikować krytyczne zasoby

Pierwszym krokiem do zmniejszenia wpływu zasobów blokujących renderowanie jest określenie, co jest krytyczne, a co nie. Użyj [karty Pokrycie](https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage) w Chrome DevTools, aby zidentyfikować niekrytyczne CSS i JS. Kiedy ładujesz lub uruchamiasz stronę, karta pokazuje, ile kodu zostało użyte, a ile zostało załadowane:

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="coverage.png" alt="Chrome DevTools: karta Pokrycie"><figcaption class="w-figcaption">Chrome DevTools: karta Pokrycie.</figcaption></figure>

Możesz zmniejszyć rozmiar swoich stron, wysyłając tylko kod i style, których potrzebujesz. Kliknij adres URL, aby sprawdzić ten plik w panelu Źródła. Style w plikach CSS i kod w plikach JavaScript są zaznaczone dwoma kolorami:

- **Zielony (krytyczny):** style wymagane do pierwszego malowania; kod, który ma kluczowe znaczenie dla podstawowych funkcji strony.
- **Czerwony (niekrytyczny):** style, które dotyczą treści, nie są od razu widoczne; kod nie jest używany w podstawowej funkcjonalności strony.

## Jak wyeliminować skrypty blokujące renderowanie

Po zidentyfikowaniu krytycznego kodu przenieś go z adresu URL blokującego renderowanie do wbudowanego tagu `script` na stronie HTML. Po załadowaniu strona będzie miała wszystko, czego potrzebuje, aby obsługiwać podstawowe funkcje strony.

Jeśli w adresie URL blokującym renderowanie znajduje się kod, który nie jest krytyczny, możesz zachować go w adresie URL, a następnie oznaczyć adres URL atrybutami `async` lub `defer` (zobacz także [Dodawanie interakcji z JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript) ).

Kod, który w ogóle nie jest używany, należy usunąć (zobacz [Usuwanie nieużywanego kodu](/remove-unused-code) ).

## Jak wyeliminować arkusze stylów blokujące renderowanie

Podobny do inline kodu w `<script>` tagu, style inline krytyczne wymagane do pierwszej farby wewnątrz `<style>` bloku w `head` strony HTML. Następnie wczytaj pozostałe style asynchronicznie, korzystając z łącza `preload` ładowania (zobacz [Odraczanie nieużywanego CSS](/defer-non-critical-css) ).

Rozważ zautomatyzowanie procesu wyodrębniania i wstawiania CSS „Above the Fold” za pomocą [narzędzia Critical](https://github.com/addyosmani/critical/blob/master/README.md) .

Innym podejściem do wyeliminowania stylów blokujących renderowanie jest podzielenie tych stylów na różne pliki, uporządkowane według zapytań o media. Następnie dodaj atrybut media do każdego łącza arkusza stylów. Podczas ładowania strony przeglądarka blokuje tylko pierwsze malowanie, aby pobrać arkusze stylów pasujące do urządzenia użytkownika (zobacz [CSS blokujący renderowanie](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css) ).

Na koniec będziesz chciał zminimalizować swój CSS, aby usunąć wszelkie dodatkowe białe znaki lub znaki (zobacz [Minify CSS](/minify-css) ). Gwarantuje to, że wysyłasz do użytkowników możliwie najmniejszy pakiet.

## Zasoby

- [Kod źródłowy dla audytu **eliminacji zasobów blokujących renderowanie**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/render-blocking-resources.js)
- [Zmniejsz liczbę ładunków JavaScript dzięki dzieleniu kodu](/reduce-javascript-payloads-with-code-splitting)
- [Usuń nieużywany kod codelab](/codelab-remove-unused-code)
- [Optymalizacja uruchamiania JavaScript](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/)
