---
layout: post
title: Additional HTML elements
description: Essential metrics for a healthy site
date: 2022-02-02
---

In earlier activities, you learned:

- The basics of  HTML tags and elements. 
- How to structure a web page.
- Semantic HTML and best practices. 

With this article, you continue to build on your HTML knowledge and cover additional HTML elements. 

## Text content elements

```html
<p>To make text bold via CSS, use the <code>font-weight</code> property with the <code>bold</code> property value.</p>
```

These elements support the creation of text content and add structure, style and meaning. There are multiple pieces of text content that can incorporate the following elements. 

### The blockquote element

```html
<blockquote cite="https://www.goodreads.com/quotes">
    <p>Be the change that you wish to see in the world.</p>
</blockquote>
```

This example shows how to use the [`<blockquote>`](https://developer.mozilla.org/docs/Web/HTML/Element/blockquote) element, showcasing a famous quote by Mahatma Gandhi. There are so many great quotations out there that provide memorable content and meaning. Think about some of your favorite inspirational figures and their quotes. 

Use the `<blockquote>` element when using quotations and referencing information from a  source. The `<blockquote>` element creates a unique indentation and alignment in presentation, and uses both an opening and closing tag. A `<blockquote>` is especially helpful when using longer quotations that cover multiple lines of text.

You can use various elements within a `<blockquote>` element as well, such as a header, paragraph, or list. 

{% Aside %}
Think about a scenario where you would create and structure a block of code using the `<blockquote> `element. 
{% endAside %}

### The `<details>` element

```html
<details>
   <summary>Details</summary>
   Additional Information
</details>
```

Often, a web page will have an FAQ section and additional information that is available to the user. There are FAQ sections that are common for product information, travel itinerary, or any kind of question and answer scenario. 

The [`<details>`](https://developer.mozilla.org/docs/Web/HTML/Element/details) element is helpful by using a disclosed widget that holds additional information. The element includes a built-in toggle functionality and the user can open and close the toggle. When the toggle is open, the additional information content expands and can be read by the user. When the toggle is closed, the additional information content is hidden from the user. To name the `<details>` widget itself, use the [`<summary>`](https://developer.mozilla.org/docs/Web/HTML/Element/summary) element. 

```html
<figure>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
     alt="Google logo">
  <figcaption>Google logo</figcaption>
</figure>
```

This is the [`<figure>`](https://developer.mozilla.org/docs/Web/HTML/Element/figure) element in action. Here you see that `<figure>`, used alongside with the [`<figcaption>`](https://developer.mozilla.org/docs/Web/HTML/Element/figcaption) element, can be used to enhance the visual experience. 

You see images all over the web, and other helpful visual data all the time. Visual elements help attract the attention of the visitor and create a great user experience. The `<figure>` element is a way of labeling an image, table, chart etc. It works by creating self contained content in relation to the main content. 

{% Aside %}
This element also works well with the `<blockquote>` element. 
{% endAside %} 

### The `<time>` element

```html
<p>The movie starts on Tuesday at <time datetime="2021-07-01T11:00:00">11:00</time>.</p>
```

The [`<time>`](https://developer.mozilla.org/docs/Web/HTML/Element/time) element provides both meaning and semantic meaning, allowing for better functionality with activities such as scheduling an appointment online, publishing a date and time for a blog article, archives, etc. A few website examples that would use the `<time>` element include using Google calendar, publishing an article live on a platform, or reading online historical archives from a library website.

The `<time>` element  references time, and can represent the time for a 24 hour clock or a specific date that can adjust for timezone and location.  This element requires both an opening and closing tag, `<time>` and `</time>`. You can add the `datetime` attribute so that dates can be read in a machine readable format. 

## Document metadata

```html
<title>Sarah's Favorite Food Recipes</title>
```

Anytime you type in a website URL, there's a [`<title>`](https://developer.mozilla.org/docs/Web/HTML/Element/title) name that can be read in the browser bar or web page tab. It's the title name you see given for a web page. This element is important and is used by a search engine to display a list of related web pages in search results. The title length can vary from short and descriptive, to longer and more descriptive. 

Scenario: you have a web page you're thinking about, but can't remember the specific website URL. Type in the keywords in a search engine. The search engine helps track down the web page that you're looking for, and you can view the `<title>` name appearing in search.

## Embedded content elements

In addition to text content, there are a variety of additional content elements to use. 

The `<iframe>` element

```html
<iframe src="https://www.wikipedia.org/" title="Wikipedia"></iframe>
```

When finishing shopping for items online and clicking on your payment option, such as Paypal or Apple Pay, these features are commonly added to a web page with an [`<iframe>`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe). Seeing a map online to search for a local business is another common experience. These types of user experiences on a web page can be added with an iframe.  In the example above, you see the Wikipedia URL within an iframe, titled as "Wikipedia." 

The `<iframe>` element allows you to insert content from another source and embed a frame within a web page. It creates a rectangular shaped frame and displays content in the browser. A frame allows for the presentation of a window shaped layout within an `<iframe>` element. It's a powerful way to add content to your web page to enhance the experience. 

{% Aside %}
Think about which types of web page content you would want to embed onto another page, using the `<iframe>` and `<source>`. What would it look like?
{% endAside %}

## Form elements

```html
<progress max="100" value="30"> 30% </progress>
```

When watching a longer video, lecture, or filling out an extensive application, having a visual progress bar can be helpful to track your progress. The [`<progress>`](https://developer.mozilla.org/docs/Web/HTML/Element/progress) element is helpful for these types of scenarios. 

This element is depicted as a visual bar with a background color. The visual bar can range in size and background color. With the progress bar, you can optionally use the `max` and `value` attributes. The `max` attribute sets the floating point number and the `value` attribute notes how much progress has been made on a task.  

## Scripting

```html
<canvas id="canvas"></canvas>
```

To be able to draw graphics and animations in real time, use the [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API) element. Place the `<canvas>` element into your HTML web page to create a canvas. This element requires JavaScript code for the functionality to draw and create graphics. 

## Table content elements

```html
<table>
    <thead>
        <tr>
            <th colspan="2">Grocery List</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Broccoli</td>
            <td>Quantity: 2</td>
        </tr>
    </tbody>
</table>
```

### The `<table>` element

The [`<table>`](https://developer.mozilla.org/docs/Web/HTML/Element/table) element creates a table. This is the starting point for adding additional elements with rows and columns. Tables appear often on web pages, being a helpful way to organize and show information. One use case for using the `<table>` element is to present tabular information to the user, such as the sort of information you may find in a spreadsheet.

### The `<th>` element

The [`<th>`](https://developer.mozilla.org/docs/Web/HTML/Element/th) element is the header for a group of cells. 

### The `<tr>` element

The [`<tr>`](https://developer.mozilla.org/docs/Web/HTML/Element/tr) element defines a row of cells within a table. From here, you can add in specific cell data. 

### The `<td>` element 

The [`<td>`](https://developer.mozilla.org/docs/Web/HTML/Element/td) element creates the cell, adding the content needed. 

## Conclusion

In this article, you discovered additional HTML elements and built on your coding skills. You learned more about content, inline text, embedded content and table elements. You now have built on your understanding of additional HTML elements. Keep up the good work!