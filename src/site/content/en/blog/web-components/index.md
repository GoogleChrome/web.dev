---
title: Building components
subhead: Components are the building blocks of modern web applications. What best practices should you follow when building your own components so they can stand the test of time?
date: 2017-08-14
updated: 2018-09-20
description: Components are the building blocks of modern web applications. What best practices should you follow when building your own components so they can stand the test of time?
tags:
  - blog
---
Components are the building blocks of modern web applications. What best
practices should you follow when building your own components so they can stand
the test of time?


<div class="switcher">
<div>
  <figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/d2unXi9wTsX0y2X3bee4.svg", alt="Code icon.", width="24", height="24" %}
  </figure>

  ## Custom Elements

  Custom elements give developers the ability to extend HTML and create their
  own tags. Because custom elements are standards based they benefit from the
  Web's built-in component model. The result is more modular code that can be
  reused in many different contexts.

  <a href="/custom-elements-v1/" >Learn more</a>
</div>

<div>
  <figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/pQzEa7Rl3fDmejk5DODq.svg", alt="Boder style icon", width="24", height="24" %}
  </figure>

  ## Shadow DOM

  Shadow DOM is a web standard that offers component style and markup
  encapsulation. It is a critically important piece of the Web Components
  story as it ensures that a component will work in any environment 
  even if other CSS or JavaScript is at play on the page.

  <a href="/shadowdom-v1/">Learn more</a>
  
</div>
</div>

<div class="switcher">
<div>
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/pQzEa7Rl3fDmejk5DODq.svg", alt="Done icon.", width="24", height="24" %}
</figure>

## Best Practices

Because custom elements and shadow DOM are low-level primitives, it's not
always clear how best to combine them to create a component that is robust
and works well in many different environments. While you really can do just
about anything with these APIs, here are a few best practices to help ensure
your components work well anywhere.

  <a href="/custom-elements-best-practices/">Learn more</a>

</div>
<div>
  <figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Y1iaJxaSJSMfXUxb09tk.svg", alt="Explore icon.", width="24", height="24" %}
  </figure>

  ## Examples

  HowTo-Components are a set of elements which demonstrate Custom Element
  and Shadow DOM best practices. These elements are not intended to be used
  in production, but are instead presented as a teaching aide to help map
  best practice suggestions to actual implementations.

  <a href="/components-examples-overview/">Learn more</a>
</div>
</div>
