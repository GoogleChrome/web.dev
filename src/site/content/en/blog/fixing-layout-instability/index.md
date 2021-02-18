---
title: Fixing layout instability
subhead: A walkthrough of using WebPageTest to identify and fix layout instability issues.
authors:
  - rviscomi
date: 2019-09-30
description: |
  A walkthrough of using WebPageTest to identify and fix layout instability issues.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webdev
  - webpagetest
  - ux
---

In an earlier post I wrote about [measuring Cumulative Layout Shift](https://dev.to/chromiumdev/measuring-cumulative-layout-shift-cls-in-webpagetest-5cle) (CLS) in WebPageTest. CLS is an aggregation of all layout shifts, so in this post I thought it'd be interesting to dive deeper and inspect each individual layout shift on a page to try to understand what could be causing the instability and actually try to fix the issue(s).

## Measuring layout shifts

Using the Layout Instability API, we can get a list of all layout shift events on a page:

```js
new Promise(resolve => {
  new PerformanceObserver(list => {
    resolve(list.getEntries().filter(entry => !entry.hadRecentInput));
  }).observe({type: "layout-shift", buffered: true});
}).then(console.log);
```

This produces an array of layout shifts that are not preceded by input events:

```json
[
  {
    "name": "",
    "entryType": "layout-shift",
    "startTime": 210.78500000294298,
    "duration": 0,
    "value": 0.0001045969445437389,
    "hadRecentInput": false,
    "lastInputTime": 0
  }
]
```

In this example there was a single very tiny shift of 0.01% at 210ms.

Knowing the time and severity of the shift is useful to help narrow down what could have caused the shift. Let's turn back to [WebPageTest](https://webpagetest.org) for a lab environment to do more testing.

## Measuring layout shifts in WebPageTest

Similar to measuring CLS in WebPageTest, measuring individual layout shifts will require a custom metric. Fortunately, the process is easier now that Chrome 77 is stable. The Layout Instability API is enabled by default, so you should be able to execute that JS snippet on any website within Chrome 77 and get results immediately. In WebPageTest, you can use the default Chrome browser and not have to worry about command line flags or using Canary.

So let's modify that script to produce a custom metric for WebPageTest:

```js
[LayoutShifts]
return new Promise(resolve => {
  new PerformanceObserver(list => {
    resolve(JSON.stringify(list.getEntries().filter(entry => !entry.hadRecentInput)));
  }).observe({type: "layout-shift", buffered: true});
});
```

The promise in this script resolves to a JSON representation of the array rather than the array itself. This is because custom metrics can only produce primitive data types like strings or numbers.

The website I'll use for the test is [ismyhostfastyet.com](https://ismyhostfastyet.com/), a site I built to compare real world loading performance of web hosts.

## Identifying causes of layout instability

In the [results](http://webpagetest.org/custom_metrics.php?test=190918_6E_ef3c166b4a34033171d47e389cf82939&run=5&cached=0) we can see the LayoutShifts custom metric has this value:

```json
[
  {
    "name": "",
    "entryType": "layout-shift",
    "startTime": 3087.2349999990547,
    "duration": 0,
    "value": 0.3422101449275362,
    "hadRecentInput": false,
    "lastInputTime": 0
  }
]
```

To summarize, there is a single layout shift of 34.2% happening at 3087ms. To help identify the culprit, let's use WebPageTest's [filmstrip view](http://webpagetest.org/video/compare.php?tests=190918_6E_ef3c166b4a34033171d47e389cf82939-r%3A5-c%3A0&thumbSize=200&ival=100&end=visual).

<figure class="w-figure">
  {% Img src="image/admin/h1QidJnqWmFsk25yq1iu.png", alt="Two cells in the filmstrip, showing screenshots before and after the layout shift.", width="800", height="341", class="w-screenshot" %}
  <figcaption class="w-figcaption">Two cells in the filmstrip, showing screenshots before and after the layout shift.</figcaption>
</figure>

Scrolling to the ~3 second mark in the filmstrip shows us exactly what the cause of the 34% layout shift is: the colorful table. The website asynchronously fetches a JSON file, then renders it to a table. The table is initially empty, so waiting to fill it up when the results are loaded is causing the shift.

<figure class="w-figure">
  {% Img src="image/admin/hlbsiYTsFfVjpNk18ii4.png", alt="Web font header appearing out of nowhere.", width="800", height="336", class="w-screenshot" %}
  <figcaption class="w-figcaption">Web font header appearing out of nowhere.</figcaption>
</figure>

But that's not all. When the page is visually complete at ~4.3 seconds, we can see that the `<h1>` of the page "Is my host fast yet?" appears out of nowhere. This happens because the site uses a web font and hasn't taken any steps to optimize rendering. The layout doesn't actually appear to shift when this happens, but it's still a poor user experience to have to wait so long to read the title.

## Fixing layout instability

Now that we know the asynchronously generated table is causing one-third of the viewport to shift, it's time to fix it. We don't know the contents of the table until the JSON results are actually loaded, but we can still populate the table with some kind of _placeholder data_ so that the layout itself is relatively stable when the DOM is rendered.

Here's the code to generate placeholder data:

```js
function getRandomFiller(maxLength) {
  var filler = '█';
  var len = Math.ceil(Math.random() * maxLength);
  return new Array(len).fill(filler).join('');
}

function getRandomDistribution() {
  var fast = Math.random();
  var avg = (1 - fast) * Math.random();
  var slow = 1 - (fast + avg);
  return [fast, avg, slow];
}

// Temporary placeholder data.
window.data = [];
for (var i = 0; i < 36; i++) {
  var [fast, avg, slow] = getRandomDistribution();
  window.data.push({
    platform: getRandomFiller(10),
    client: getRandomFiller(5),
    n: getRandomFiller(1),
    fast,
    avg,
    slow
  });
}
updateResultsTable(sortResults(window.data, 'fast'));
```

The placeholder data is generated randomly before being sorted. It includes the "█" character repeated a random number of times to create visual placeholders for the text and a randomly generated distribution of the three main values. I also added some styles to desaturate all color from the table to make it clear that the data is not fully loaded yet.

The appearance of the placeholders you use don't matter for layout stability. The purpose of the placeholders is to assure users that content *is* coming and the page isn't broken.

Here's what the placeholders look like while the JSON data is loading:

<figure class="w-figure">
  {% Img src="image/admin/hF2EmHSpJArXA6TQ6Cm7.png", alt="The data table is rendered with placeholder data.", width="800", height="486", class="w-screenshot" %}
  <figcaption class="w-figcaption">The data table is rendered with placeholder data.</figcaption>
</figure>

Addressing the web font issue is much simpler. Because the site is using Google Fonts, we just need to pass in the `display=swap` property in the CSS request. That's all. The Fonts API will add the `font-display: swap` style in the font declaration, enabling the browser to render text in a fallback font immediately. Here's the corresponding markup with the fix included:

```html
<link href="https://fonts.googleapis.com/css?family=Chivo:900&display=swap" rel="stylesheet">
```

## Verifying the optimizations

After rerunning the page through WebPageTest, we can generate a before and after [comparison](http://webpagetest.org/video/compare.php?tests=190918_6E_ef3c166b4a34033171d47e389cf82939%2C190918_WF_60f9c9a1c669b20039860c09ca27df7c&thumbSize=200&ival=100&end=visual) to visualize the difference and measure the new degree of layout instability:

<figure class="w-figure">
  {% Img src="image/admin/1BJlP3HxeynRw0gRt52H.png", alt="WebPageTest filmstrip showing both sites loading side-by-side with and without layout optimizations.", width="800", height="288", class="w-screenshot" %}
  <figcaption class="w-figcaption">WebPageTest filmstrip showing both sites loading side-by-side with and without layout optimizations.</figcaption>
</figure>


```json
[
  {
    "name": "",
    "entryType": "layout-shift",
    "startTime": 3070.9349999997357,
    "duration": 0,
    "value": 0.000050272187989256116,
    "hadRecentInput": false,
    "lastInputTime": 0
  }
]
```

According to the [custom metric](http://webpagetest.org/custom_metrics.php?test=190918_WF_60f9c9a1c669b20039860c09ca27df7c&run=9&cached=0), there is still a layout shift occurring at 3071ms (about the same time as before) but the severity of the shift is _much_ smaller: 0.005%. I can live with this.

It's also clear from the filmstrip that the `<h1>` font is immediately falling back to a system font, enabling users to read it sooner.

## Conclusion

Complex websites will probably experience many more layout shifts than in this example, but the remediation process is still the same: add layout instability metrics to WebPageTest, cross-reference the results with the visual loading filmstrip to identify the culprits, and implement a fix using placeholders to reserve the screen real estate.

### (One more thing) Measuring layout instability experienced by real users

It's nice to be able to run WebPageTest on a page before and after an optimization and see an improvement to a metric, but what really matters is that the user experience is actually getting better. Isn't that why we're trying to make the site better in the first place?

So what would be great is if we start measuring the layout instability experiences of real users along with our traditional web performance metrics. This is a crucial piece of the optimization feedback loop because having data from the field tells us where the problems are and whether our fixes made a positive difference.

In addition to collecting your own layout instability data, check out the [Chrome UX Report](https://twitter.com/ChromeUXReport/status/1138555303379816448), which includes Cumulative Layout Shift data from real user experiences on millions of websites. It allows you to find out how you (or your competitors) are performing, or you can use it to explore the state of layout instability across the web.
