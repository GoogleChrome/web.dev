# web.dev e-commerce
Effective search within your site

# Guide: Choose a search engine

Once customers have arrived on your site, you need to ensure they can find what
they want quickly and easily.
Some customers will navigate to products via category listings, but most will
want to search. For that you need a search engine.
This guide outlines the most popular alternatives.

## How do I choose a solution?

Every online store has different search engine requirements, depending on
company size, business type, staffing resources and inventory type.
There are multiple server- and client-side alternatives:

+   A back-end search engine that you run yourself, such as
    [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)
    or [Solr](http://lucene.apache.org/solr/).
+   Commercial search services such as [Algolia](http://algolia.com/) and
    [AWS Cloudsearch](https://aws.amazon.com/cloudsearch/).
+   A database with built-in search such as
    [MySQL](https://dev.mysql.com/doc/refman/5.7/en/fulltext-search.html) or
    [MongoDB](https://code.tutsplus.com/tutorials/full-text-search-in-mongodb--cms-24835).
+   Application platforms and database services with add-on search
    functionality, such as
    [Firebase](https://firebase.google.com/docs/firestore/solutions/search) and
    [Cloudant](https://www.ibm.com/cloud/cloudant).
+   Client-side JavaScript search libraries such as
    [FlexSearch](https://www.npmjs.com/package/flexsearch) and
    [Elasticlunr](http://elasticlunr.com/).
+   Client-side JavaScript libraries that synchronises data with a backend
    database: [PouchDB](https://pouchdb.com/) for example.
+   [Google Custom Search Engine](https://www.google.com/cse/).

<table>
<thead>
<tr>
<th><strong>We have an app and a website — and multiple data
sources!<br>
<br>
</strong>Many online stores have an app as well as a
website, and get content and data from many
sources.<strong><br>
</strong><br>
All the search engines, databases and
managed services discussed in this guide have integrations across multiple
frameworks, languages, content management systems and e-commerce platforms
 — and for native apps as well as for the web.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Where is your product data and what do you want from it?

Whatever your target platforms, there are several key considerations when
choosing a solution:

+   **What kind of data do you have for your products?**
    Structured data in a database, or just a collection of documents with
    product descriptions, such as brochures or PDFs?  Search engines can access
    and index data from a variety of sources: structured data in databases,
    content and metadata from binary files such as PDF and Word documents, or
    metadata such as [EXIF](https://en.wikipedia.org/wiki/Exif) from images.
    The search engine you choose will need to work with the data you have.
+   **How much data do you need to search?**
    If you can cache all of your product data locally on the client (say less
    than 20MB) you might want to consider using client-side search rather than
    a back-end search engine.
+   **How often do you update your data?**
    If updates are continual and search results absolutely must be kept up to
    date, you'll need to use a server-side option that can cope with continual
    updates.
+   **Would you like search to work offline?**
    Maybe you'd like your customers to be able to search offline, even just for
    part of your site's functionality, such as a store locator or account
    history. Offline search can be enabled by storing search index data on the
    client (see the demo [here](https://simpl.info/search/shakespeare)). Some
    solutions (such as [PouchDB](https://pouchdb.com/)) provide replication
    services between front and back end, to keep your data in synch.

This is just an overview of some of the issues. Pros and cons for each type of
solution are explored in more detail below.

<table>
<thead>
<tr>
<th><strong>What is a search index?</strong><br>
It's possible to search a small amount of data simply by scanning all
of the data for every query. As the quantity of data increases, this
becomes slow and inefficient.<br>
In its simplest form a <a
href="https://en.wikipedia.org/wiki/Search_engine_indexing">search
indexer</a> gets around this problem by analysing a data set and
building an index of search terms (words or phrases) and their location
within the data — a bit like an index at the back of a book. The search
implementation can then look up the query in the index rather than scanning
all of the data. Indexers can also implement features such as stop-word
handling and stemming.<br>
All search engines use some form of indexing to enable efficient
search.<br>
You can view a sample <a
href="https://simpl.info/search/lunr/data/index.json">here</a> of
product data combined with an index, built for <a
href="https://simpl.info/search/lunr">this demo</a> using the <a
href="https://lunrjs.com/">Lunr</a> JavaScript library.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## What are the options?

### Search engine

Run your own search engine on a server. The two most popular search engines are
[Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)
and [Solr](http://lucene.apache.org/solr/), both open source.

#### Pro

+   A search engine can also serve as a data store — though there are
    [caveats](https://www.quora.com/Why-shouldnt-I-use-ElasticSearch-as-my-primary-datastore).
+   Search engines can handle petabytes of data on hundreds of servers.
+   Queries are extremely fast, and updates can be searchable with very low
    latency.
+   Potentially relatively cheap and straightforward to set up and run if
    you already have a server team (or at least a dedicated system
    administrator). However, see the comments under managed search services below.

#### Con

+   Setup, maintenance and update cost. Large-scale, high volume
    installations can be complex!
+   Initial and ongoing infrastructure cost.
+   Search queries done on a server require reliable connectivity from the
    client, and obviously don't work offline.
+   Modern search engines are extremely fast, but client connectivity
    bottlenecks and latency can make searches unresponsive.
+   Every search query requires a request to the server, which can incur
    significant data cost and battery usage on mobile clients.
    [Instant search](https://www.algolia.com/doc/tutorials/search-ui/instant-search/build-an-instant-search-results-page/instantsearchjs/)can
    make this worse.

### Managed search service

Use a commercial service such as [Algolia](http://algolia.com/), [Amazon
CloudSearch](https://aws.amazon.com/cloudsearch/pricing/) or a platform such as
[Firebase](https://firebase.google.com/docs/firestore/solutions/search) or
[Cloudant](https://www.ibm.com/cloud/cloudant) that integrates with third party
search services (Firebase uses Algolia). You upload your product data, and they
give you search services via APIs.

#### Pro

+   It's not simple to set up and maintain a large-scale search service
    able to withstand high concurrent demand and traffic spikes, along with
    complex, petabyte-scale data sets and a high volume of updates. It can be
    hard to find the right people to do the job.
+   DIY alternatives can incur greater infrastructure and human resource costs.
+   A managed service can be simpler and more reliable to scale.
+   Outsourcing search can simplify the management of setup, maintenance and
    updates — and reduce startup time.
+   In most cases, the performance of managed services should be at least as
    good as a DIY equivalent.
+   Managed services are potentially more reliable than self-hosted
    alternatives and should be able to guarantee minimum service levels.
+   It may be possible to include search relatively cheaply within existing
    cloud contracts.

#### Con

+   Potentially more expensive than DIY search engine options.
+   As with other server-side options: data cost, battery usage, and
    reliance on connectivity.
    [Instant search](https://www.algolia.com/doc/tutorials/search-ui/instant-search/build-an-instant-search-results-page/instantsearchjs/)
    can make this worse.

### Database search

With this option, you only use built-in database search features, without a
separate search engine.
NoSQL databases including
[MongoDB](https://code.tutsplus.com/tutorials/full-text-search-in-mongodb--cms-24835)
support full text search. CouchDB can implement search using
[couchdb-lucene](https://github.com/rnewson/couchdb-lucene) or in pre-built
alternatives such as
[Couchbase](https://www.couchbase.com/products/full-text-search).
Full text search is also supported by open source relational databases such as
[MySQL](https://dev.mysql.com/doc/refman/5.7/en/fulltext-search.html) and
[PostgreSQL](https://www.postgresql.org/docs/9.5/static/textsearch.html) as well
as many commercial alternatives.

#### Pro

+   A database that supports full text search may be adequate for your
    needs, without the cost of setting up and maintaining a separate search engine.
+   There are
    [good reasons](https://www.quora.com/Why-shouldnt-I-use-ElasticSearch-as-my-primary-datastore)
    not to use a search engine as a data store. If you need to store and update
    a significant volume of data, it's likely you'll need a database. If your
    database enables search, that may be all you need.

#### Con

+   Built-in or add-on database search functionality may not be powerful
    or flexible enough to meet your requirements.
+   A full-scale relational or NoSQL database may be overkill for smaller
    data sets with simpler use cases.
+   Same connectivity issues other server-side options.

### Google Site Search and Google Custom Search Engine

Google Site Search [is
deprecated](https://enterprise.google.com/search/products/gss.html), but [Google
Custom Search Engine](https://cse.google.co.uk/cse/) (CSE) is still available.
The differences between the two are explained
[here](https://support.google.com/customsearch/answer/4541888?hl=en).
You can try CSE with the example
[here](https://cse.google.com/cse/publicurl?cx=012061871733780540184:yuzohtakpbo),
which searches products from the [Polymer Shop](https://github.com/Polymer/shop)
project.
If you don't want ads and if you're happy to pay (or the free quota is enough)
the
[CSE API](https://developers.google.com/custom-search/json-api/v1/reference/cse/list)
might work for you.

#### Pro

+   Quick and easy to set up.
+   Fast, reliable search.
+   Ad-free for non profits and educational organisations.

#### Con

+   API version costs $5.00 per 1000 queries.
+   Unless you use the API, and build your own, you get ads at the top of
    search results.
+   No customisation possible for autosuggest or other input features.
+   No control over result ranking or layout now that Google Site Search is
    deprecated.

### Client-side search

JavaScript libraries such as
[FlexSearch](https://www.npmjs.com/package/flexsearch) and
[ElasticLunr](http://elasticlunr.com/) enable websites to do full text search
without accessing server-side search services. This can be quick and efficient,
and also means search can be done offline.
Client-side search can be particularly compelling for a relatively small set of
data that doesn't change much. (For example, [shearch.me](https://shearch.me)
searches Shakespeare's plays and poems.)
The various JavaScript search libraries are all implemented in much the same
way:

1.  Use the Node version of the library to create an index file from data
    to be searched, such as a product catalogue in JSON format.
1.  From your web client, download the index along with data along with
    product data.
1.  From your web client, run the JavaScript library to search, using the
    index and .

The Cache and Service Worker APIs enable websites to work offline and build
resilience to variable connectivity. Local caching combined with client-side
search can enable a number of use cases. For example:

+   Searching an online shop while offline.
+   Enabling customers to use a store locator or search their purchase history.
+   Providing resilience and fallbacks in case of connectivity dropouts.

You can find out more about offline search from the article [Build offline
search](http://fdsaf) [TODO: Add link].

<table>
<thead>
<tr>
<th><a
href="http://html5doctor.com/introducing-web-sql-databases/">WebSQL</a>
enabled fast text matching (<a
href="https://samdutton.wordpress.com/2011/04/08/instant-search-for-shakespeares-sonnets/">demo</a>)
and full text search (<a
href="https://gist.github.com/nolanlawson/0264938033aca2201012">demo</a>).<br>
However, the WebSQL standard <a
href="https://softwareengineering.stackexchange.com/questions/220254/why-is-web-sql-database-deprecated">has
been discontinued</a> and only ever had partial browser support.<br>
Full text search in WebSQL is now being <a
href="https://www.chromestatus.com/feature/5704730961510400">removed</a>.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

#### Pro

+   Relatively simple to set up and maintain.
+   No search engine, database or third party search service required.
+   Search is done on the client, so queries do not require a server round
    trip, so reduce server load and use less radio on mobile devices.
+   Client-side search is resilient to connectivity vagaries.
+   Client-side search can be extremely fast for smaller data sets.
+   Offline search capability can be enabled by caching index files using
    client-side storage such as the Cache API or localStorage.
+   Potentially useful for content that isn't frequently updated, or where
    updates (though important) are not time critical. For example, an
    e-commerce site could use client-side search to enable offline access to
    store locations.

#### Con

+   Only viable for a limited amount of data — though this could be up to
    tens of thousands of documents, potentially more, as long as the data is
    relatively static and doesn't change frequently.
+   High latency for data updates compared to server-side alternatives.
+   Potential for stale data.
+   Client-side search incurs memory, storage and processing cost. For
    example, the demo [here](https://simpl.info/search/shakespeare/) (which
    searches Shakespeare's plays and poems) uses over 200MB of memory when
    running in Chrome on desktop.
+   Currently there's no way to share a JavaScript object, such as a search
    index, across multiple pages, except by serialising and storing it.
    ([Shared
    workers](https://developer.mozilla.org/en/docs/Web/API/SharedWorker) get
    around this, but
    [aren't implemented for Chrome for Android](https://bugs.chromium.org/p/chromium/issues/detail?id=154571).
    [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
    might help, but has been [disabled by
    default](https://www.chromium.org/Home/chromium-security/ssca) by all major
    browsers.) Unless you use a
    [SPA](https://en.wikipedia.org/wiki/Single-page_application) architecture,
    you'll need to recreate the index every time the user navigates to a new
    page, which is unworkable.
+   A server-side search service with an API can be used across multiple
    platforms and device types whereas client-side search may need to be
    implemented for both web and native, potentially with server-side fallbacks.
+   Offline use cases are not (yet) a priority for e-commerce or other types
    of sites, so why bother with client-side search?

### Client-side search with automated replication

JavaScript libraries such as [PouchDB](https://pouchdb.com/) and
[SyncedDB](https://github.com/paldepind/synceddb) do much the same job as the
client-side libraries described above, but they also offer the ability to
automatically synchronise data on the client with a back-end database,
optionally in both directions.
You can try an offline-enabled PouchDB demo
[here](https://simpl.info/search/pouchdb).

#### Pro

+   In theory ‘the best of both worlds': search is done on the client,
    data is continually updated.
+   Enables offline search.
+   As with other types of client-side search, reduces the number of
    requests, and thereby potentially reduces server load and device radio usage.
+   Enables bidirectional synchronisation, potentially for multiple endpoints.

#### Con

+   Architecture is more complex than simply maintaining data as (for
    example) a JSON file: a database server is required.
+   As with other types of client-side search, processing incurs battery
    cost, and the potential size of the data set is limited by
    [client-side storage quota](https://www.html5rocks.com/en/tutorials/offline/quota-research/).
+   For a client with good connectivity, potentially slower than a fast
    backend database or search engine.

<table>
<thead>
<tr>
<th><strong>What is a document?</strong><br>
Confusingly, the word ‘document' is used with two different meanings
in relation to search engines:<br>
<ul>
<li>Data representing a single item, a ‘record' or ‘object', for
example:<br>
<code>{name: ‘Big red armchair', SKU: ‘B47516'}</code></li>
<li>A binary file in a format such as PDF or Word.</li>
</ul>
Providing high quality search results for a set of binary files can be much
more complex than searching structured textual data. Imagine a video
archive catalogue consisting of millions of legacy files with multiple
different binary formats and a variety of content structures — how can you
provide consistent and accurate search across the entire document set?</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## What else do you need to think about?

+   **Data update latency:** There will always be a delay from when you
    add, update or delete data until your changes appear in search results.
    This latency can be very low for search engines, potentially sub-second,
even with large data sets.

    Low update latency is crucial for large-scale e-commerce search, or for any
    context where search results must reflect data updates within strict time
    limits specified by SLAs — for example, if your site urgently needs to
remove a product search result.

    Client-side search may not be able to provide low enough update latency or
    guarantee that updates have been propagated. If your product data changes
    regularly, maintaining client-side search may be highly inefficient, since
    every data or index update must be distributed to (and installed for) all
    your customers.
+   **Search accuracy and ranking:** Successful search implementations need
    to trade off
    [precision](https://en.wikipedia.org/wiki/Precision_and_recall#Precision)
    and [recall](https://en.wikipedia.org/wiki/Precision_and_recall#Recall),
    avoiding missing results as well as false positives. Understanding how to
    rank results — and what the indexer should actually ignore — is often
    crucial. Search engines need to ensure results can be ranked properly, by
    measuring the frequency or position of the search term within documents,
    phrase word proximity, or with other techniques. For example, a surf shop
    may sell surfboard wax, but surfboard descriptions may also mention _board_
    and _wax_, leading to irrelevant results for _board wax_.
+   **Metadata search:** You may need to search metadata as well as content,
    for example image EXIF data or PDF brand and product fields.
+   **Geographical search:** A query for _London secondhand pixel_ matches
    results for _secondhand pixel_ from the King's Cross area or postcode NC1.

## Next steps

Check out the other guides and codelabs in this series:

+   [Add search to your website](https://docs.google.com/document/d/1n-mrtHFE0YcqP1T9MWiAfyxLBNcBmuWKocaQiu0zsDE/edit#heading=h.cgvdu9aeouaf)
    [TODO: web.dev link]
Overview of the guides in this series.
+   [Help customers search](https://docs.google.com/document/d/1tS6gA9vvis0-Sx_jD0P0mUV-2v9xYcNbAYBa52evwQs/edit#)
[TODO: web.dev link]
    Make the most of search engine features that help customers input search text.
+   [Build a great search box](https://docs.google.com/document/d/1_5QZzRJTyCC9byZyCyljFoSoW7D47YVNXMQInBQWfvk/edit#)
[TODO: web.dev link]
    Design and code successful UI elements for product search.
+   [Successful search results](https://docs.google.com/document/d/15XgySKmWFiDfwYq8_OUrPDxomCjtTFJxRAW7ZUx5TnQ/edit)
    [TODO: web.dev link]
Discover best practice for displaying product lists.
+   [Build offline search](http://blah) [TODO: web.dev link]
    Learn how to build search that doesn't need an internet connection.
