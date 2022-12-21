---
layout: handbook
title: Add cards to the collection page
date: 2019-06-26
description: |
  A sample usage of cards on the collection page for web.dev
---

The content and layout of cards are flexible, you can change the content, and adjust the design and position of a card by using YAML properties.

The collection of cards offers a grid-based layout system, with rows and columns. The content creator can adjust the position card by specifying the card layout, vertical and horizontal, to avoid unwanted gaps. However, the rendering of a grid-based layout could create some gaps if we do not determine the column and row.

See [the sample collection of cards](/handbook/content-types/example-collection/) post.

YAML properties available for displying a layout of cards on collection template:
- `title` - the title of the card.
- `description` - the description of the card.
- `thumbnail` - the thumbnail of the card.
- `url` - target URL of the card.
- `eyebrow` - useful for introducing the type of card. This eyebrow shows above the title.
  - `icon` - the SVG icon name, e.g. `icon: featured`.
  - `text` - a text next to the icon, e.g. `text: Featured`.
- `cardLayout` - vertical and horizontal are available for specify the layout of card. No value specific for default card layout.
- `theme` - applying background color to the card, e.g. `theme: quaternary`.
  Theme colours available - tertiary, quaternary, pink, dark, and blue.
- `column` - determine the column of displaying this card.
- `row` - determine the row of displaying this card.

## Card Types 

### Adding default card

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

### Adding vertical card

The vertical card represents a blog post, so the title, thumbnail, and description will be automatically pulled from the post specified in the `url`. However, the title, description, and thumbnail are able to be overridden by adding these properties.

This type of card will consume two rows of the grid system. The rendering of a grid-based layout could create some gaps if we do not determine the column and row. For a horizontal card layout, you can determine row and column to specify the position using the YAML property `row` and `column`.

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

### Adding horizontal card

The horizontal card will represent a blog post, so the title, thumbnail, etc, will be automatically pulled from a real blog post, no need to specify the title, description, or thumbnail. However, the title, description, and thumbnail are able to be overridden.

This type of card will consume two columns of the grid system. The rendering of a grid-based layout could create some gaps if we do not determine the column and row. For a horizontal card layout, you can determine row and column to specify the position using the YAML property `row` and `column`.

{% raw %}
```yaml
---
cards:
  - url: /terra-dark-mode/
    thumbnail: 'image/SZHNhsfjU9RbCestTGZU6N7JEWs1/VwL892KEz6bakZMlq10D.png'
    eyebrow:
      icon: 'featured'
      text: 'Featured'
    url: /meet-the-team
    cardLayout: 'horizontal'
    column: '2'
    row: '2'
---
```
{% endraw %}
