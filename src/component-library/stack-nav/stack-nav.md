The active state will only
show if the correct `aria-current="page"` attribute is set on the `<a>`
elements.

You can add a meta element (`.stack-nav__meta`) which will display as a smaller,
monospaced element. It's recommended that you use the
[cluster](/design-system/css-compositions/#cluster) layout composition to group
this with the main text element if used as a prefix.

You can also add an SVG and in this situation, apply a `.repel` class, which
will then use the [repel](/design-system/css-compositions/#repel) layout
composition to push the icon and text away from each other.

You can apply `.stack-nav` directly to a list (`<ol>/<ul>`) or as a parent
class. If you use the parent class, be sure to apply `.stack-nav__list` to
activate reset styles. This is the recommended pattern for
[headed/nested](<#headed-(nested)>) contexts.
