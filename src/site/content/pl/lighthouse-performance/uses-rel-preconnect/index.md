---
layout: post
title: Połącz się wstępnie z wymaganymi źródłami
description: Dowiedz się o audycie use-rel-preconnect.
date: '2019-05-02'
updated: '2020-05-06'
web_lighthouse:
  - używa-rel-preconnect
---

Sekcja Możliwości w raporcie Lighthouse zawiera listę wszystkich kluczowych żądań, które nie mają jeszcze priorytetu żądań pobierania z `<link rel=preconnect>` :

<figure class="w-figure"><img class="w-screenshot" src="uses-rel-preconnect.png" alt="Zrzut ekranu Lighthouse Preconnect do wymaganego audytu pochodzenia"></figure>

## Zgodność z przeglądarkami

`<link rel=preconnect>` jest obsługiwany w większości przeglądarek. Zobacz [Zgodność z przeglądarkami](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility) .

## Popraw szybkość ładowania strony dzięki połączeniu wstępnemu

Rozważ dodanie wskazówek dotyczących zasobów `preconnect` lub `dns-prefetch` aby nawiązać wczesne połączenia z ważnymi źródłami zewnętrznymi.

`<link rel="preconnect">` informuje przeglądarkę, że Twoja strona ma zamiar nawiązać połączenie z innym źródłem i że chcesz, aby proces rozpoczął się jak najszybciej.

Nawiązywanie połączeń często zajmuje dużo czasu w powolnych sieciach, szczególnie jeśli chodzi o połączenia bezpieczne, ponieważ może obejmować wyszukiwania DNS, przekierowania i kilka podróży w obie strony do serwera końcowego, który obsługuje żądanie użytkownika.

Zadbanie o to wszystko z wyprzedzeniem może sprawić, że aplikacja będzie znacznie szybsza dla użytkownika, bez negatywnego wpływu na wykorzystanie przepustowości. Większość czasu podczas nawiązywania połączenia spędza na czekaniu, a nie na wymianie danych.

Poinformowanie przeglądarki o swoim zamiarze jest tak proste, jak dodanie tagu linku do swojej strony:

`<link rel="preconnect" href="https://example.com">`

Dzięki temu przeglądarka wie, że strona zamierza połączyć się z `example.com` i pobrać stamtąd zawartość.

Pamiętaj, że chociaż `<link rel="preconnect">` jest dość tani, nadal może pochłaniać cenny czas procesora, szczególnie w przypadku bezpiecznych połączeń. Jest to szczególnie złe, jeśli połączenie nie jest używane w ciągu 10 sekund, ponieważ przeglądarka je zamyka, marnując całą tę wczesną pracę połączenia.

Ogólnie rzecz biorąc, spróbuj użyć `<link rel="preload">` , ponieważ jest to bardziej kompleksowe ulepszenie wydajności, ale zachowaj `<link rel="preconnect">` w pasku narzędzi w przypadkach skrajnych, takich jak:

- [Przykład zastosowania: wiedzieć, skąd, ale nie to, co pobierasz](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [Przykład zastosowania: media strumieniowe](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">` to kolejny typ `<link>` związany z połączeniami. Obsługuje tylko wyszukiwanie DNS, ale ma szerszą obsługę przeglądarki, więc może służyć jako niezła opcja zastępcza. Używasz go dokładnie w ten sam sposób:

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## Zasoby

- [Source code for **Preconnect to required origins** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/uses-rel-preconnect.js)
- [Priorytetyzacja zasobów - uzyskanie pomocy przeglądarki](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [Wcześnie nawiązuj połączenia sieciowe, aby poprawić postrzeganą szybkość strony](/preconnect-and-dns-prefetch/)
- [Typy łączy: połączenie wstępne](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)
