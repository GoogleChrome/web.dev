---
title: "Beautiful, efficient images for e‑commerce"
author: samdutton
hero: hero.jpg
alt: A man in a plaid shirt holding up his hands in front of a laptop computer
description: Help customers input search queries
tags:
  - post
  - images
  - e-commerce
---

Having attracted customers to your site, you need to help them find what they
want and discover additional products.

This guide outlines search engine features you can use to help customers when
they're entering search queries.

You may also want to check out the other guides in this series:

+   [Build a great search box](https://docs.google.com/document/d/1_5QZzRJTyCC9byZyCyljFoSoW7D47YVNXMQInBQWfvk/edit#heading=h.cgvdu9aeouaf)
    [TODO: web.dev link]
+   [Successful search results](https://docs.google.com/document/d/15XgySKmWFiDfwYq8_OUrPDxomCjtTFJxRAW7ZUx5TnQ/edit)
     [TODO: web.dev link]

## Search queries may not match product data

Successful search has to do much more than simply match the customer's search
query with text in a product title or description.

A relevant product may have data worded differently from the customer's query.

Even the most basic search engines have ways to suggest results that are
similar to the search query:

+   **Stemming**a search for _run shoes_ should match products that
    mention _running shoes_ — and vice versa.
+   **Stopword handing:** Search engines need to avoid irrelevant results
    caused by matching common words such as _a_ and _the_. Conversely, ignoring
    stopwords can also cause problems for product names that use stopwords.
+   **Fuzzy matching**A search for _running shoes_ should match results
    for _running shoe_. This can be a simple way to handle spelling mistakes
    and typos.

In practice these techniques
[may not work as well as intended](https://blog.algolia.com/algolia-v-elasticsearch-relevance/#poor-applicability),
especially in multilingual implementations.

Modern search engines provide more advanced features to help suggest
alternatives on input, rather than attempting to guess what the searcher
intended.

## How search engines can help customers input search queries

High quality search implementations provide additional features to help
customers at the start of the search process:

+   **Autocomplete**

    Typing _run…_ invokes suggestions including
    _running shoes_.

[TODO: animation or illustration.]

+   **Spellcheck and autosuggest**

    Typing _runing shoes_ suggests _running shoes_, or does the search automatically. Spellcheck can work better than fuzzy matching, since fuzzy matching can lead to irrelevant results. For e-commerce sites autosuggest can also be used for merchandising, to suggest products the customer may not be aware of.

[TODO: animation or illustration.]

+   **Synonym search**

    A search for _running hat_ should match results for _running cap_, and vice
    versa. This is crucial for product search, since people tend to use
    different words for the same thing, especially across different geographical regions: _shoes_ or _footwear_, _wellies_ or _wellingtons_ or _gumboots_.

[TODO: animation or illustration.]

+   **Recent searches**

    A high proportion of searches are repeat searches: customers often search
    for the same thing again and again, even during the same session. You may
    want to provide recent-search suggestions—and potentially cache assets for recent searches, such as images or product data.

[TODO: animation or illustration.]

+   **Phrase matching**

    How much distance can be allowed between words in a search phrase? For
    example, should a search for _red socks_ match descriptions that include
    the words _red_ and _socks_, but not the exact phrase _red socks_?

[TODO: animation or illustration.]

+   **Scoped and faceted search**

    Provide the customer with UI controls such as checkboxes and sliders to
    narrow the range of potential search results. For example, search only
    within a product type or brand, or _find quilted coats, for a large dog, on
    sale, priced less than $50.00_.

    Functionality like this combines full text search (products that match
    _quilted coats_) with metadata constraints (less than $50).

[TODO: animation or illustration.]

+   **Non-product search**

Customers may not be searching for products.
    Make sure to suggest relevant results for queries such as 'customer
    services' or 'returns'.

{% Aside %}
For a global audience, all this functionality must work across different
languages, character sets, text directionality, and geographical
locations—and potentially handle linguistics and cultural differences.

For example, [Japanese stemming](http://www.cjk.org/cjk/joa/joapaper.htm) is
very different from the way it's done for English. Search engines and search
services all provide different approaches to internationalisation and
localisation.
{% endAside %}

## So… What should I do about it?

Online shoppers have increasingly high expectations for product search—and
product search increasingly originates on mobile, where text entry is difficult
and customers are likely to be distracted and rushed.

Getting search right on the input side is much better than forcing customers to
redo searches and navigate irrelevant search output.

+   Check your competitors. Are they offering better input functionality
    than you? What are the big online retailers doing?
+   Find out what works. You don't need an expensive usability lab—just
    ask friends, family and colleagues to try out your search flow.
+   Try search engine demos. It's relatively straightforward to get a subset
    of product data and try out search engine features that help customers
    input search queries.

## Test your changes

Make sure to set up tracking when you add new search input functionality.

That way you can learn what works and what doesn't: what features customers use,
what they avoid, and what leads to improvements in discovery and conversion.

## Next steps

Check out the other guides and codelabs in this series:

+   [Add search to your website]() [TODO: web.dev link]
    Overview of the guides in this series.
+   [Build a great search box]() [TODO: web.dev link]
    Design and code successful UI elements for product search.
+   [Successful search results]() [TODO: web.dev link]
    Discover best practice for displaying product lists.
+   [Choose a product search engine]() [TODO: web.dev link]
    Learn how to choose between server and client-side alternatives.
+   [Build offline search]() [TODO: web.dev link]
    Learn how to build search that doesn't need an internet connection.

## Find out more

+   [More about search engines](https://medium.com/@samdutton/more-about-search-engines-b897f072de90): find out how to run a search engine
on your own servers.
+   [More about search as a service](https://medium.com/@samdutton/more-about-search-as-a-service-1e2a16b4ee9c): choose between third party search
engine services.
