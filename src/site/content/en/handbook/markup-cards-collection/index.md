---
layout: handbook
title: Homepage and collection cards
date: 2023-01-06
description: |
  How to add cards to the homepage and collection page.
---

The homepage themes section, and at the bottom of an collection page (linked from [/explore](/explore)) can take a grid layout of cards to highlight the latest, or particularly relevant, content.

The content and layout of cards are flexible, you can change the content, and adjust the design and position of a card by using YAML properties.

The collection of cards offers a grid-based layout system, with rows and columns. Adjust the position card by specifying the card layout, vertical and horizontal, to avoid unwanted gaps. 

See [the sample collection of cards](/handbook/content-types/example-collection/) post for an example of adding the cards to a collection page. Cards are already in place on the homepage, you can change the cards in your section, and add new rows of cards.

YAML properties available for displaying a layout of cards:

- `title` - the title of the card.
- `description` - the description of the card.
- `thumbnail` - the thumbnail of the card.
- `latestPostByTags` - display the latest post from specific tags.
- `url` - target URL of the card.
- `eyebrow` - useful for introducing the type of card. This eyebrow shows above the title.
  - `icon` - the SVG icon name, for example. `icon: featured`.
  - `text` - a text next to the icon, e.g. `text: Featured`.
- `cardLayout` - vertical and horizontal are available for specify the layout of card. No value specific for default card layout.
- `theme` - applying background color to the card, e.g. `theme: quaternary`.
  Theme colours available - tertiary, quaternary, pink, dark, and blue.
- `column` - determine the column of displaying this card.
- `row` - determine the row of displaying this card.

### Icons

<table>
  <tr>
    <th>Icon name</th>
    <th>Use for</th>
  </tr>
  <tr>
    <td>mortarboard</td>
    <td>Learn courses or individual modules.</td>
  </tr>
  <tr>
    <td>blog</td>
    <td>Blog posts.</td>
  </tr>
  <tr>
    <td>podcast</td>
    <td>Podcasts or episodes.</td>
  </tr>
  <tr>
    <td>pattern</td>
    <td>Pattern collections or individual patterns.</td>
  </tr>
  <tr>
    <td>news</td>
    <td>News items, newly interoperable posts.</td>
  </tr>
  <tr>
    <td>featured</td>
    <td>A star, anything you want to highlight.</td>
  </tr>
</table>

## Card Types 

### A default card

This type of card requires a `title` and `description` YAML properties to display the content of the card. The `url` property is needed to link to another page.


{% raw %}
```yaml
---
cards:
  - title: 'Meet the Chrome team'
    description: 'We are meeting you where you are. Join us at upcoming web conferences in your region or catch up on past events.'
    eyebrow:
      icon: 'event'
      text: 'Event'
    url: /meet-the-team
---
```
{% endraw %}

### Linking to a post on web.dev

When linking to a post on web.dev, the title, description, and image can be pulled from the post specified by the `url`:

{% raw %}
```yaml
---
cards:
  - url: /my-post/
    eyebrow:
      icon: 'blog'
      text: 'Blog'
---
```
{% endraw %}

### Displaying latest post from specific tags

For displaying the recent post from specific tags, set the value of the frontmatter key `isLatestPost` to `true` and set the list of `tags` to display a latest post from specific tags. The title, description, and image can be automatically pulled from the post. 

{% raw %}
```yaml
---
cards:
  - latestPostByTags:
      - css
      - dom
      - ux
    cardLayout: 'vertical'
---
```
{% endraw %}

### Adding a vertical card

This type of card will consume two rows of the grid system. You can set the row and column of the grid using the YAML properties `row` and `column`. The following card will display in the third column of the grid, cover two rows (with the image in the first row and content the second), and is pulling information from the blog post found at `https://web.dev/terra-dark-mode`.

{% raw %}
```yaml
---
cards:
  - url: /terra-dark-mode/
    eyebrow:
      icon: 'blog'
      text: 'Blog'
    cardLayout: 'vertical'
    column: '3'
---
```
{% endraw %}

### Adding a horizontal card

The horizontal card covers two columns, with the image in one column and content in the second. The following example shows a card that will display in colun2 and 3, and row 2, pulling information from the blog post found at `https://web.dev/terra-dark-mode`, and with an image specified which will override the default image for that post.

{% raw %}
```yaml
---
cards:
  - url: /terra-dark-mode/
    thumbnail: 'image/SZHNhsfjU9RbCestTGZU6N7JEWs1/VwL892KEz6bakZMlq10D.png'
    eyebrow:
      icon: 'featured'
      text: 'Featured'
    cardLayout: 'horizontal'
    column: '2'
    row: '2'
---
```
{% endraw %}

See the web.dev homepage for many more examples of cards.
