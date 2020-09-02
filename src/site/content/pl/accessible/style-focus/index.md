---
layout: post
title: Koncentracja na stylu
authors:
- robdodson
date: 2018-11-18
description: Wskaźnik ostrości (często oznaczony „pierścieniem ostrości”) identyfikuje aktualnie ustawiony element. Dla użytkowników, którzy nie są w stanie korzystać z myszy, ten wskaźnik jest niezwykle ważny, ponieważ działa on jako stand-in dla ich wskaźnika myszy.
translation_type: machine
---

Wskaźnik ostrości (często oznaczony „pierścieniem ostrości”) identyfikuje aktualnie zaznaczony element na stronie. Dla użytkowników, którzy nie są w stanie korzystać z myszy, ten wskaźnik jest *niezwykle ważny,* ponieważ działa on jako przestój dla wskaźnika myszy.

Jeśli domyślny wskaźnik aktywności przeglądarki koliduje z twoim projektem, możesz użyć CSS do zmiany stylu. Pamiętaj tylko, aby pamiętać o użytkownikach klawiatury!

## Użyj `:focus` aby zawsze pokazywać wskaźnik ostrości

Pseudoklasa [`:focus`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus) jest stosowana za każdym razem, gdy element jest skupiony, niezależnie od urządzenia wejściowego (mysz, klawiatura, rysik itp.) Lub metody użytej do jego skupienia. Na przykład `<div>` poniżej ma `tabindex` który umożliwia ustawianie ostrości. Ma również własny styl dla `:focus` stanu `:focus` :

```css
div[tabindex="0"]:focus {
  outline: 4px dashed orange;
}
```

Niezależnie od tego, czy używasz myszy, aby kliknąć na nim, czy klawiatury, aby przejść do niego, `<div>` *zawsze* będzie wyglądał tak samo.

{% Glitch { id: 'focus-style', path: 'index.html', height: 346 } %}

Niestety przeglądarki mogą być niespójne ze sposobem, w jaki stosują fokus. To, czy element zostanie ustawiony, może zależeć od przeglądarki i systemu operacyjnego.

Na przykład `<button>` poniżej ma również własny styl dla swojego `:focus` stanu `:focus` .

```css
button:focus {
  outline: 4px dashed orange;
}
```

Jeśli klikniesz `<button>` myszą w Chrome na macOS, powinieneś zobaczyć jego własny styl fokusu. Nie zobaczysz jednak niestandardowego stylu fokusa, jeśli klikniesz `<button>` w przeglądarce Firefox lub Safari w systemie macOS. Wynika to z faktu, że w Firefox i Safari element nie jest aktywowany po kliknięciu.

{% Glitch {id: 'focus-style2', path: 'index.html', height: 346}%}

{% Aside %} Patrz [odniesienie do MDN dla zachowania skupienia `<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus) aby uzyskać podsumowanie, które przeglądarki i systemy operacyjne zastosują skupienie na elementach `<button>` . {% endAside %}

Ponieważ zachowanie fokusa jest niespójne, może wymagać nieco przetestowania na różnych urządzeniach, aby upewnić się, że style fokusu są akceptowalne dla użytkowników.

## Użyj `:focus-visible` aby selektywnie pokazywać wskaźnik ostrości

Nowa pseudoklasa [`:focus-visible`](%5Bhttps://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible%5D(https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)) jest stosowana za każdym razem, gdy element otrzymuje fokus, a przeglądarka określa za pomocą heurystyki, że wyświetlanie wskaźnika fokusu byłoby korzystne dla użytkownika. W szczególności, jeśli ostatnia interakcja użytkownika odbywała się za pomocą klawiatury, a naciśnięcie klawisza nie zawierało klawisza meta, `ALT` / `OPTION` lub `CONTROL` , wówczas `:focus-visible` będzie pasować.

{% Aside %} `:focus-visible` jest obecnie obsługiwany tylko w Chrome za flagą, ale istnieje [lekka wypełnienie,](https://github.com/WICG/focus-visible) które można dodać do aplikacji, aby działało. {% endAside %}

Przycisk w poniższym przykładzie *selektywnie* pokazuje wskaźnik ostrości. Jeśli klikniesz go myszą, wyniki będą inne niż po pierwszym naciśnięciu klawisza, aby przejść do niego tabulatorem.

```css
button:focus-visible {
  outline: 4px dashed orange;
}
```

{% Glitch {id: 'focus-visible-style', path: 'index.html', height: 346}%}

## Użyj `:focus-within` aby stylizować element nadrzędny skupionego elementu

Pseudo-klasa [`:focus-within`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within) Within jest stosowana do elementu, gdy element sam się fokusuje lub gdy inny element w tym elemencie otrzymuje fokus.

Można go użyć do podświetlenia regionu strony, aby zwrócić uwagę użytkownika na ten obszar. Na przykład poniższy formularz otrzymuje fokus zarówno po wybraniu samego formularza, jak i po wybraniu dowolnego z jego przycisków opcji.

```css
form:focus-within {
  background: #ffecb3;
}
```

{% Glitch {id: 'focus-within-style', path: 'index.html', height: 346}%}

## Kiedy wyświetlać wskaźnik ostrości

Dobrą zasadą jest zadać sobie pytanie: „Czy kliknięcie tego elementu sterującego podczas korzystania z urządzenia mobilnego wymagałoby wyświetlenia klawiatury?”

Jeśli odpowiedź brzmi „tak”, wówczas kontrolka powinna *zawsze* pokazywać wskaźnik ostrości, niezależnie od urządzenia wejściowego używanego do ustawiania ostrości. Dobrym przykładem jest element `<input type="text">` . Użytkownik będzie musiał wysłać dane wejściowe do elementu za pomocą klawiatury, niezależnie od tego, w jaki sposób element wejściowy pierwotnie otrzymał fokus, dlatego pomocne jest zawsze wyświetlanie wskaźnika fokusa.

Jeśli odpowiedź brzmi „nie”, układ sterowania może wybrać selektywne pokazywanie wskaźnika ostrości. Dobrym przykładem jest element `<button>` . Jeśli użytkownik kliknie go myszką lub ekranem dotykowym, akcja jest zakończona i wskaźnik ostrości może nie być konieczny. Jeśli jednak użytkownik *nawiguje* za pomocą klawiatury, przydatne jest wyświetlenie wskaźnika aktywności, aby użytkownik mógł zdecydować, czy chce kliknąć kontrolkę za pomocą klawiszy `ENTER` lub `SPACE` .

## Unikaj `outline: none`

Sposób, w jaki przeglądarki decydują, kiedy narysować wskaźnik aktywności, jest, szczerze mówiąc, bardzo zagmatwany. Zmiana wyglądu elementu `<button>` pomocą CSS lub nadanie elementowi `tabindex` spowoduje uruchomienie domyślnego działania pierścienia ostrości w przeglądarce.

Bardzo częstym anty-wzorem jest usunięcie wskaźnika ostrości za pomocą CSS, takiego jak:

```css
/* Don't do this!!! */
:focus {
  outline: none;
}
```

Lepszym sposobem obejścia tego problemu jest użycie kombinacji `:focus` i `:focus-visible` polyfill z `:focus-visible` focus. Pierwszy blok kodu poniżej pokazuje, jak działa wypełnienie, a przykładowa aplikacja pod nim przedstawia przykład użycia wypełnienia do zmiany wskaźnika skupienia na przycisku.

```css
/*
  This will hide the focus indicator if the element receives focus via the
  mouse, but it will still show up on keyboard focus.
*/
.js-focus-visible :focus:not(.focus-visible) {
  outline: none;
}

/*
  Optionally: Define a strong focus indicator for keyboard focus.
  If you choose to skip this step, then the browser's default focus
  indicator will be displayed instead.
*/
.js-focus-visible .focus-visible {
  …
}
```

{% Glitch {id: 'focus-visible', path: 'index.html', height: 346}%}
