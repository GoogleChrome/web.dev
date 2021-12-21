To change the active color, set a Custom Property value for
`--tabs-active-color` and it will override the default, which is
the primary color.

It’s also recommended that panels passed into `<web-tabs>` have padding—
using `pad-inline-size-1`, for example—to make them render nicely where
JavaScript isn’t available and also, prevents us having to add unnecessary
spacing in the `_web-tab.scss` component styles.
