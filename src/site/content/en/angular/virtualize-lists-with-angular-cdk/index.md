---
layout: post
title: Virtualize large lists with the Angular CDK
subhead: Make large lists more responsive by implementing virtual scrolling.
authors:
  - sfluin
date: 2019-07-12
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
hero: image/admin/bGHUmFg8d3zHg6dJ29YT.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
alt: Stacks of vinyl records.
description: |
  Learn how to make large lists more responsive by implementing virtual scrolling with the Angular Component Dev Kit.
tags:
  - angular
  - performance
feedback:
  - api
---

The scrolling list is one of the most common UI patterns today, whether it's browsing an infinitely scrolling feed on your favorite social media site, or navigating an enterprise dashboard. When scrolling lists become very long (hundreds, thousands, or hundreds of thousands of items), application performance can suffer.

Large lists can be slow to load because the application must load and render all the data up front. They can also be slow to render and navigate because each item in the list can have rich data , media, and functionality.

Users can experience problems when they load or scroll the page, leading to frustration and page abandonment.

## Virtual scrolling in Angular with the Component Dev Kit
Virtual scrolling is the primary technique used to address these scale problems. Virtual scrolling gives the impression of a very large list—by providing an appropriately sized scroll bar—and the ability to navigate the list without requiring the application to hold the entire list in memory or render it on the page.

In Angular, virtual scrolling is provided by the [Component Dev Kit (CDK)](https://material.angular.io/cdk/categories). By modifying the way you iterate through lists, and by supplying a couple of additional configuration parameters, the CDK's virtual scrolling will automatically manage the virtual rendering of your lists, improving page performance and responsiveness.

Instead of rendering the entire list at a time, only a subset of the items that fits on the screen (plus a small buffer) will be rendered. As the user navigates, a new subset of items is calculated and rendered, re-using the existing DOM if desired.

The rest of this post walks through how to set up basic virtual scrolling. You can see a full working example in this sample app:

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  {% IFrame {
    src: 'https://stackblitz.com/edit/scroll-list?embed=1&file=src/app/app.component.ts&view=preview'
  } %}
</div>

## Setting up virtual scrolling
First make sure you've installed `@angular/cdk` using your favorite package manager. To install it using npm run this command in the terminal:

```bash
npm install --save @angular/cdk
```

### Add `ScrollingModule` to your app
With the CDK installed, import `ScrollingModule`, which handles virtual scrolling, from the `@angular/cdk/scrolling` package. Then add it to the imports array of your module:

```js
import {ScrollingModule} from '@angular/cdk/scrolling';

...
imports: [
  ScrollingModule
...
]
...
```

### Create a viewport
To see how the package works, try creating a component with a simple list of numbers from 0 to 99,999:

```js
@Component({
  template: `<div *ngFor="let item of list">{% raw %}{{item}}{% endraw %}</div>`
})
export class ScrollComponent {
  list = Array.from({length: 100000}).map((_, i) => i);
}
```

When the browser renders the app, it has to render 100,000 individual `<div>` elements. This might be fine for simple text nodes, but any complexity in the repeated template will not scale well, and any event listeners will be multiplied significantly.

To add virtual scrolling and avoid those problems, you need to create a viewport by wrapping the list in a `<cdk-virtual-scroll-viewport>` element:

```js/1-3
@Component({
  template: `<cdk-virtual-scroll-viewport>
    <div *ngFor="let item of list">{% raw %}{{item}}{% endraw %}</div>
    </cdk-virtual-scroll-viewport>`
})
export class ScrollComponent {
  list = Array.from({length: 100000}).map((_, i) => i);
}
```

Because `ScrollingModule` dynamically renders subsets of the list, you have to specify the height of the viewport via standard CSS. You also need to give the viewport a hint about its content by specifying the `itemSize`. The module uses this information to determine how many items to keep in the DOM at a given time and how to render an appropriately sized scrollbar.

```js/1
@Component({
  template: `<cdk-virtual-scroll-viewport itemSize="18" style="height:80vh">
    <div *ngFor="let item of list">{% raw %}{{item}}{% endraw %}</div>
    </cdk-virtual-scroll-viewport>`
})
export class ScrollComponent {
  list = Array.from({length: 100000}).map((_, i) => i);
}
```

Finally, convert `*ngFor` to `*cdkVirtualFor`:

```js
@Component({
  template: `<cdk-virtual-scroll-viewport itemSize="18" style="height:80vh">
    <div *cdkVirtualFor="let item of list">{% raw %}{{item}}{% endraw %}</div>
    </cdk-virtual-scroll-viewport>`
})
export class ScrollComponent {
  list = Array.from({length: 100000}).map((_, i) => i);
}
```

 Instead of iterating through the entire list, the viewport will dynamically identify and iterate through the correct subset of the list for the user. Now when the user loads the page, the CDK should render the subset of the list that fits on the screen (plus a bit of buffer), and any scrolling events in the viewport will load and render the appropriate subset of the list:

<figure>
  <video autoplay loop muted playsinline>
    <source src="./render-subset.webm" type="video/webm">
    <source src="./render-subset.mp4" type="video/mp4">
  </video>
  <figcaption>
    The CDK rendering subsets of a list as the user scrolls.
  </figcaption>
</figure>

## Going further
The CDK's virtual scroll abilities go much further than this basic example. In the [sample app](https://stackblitz.com/edit/scroll-list?file=src/app/app.component.ts), the entire list was in memory, but the list could be fetched on demand for more complex applications. You can learn more about the other capabilities of `ScrollingModule` and the `cdkVirtualOf` directive by reading about `Scrolling` in the [CDK documentation](https://material.angular.io/cdk/scrolling/overview).

_Hero image by Mr Cup / Fabien Barral on [Unsplash](https://unsplash.com/photos/o6GEPQXnqMY)._
