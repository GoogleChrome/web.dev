---
title: '{% Compare %} and {% CompareCaption %}'
---
## Compare

```text
{% raw %}&#123;% Compare 'worse' %&#125;
&#96;&#96;&#96;text
Bad code example
&#96;&#96;&#96;
&#123;% endCompare %&#125;

&#123;% Compare 'better' %&#125;
&#96;&#96;&#96;text
Good code example
&#96;&#96;&#96;
&#123;% endCompare %&#125;{% endraw %}
```

{% Compare 'worse' %}
```text
Bad code example
```
{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```
{% endCompare %}

### Compare with caption

````text
{% raw %}{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}{% endraw %}
````

{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}

### Compare with custom labels

```text
{% raw %}&#123;% Compare 'worse', 'Unhelpful' %&#125;
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a
massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus
nibh varius at.
&#123;% endCompare %&#125;

&#123;% Compare 'better', 'Helpful' %&#125;
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a
massa sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus
nibh varius at.
&#123;% endCompare %&#125;{% endraw %}
```

{% Compare 'worse', 'Unhelpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

{% Compare 'better', 'Helpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

### Compare in columns

````html
<div class="switcher">
{% raw %}{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}{% endraw %}
</div>
````

<div class="switcher">
{% Compare 'worse' %}
```text
Bad code example
```

{% CompareCaption %}
Explanation of why `example` is bad.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
```text
Good code example
```

{% CompareCaption %}
Explanation of why `example` is good.
{% endCompareCaption %}

{% endCompare %}
</div>