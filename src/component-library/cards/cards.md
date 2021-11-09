The basic card is an `<article>`, which, to make the whole thing clickable, you
add a `.card__action` element. This uses the [breakout
button](https://piccalil.li/tutorial/create-a-semantic-break-out-button-to-make-an-entire-element-clickable/)
technique. The `.card` can also be an `<a>` element, like [this
example](#path-card).

The authors section is a list, even if there's just one author. This
effortlessly expands to multiple that way.

If you want to just display a summary as the content ([see this
example](#with-a-visually-hidden-heading)), it's recommended that you remove
the [flow utility](/design-system/css-utilities/#flow) from `.card__content`
and add the [visually hidden
utility](/design-system/css-utilities/#visually-hidden) to your heading.

### Feature cards

There’s an [example feature card in the variants](#feature-card). More detail
can be found on the [feature card section](/design-system/component/feature-card/).
