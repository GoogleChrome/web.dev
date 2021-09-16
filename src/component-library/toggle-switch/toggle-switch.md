The toggle switch extends a standard checkbox by adding a `switch` role and
switch-like decorative styling.

It's really important that the input (`toggle-switch__input`) sits **before**
the decor (`toggle-switch__decor`) because the Sass block uses [next sibling
combinator selectors]
(https://web.dev/learn/css/selectors/#next-sibling-combinator) to create
visual state changes.

You can visually hide the text label with the `visually-hidden` utility, but
this pattern **must** contain one for accessibility purposes.
