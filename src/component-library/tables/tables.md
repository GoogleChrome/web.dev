Use HTML markup for tables. Do _not_ use Markdown syntax. It is also
recommended that you use the `table-wrapper` and `scrollbar` classes to
provide a good user experience for smaller viewports.

If you want content in `<td>` elements to be vertically aligned to the top of
the cell, add the `[data-align="top"]` [exception](https://cube.fyi/exception) to the `<table>` element. You can also
add `[data-align="baseline"]` for baseline alignment. The default alignment
is center and bottom alignment isn't available because it provides a poor
reading experience.
