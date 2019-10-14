# Styles

## Structure

The styles for this project attempt to (loosely) follow an ITCSS model.
Learn more @ [https://speakerdeck.com/dafed/managing-css-projects-with-itcss](https://speakerdeck.com/dafed/managing-css-projects-with-itcss)

- settings: Global variables
- tools: Mixins and functions
- generic: Ground-zero styles and unclassed HTML elements (type selectors)
- components: Chunks of UI
- pages: Page-specific styles (use sparingly if at all)
- overrides: Utility classes for things like text alignment, box shadows, etc.
- devsite: DevSite specific styles we use to replicate their live environment.
  There's a file called _veto.scss which we use to nullify some of their styles.

## Rules

- Use [hyphenated BEM style](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/).
- Prefix classes with `w-` which stands for 'web'. This helps us namespace our
  CSS so we don't conflict with DevSite.
- Only nest 2 levels deep.
- Add a comment, `// DevSite override`, to any CSS that's used to override a
  DevSite style. Add the comment on the same line as the style.

  ```scss
  color: pink; // DevSite override
  ```

## Linting

We use [sass-lint](https://github.com/sasstools/sass-lint) to match Google's
internal SCSS style guide.

If you need to disable a rule you'll need to do it for both sass-lint and
scss-lint which Google uses internally. We don't use scss-lint because it's
[deprecated](https://github.com/brigade/scss-lint#notice-consider-other-tools-before-adopting-scss-lint).

```scss
// sass-lint:disable-all
// scss-lint:disable all
gap: 16px;
grid-gap: 16px;
// scss-lint:enable all
// sass-lint:enable-all
```

Some rules, like `indentation` are stricter in sass-lint then they are in
scss-lint. It's ok to disable overly strict sass-lint rules if scss-lint isn't
complaining. This is especially useful for formatting box-shadow properties.

- [sass-lint rules quick reference](https://github.com/sasstools/sass-lint/tree/master/docs/rules).

## Tips

- To preview your SASS you can use [Sassmeister](https://www.sassmeister.com/) 👍