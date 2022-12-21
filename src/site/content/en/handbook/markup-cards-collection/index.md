---
layout: handbook
title: Sample cards on the collection page
date: 2019-06-26
description: |
  A sample usage of cards on the collection page for web.dev
---

The content and layout of cards are flexible, the content creator can change the content and adjust the design, and position of a card by using YAML properties.

The collection of cards offers a grid-based layout system, with rows and columns. The content creator can adjust the position card by specifying the card layout, vertical and horizontal, to avoid the unwanted gap. However, the rendering of a grid-based layout could create some gaps if we do not determine the column and row.

See [the sample collection of cards](/example-collection/) post.

YAML properties available for displying a layout of cards on collection template:
- `title` - the title of the card.
- `description` - the description of the card.
- `thumbnail` - the thumbnail of the card.
- `eyebrow` - useful for introducing the type of card. This eyebrow shows above the title.
  - `icon` - the SVG icon name, e.g. `icon: news`.
  - `text` - a text next to the icon, e.g. `text: What's new`.
- `cardLayout` - vertical and horizontal are available for specify the layout of card. No value specific for default card layout
- `theme` - applying background color to the card, e.g. `theme: quaternary`.
  Theme colours available - tertiary, quaternary, pink, dark, and blue.
- `column` - determine the column of displaying this card
- `row` - determine the row of displaying this card
- `url` - target URL of the card
- `blogUrl` - Blog post URL. The usage of this card type will decribe in this document.
- `featuredCollection` - Tag name for displaying featured post in the specify blog post tag. The usage of this card type will decribe in this document.

## Card Types 

### Adding default card

This type of card needs to specific `title`, `description`, and `thumbnail` YAML properties to display the content of the card.

{% raw %}
```
---
…
cards:
  - title: 'The CSS Podcast: Media query range syntax'
    description: Praesent accumsan eros orci quis congue metus porta a sed dapibus magna.
    thumbnail: image/SZHNhsfjU9RbCestTGZU6N7JEWs1/VwL892KEz6bakZMlq10D.png
    eyebrow:
      icon: podcast
      text: Podcast
    cardLayout: 'horizontal'
    theme: 'tertiary'
    column: '2'
    url: /podcasts/
… 
--- 
```
{% endraw %}

### Adding feature post card

This card will represent a featured post in specific tag, so the title, thumbnail, etc, will autometically pulled from a real blog post, no need to specify title, description, thumbnail.

{% raw %}
```
---
…
cards:
  - featuredCollection: 'animations' 
    eyebrow:
      icon: featured
      text: Featured
    cardLayout: 'vertical'
… 
--- 
```
{% endraw %}

### Adding specify post card

This card will represent a blog post, so the title, thumbnail, etc, will autometically pulled from a real blog post, no need to specify title, description, thumbnail.

{% raw %}
```
---
…
cards:
  - blogUrl: /terra-dark-mode/
    eyebrow:
      icon: blog
      text: Blog
    cardLayout: 'vertical'
    column: '3'
…  
---
```
{% endraw %}


## Card Layouts 

No need to add `cardLayout` property for a default card layout.

### Adding default card layout
{% raw %}
```
---
…
cards:
  - title: Meet the Chrome team
    description: We're meeting you where you are. Join us at upcoming web conferences in your region or catch up on past events.
    eyebrow:
      icon: event
      text: Event
    url: /meet-the-team
…
---
```
{% endraw %}

### Adding vertical card layout

This type of card will consume two rows of the grid system. Since the rendering of a grid-based layout could create some gaps if we do not determine the column and row. For a vertical card layout, you can determind row and column to specific the position using YAML property `row` and `column`.

{% raw %}
```
---
…
cards:
  - title: Meet the Chrome team
    description: We're meeting you where you are. Join us at upcoming web conferences in your region or catch up on past events.
    thumbnail: image/SZHNhsfjU9RbCestTGZU6N7JEWs1/VwL892KEz6bakZMlq10D.png
    eyebrow:
      icon: event
      text: Event
    url: /meet-the-team
    cardLayout: 'vertical'
    column: '3'
    row: '2'
…
---
```
{% endraw %}

### Adding horizontal card layout

This type of card will consume two columns of the grid system. Since the rendering of a grid-based layout could create some gaps if we do not determine the column and row. For a horizontal card layout, you can determine the start column of displaying this card using YAML property `column`

{% raw %}
```
---
…
cards:
  - title: Meet the Chrome team
    description: We're meeting you where you are. Join us at upcoming web conferences in your region or catch up on past events.
    thumbnail: image/SZHNhsfjU9RbCestTGZU6N7JEWs1/VwL892KEz6bakZMlq10D.png
    eyebrow:
      icon: event
      text: Event
    url: /meet-the-team
    cardLayout: 'horizontal'
    column: '2'
…
---
```
{% endraw %}
