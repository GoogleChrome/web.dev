---
layout: Poczta
title: Kontroluj fokus za pomocą tabindex
authors:
- robdodson
date: 2018-11-18
description: Natywne elementy HTML, takie jak <button> lub <input>, mają wbudowaną dostępność klawiatury za darmo. Jeśli budujesz niestandardowe interaktywne komponenty, użyj tabindex, aby upewnić się, że są one dostępne z klawiatury.
---

Native HTML elements such as `<button>` or `<input>` have keyboard accessibility built in for free. If you're building *custom* interactive components, however, use the `tabindex` attribute to ensure that they're keyboard accessible.

{% Aside%} Jeśli to możliwe, używaj natywnego elementu HTML zamiast budować własną wersję niestandardową. `<button>` jest bardzo łatwy do stylizacji i ma już pełną obsługę klawiatury. Dzięki temu nie będziesz musiał zarządzać `tabindex` ani dodawać semantyki za pomocą ARIA. {% endAside%}

## Sprawdź, czy kontrolki są dostępne z klawiatury

Narzędzie takie jak Latarnia morska świetnie wykrywa niektóre problemy z dostępnością, ale niektóre rzeczy może przetestować tylko człowiek.

Spróbuj nacisnąć klawisz `Tab` , aby poruszać się po witrynie. Czy jesteś w stanie uzyskać dostęp do wszystkich interaktywnych elementów sterujących na stronie? Jeśli nie, może być konieczne użycie [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) aby poprawić ostrość tych elementów sterujących.

{% Na bok „ostrzeżenie”%} Jeśli w ogóle nie widzisz wskaźnika aktywności, może być ukryty przez twój CSS. Poszukaj stylów, które wspominają `:focus { outline: none; }` . Możesz dowiedzieć się, jak to naprawić w naszym przewodniku na temat [stylizacji](/style-focus) . {% endAside%}

## Wstaw element w kolejności tabulatorów

Wstaw element do naturalnej kolejności tabulatorów, używając `tabindex="0"` . Na przykład:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

Aby skupić element, naciśnij klawisz `Tab` lub wywołaj metodę `focus()` elementu.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/tabindex-zero?path=index.html&previewSize=100&attributionHidden=true" alt="tabindex-zero on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Usuń element z kolejności kart

Usuń element za pomocą `tabindex="-1"` . Na przykład:

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

Spowoduje to usunięcie elementu z naturalnej kolejności tabulatorów, ale element można nadal ustawić, wywołując metodę `focus()` .

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/tabindex-negative-one?path=index.html&previewSize=100&attributionHidden=true" alt="tabindex-negative-one on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Zauważ, że zastosowanie `tabindex="-1"` do elementu nie wpływa na jego elementy potomne; jeśli są naturalnie w kolejności tabulatorów lub z powodu wartości `tabindex` , pozostaną w kolejności tabulatorów. Aby usunąć element i wszystkie jego elementy potomne z kolejności zakładek, rozważ użycie [`inert` wypełnienia WICG](https://github.com/WICG/inert) . Wielokrotne wypełnienie naśladuje zachowanie proponowanego atrybutu `inert` , co zapobiega wybieraniu lub odczytywaniu elementów przez technologie wspomagające.

{% Poza „ostrożnie”%} odpowiednią `inert` PolyFill eksperymentalna i może nie działać prawidłowo we wszystkich przypadkach. Przetestuj dokładnie przed użyciem w produkcji. {% endAside%}

## Unikaj `tabindex > 0`

Każdy `tabindex` większy niż 0 przeskakuje element na przód naturalnej kolejności tabulatorów. Jeśli istnieje wiele elementów z `tabindex` większym niż 0, kolejność tabulatorów zaczyna się od najniższej wartości większej od zera i przesuwa się w górę.

Użycie `tabindex` większego niż 0 jest uważane za **anty-wzorzec,** ponieważ czytniki ekranu poruszają się po stronie w kolejności DOM, a nie w kolejności tabulatorów. Jeśli potrzebujesz elementu, aby pojawił się wcześniej w kolejności tabulatorów, należy go przenieść na wcześniejsze miejsce w DOM.

Latarnia ułatwia identyfikację elementów za pomocą `tabindex` > 0. Uruchom Audyt dostępności (Latarnia morska> Opcje> Dostępność) i poszukaj wyników audytu „Żaden element nie ma wartości [tabindex] większej niż 0”.

## Twórz dostępne komponenty za pomocą „ `tabindex` wędrującego”

W przypadku budowania złożonego komponentu może być konieczne dodanie dodatkowej obsługi klawiatury, która nie jest aktywna. Rozważ natywny element `select` . Można go ustawiać i za pomocą klawiszy strzałek można wyświetlić dodatkowe funkcje (opcje do wyboru).

Aby zaimplementować podobną funkcjonalność we własnych komponentach, użyj techniki znanej jako „wędrujący `tabindex` ”. Ruchomy tabindex działa, ustawiając `tabindex` na -1 dla wszystkich dzieci z wyjątkiem aktualnie aktywnego. Następnie komponent używa detektora zdarzeń klawiatury, aby ustalić, który klawisz został naciśnięty przez użytkownika.

Kiedy tak się dzieje, komponent ustawia `tabindex` poprzednio skupionego dziecka na -1, ustawia `tabindex` podrzędnego dziecka na 0 i wywołuje na nim metodę `focus()` .

**Przed**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="0">Redo</div>
  <button tabindex="-1">Cut</div>
</div>
```

**Po**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="-1">Redo</div>
  <button tabindex="0">Cut</div>
</div>
```

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/roving-tabindex?path=index.html&previewSize=100&attributionHidden=true" alt="tabindex-negative-one on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside%} Ciekawe, do czego służą te atrybuty `role=""` ? Pozwalają na zmianę semantyki elementu, dzięki czemu zostanie poprawnie ogłoszony przez czytnik ekranu. Możesz dowiedzieć się więcej o nich w naszym przewodniku na temat [podstaw czytnika ekranu](/semantics-and-screen-readers) . {% endAside%}

{% AssessmentCallout „Użyj listy rozwijanej poniżej każdej próbki kodu, aby sprawdzić swoje zrozumienie kolejności kart”. %} {% Tabs 'Próbki do samokontroli wiedzy'%} {% Tab 'sample'%}

Ten HTML renderuje modalne okno dialogowe:

```html
<div role="dialog" aria-labelledby="dialog-header">
  <button aria-label="Close"></button>
  <h2 id="dialog-header">
    Do you want to allow notifications from this website?
  </h2>
  <button>No</button>
  <button>Yes</button>
</div>
```

{% AssessmentHint „Jaka jest kolejność tabulatorów dla elementów w próbce?” %}

1. Przycisk **Zamknij**
2. Przycisk **Nie**
3. Przycisk **Tak**

Tylko elementy `<button>` są uwzględnione w kolejności tabulatorów, ponieważ są to jedyne rodzime elementy formularza HTML. Aby wstawić inne elementy w kolejności tabulatorów, należy dodać atrybut `tabindex` . {% endAssessmentHint%}

{% endTab%} {% Tab „sample”%}

```html
<section tabindex="-1">
  <h2>Cat facts</h2>
  <ul>
    <li>A group of cats is called a <a href="https://m-w.com/dictionary/clowder">clowder</a>.</li>
    <li>Most cats are <a href="https://www.catfacts.org/catnip.html"> unaffected by catnip</a>.</li>
  </ul>
</section>
```

{% AssessmentHint „Które elementy z próbki są uwzględnione w kolejności zakładek?” %} Tylko elementy `<a>` są uwzględnione w kolejności tabulatorów.

Element `<section>` nie znajduje się w kolejności tabulatorów, ponieważ ma ujemną wartość `tabindex` . (Można go jednak ustawić za pomocą metody `focus()` .) Wartość `tabindex` dla elementu `<section>` nie wpływa na jego elementy potomne. {% endAssessmentHint%}

{% endTab%} {% Tab „sample”%}

Ten kod HTML wyświetla menu podręczne, po którym następuje wyszukiwanie:

```html
<div role="menu" tabindex="0">
  <a role="menuitem" href="/learn/" tabindex="-1">Learn</a>
  <a role="menuitem" href="/measure/" tabindex="-1">Measure</a>
  <a role="menuitem" href="/blog/" tabindex="-1">Blog</a>
  <a role="menuitem" href="/about/" tabindex="-1">About</a>
</div>
<input tabindex="1" type="text" role="search" aria-label="Search" placeholder="Search">
```

{% AssessmentHint „Który element w próbie jest pierwszy w kolejności zakładek?” %} **Wyszukiwanie** tekstowe jest pierwsze w kolejności tabulatorów. Ponieważ ma `tabindex` większy niż 1, przeskakuje na początek kolejności tabulatorów.

(To zachowanie może powodować zamieszanie, jeśli menu zostanie umieszczone na stronie przed danymi wejściowymi do wyszukiwania. Jest to przykład tego, dlaczego wartość `tabindex` większa od zera jest uważana za anty-wzór).

{% endAssessmentHint%}

{% endTab%} {% Tab „sample”%}

Ten HTML renderuje niestandardową grupę radiową, która powinna mieć [`tabindex` wędrujący](#create-accessible-components-with-%22roving-tabindex%22) . (Aby uprościć [`aria-*`](/semantics-and-screen-readers) , na razie zignoruj [atrybuty `aria-*`](/semantics-and-screen-readers) ).

```html
<div role="radiogroup" aria-labelledby="breed-header">
  <h3 id="breed-header">Your cat's breed</h3>
  <div role="radio" aria-checked="false" tabindex="0">Persian</div>
  <div role="radio" aria-checked="false" tabindex="-1">Bengal</div>
  <div role="radio" aria-checked="false" tabindex="-1">Maine Coon</div>
</div>
```

{% AssessmentHint „Gdy skoncentrowany jest element `role="radio"` , co powinno się stać, gdy użytkownik naciśnie klawisz Strzałka w `Right` ?” %}

- Zmień wartości `tabindex` dla wszystkich elementów radiowych w grupie na -1.
- Jeśli po skupionym jest element radiowy, ustaw jego wartość `tabindex` na 0.
- Jeśli po skupionym elemencie nie ma elementu radiowego, ustaw wartość `tabindex` pierwszego elementu radiowego w grupie na 0.
- Skoncentruj element radiowy, który ma teraz `tabindex` 0.

To dużo - i nawet nie zawiera atrybutów ARIA! Jest to przykład tego, dlaczego łatwiej jest używać elementów natywnych z wbudowanym działaniem klawiatury, gdy tylko jest to możliwe. {% endAssessmentHint%}

{% endTab%} {% endTabs%} {% endAssessmentCallout%}

## Przepisy na dostęp do klawiatury

Jeśli nie masz pewności, jakiego poziomu obsługi klawiatury mogą wymagać Twoje niestandardowe komponenty, możesz zapoznać się z [Praktykami autorskimi ARIA 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/) . Ten przydatny przewodnik zawiera listę typowych wzorców interfejsu użytkownika i identyfikuje klucze, które powinny obsługiwać komponenty.
