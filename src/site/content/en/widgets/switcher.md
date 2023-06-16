---
title: '{% Switcher %}'
---

<style>
.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.switcher > * {
  flex-grow: 1;
  flex-basis: calc(
    (752px - 100%) * 999
  );
}

.switcher > :nth-last-child(n + 3),
.switcher > :nth-last-child(n + 3) ~ * {
  flex-basis: 100%;
}
</style>

## The app domain

To show the [mini app way of programming](/mini-app-programming-way/)
applied to a web app, I needed a small but complete enough app idea.
[High-intensity interval training](https://en.wikipedia.org/wiki/High-intensity_interval_training) (HIIT)
is a cardiovascular exercise strategy of alternating sets of short periods of intense anaerobic exercise with less intense recovery periods.
Many HIIT trainings use HIIT timers, for example, this [30&nbsp;minute online session](https://www.youtube.com/watch?v=tXOZS3AKKOw)
from [The Body Coach TV](https://www.youtube.com/user/thebodycoach1) YouTube channel.

<div class="switcher">
  <figure>
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tUl2jNm2bFqGBAFF5s63.png", alt="HIIT training online session with green high intensity timer.", width="800", height="450" %}
    <figcaption>
      Active period.
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMUgX3WJ4ZfQX38zHP75.png", alt="HIIT training online session with red low intensity timer.", width="800", height="450" %}
    <figcaption>
      Resting period.
    </figcaption>
  </figure>
</div>

{% Details %}
{% DetailsSummary %}
Compare screenshots from this video, with and without captions.
{% endDetailsSummary %}
<div class="switcher">
<figure class="screenshot">
{% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/5gUlKnnfGwqP3SrG2oJa.png", alt="Video with captions.", width="800", height="450" %}
</figure>
<figure class="screenshot">
{% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/bfDTwxctgjbPpxqtLwsV.png", alt="Video without captions.", width="800", height="450" %}
</figure>
</div>
{% endDetails %}



Layout tables must also be hidden from AT users with the ARIA
[presentation role](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/presentation_role)
or [aria-hidden state](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-hidden).

<div class="switcher">
{% Compare 'worse' %}

<pre class="prettyprint">
<table>
  <caption>My stamp collection</caption>
  <tr>
    <th>[Stamp Image 1]</th>
    <th>[Stamp Image 2]</th>
    <th>[Stamp Image 3]</th>
  </tr>
</table>
</pre>

{% endCompare %}

{% Compare 'better' %}

```html
<table role="presentation">
  <tr>
    <td>[Stamp Image 1]</td>
    <td>[Stamp Image 2]</td>
    <td>[Stamp Image 3]</td>
  </tr>
</table>
```

{% endCompare %}
</div>