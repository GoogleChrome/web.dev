---
title: '{% Aside %}'
---

## Asides

### Note asides

{% Aside %}
Use the note aside to provide supplemental information.
{% endAside %}
### Caution asides

{% Aside 'caution' %}
Use the caution aside to indicate a potential pitfall or complication.
{% endAside %}

### Warning asides

```text
{% raw %}&#123;% Aside 'warning' %&#125;
The warning aside is stronger than a caution aside; use it to tell the reader
not to do something.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'warning' %}
The warning aside is stronger than a caution aside; use it to tell the reader
not to do something.
{% endAside %}

### Success asides

```text
{% raw %}&#123;% Aside 'success' %&#125;
Use the success aside to describe a successful action or an error-free status.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'success' %}
Use the success aside to describe a successful action or an error-free status.
{% endAside %}

### Celebration asides

```text
{% raw %}&#123;% Aside 'celebration' %&#125;
Use the celebration aside to celebrate events like a cross-browser launch.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'celebration' %}
Use the celebration aside to celebrate events like a cross-browser launch.
{% endAside %}

### Objective asides

```text
{% raw %}&#123;% Aside 'objective' %&#125;
Use the objective aside to define the goal of a process described in the body
copy.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'objective' %}
Use the objective aside to define the goal of a process described in the body
copy.
{% endAside %}

### Important asides

```text
{% raw %}&#123;% Aside 'important' %&#125;
Use the important aside to indicate a common problem that the reader wouldn't know
without specialized knowledge of the topic.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'important' %}
Use the important aside to indicate a common problem that the reader wouldn't know
without specialized knowledge of the topic.
{% endAside %}

### Key-term asides

```text
{% raw %}&#123;% Aside 'key-term' %&#125;
Use the key-term aside to define a term that's essential to understanding an
idea in the body copy. Key-term asides should be a single sentence that
includes the term in italics. For example, "A _portal_ is…"
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'key-term' %}
Use the key-term aside to define a term that's essential to understanding an
idea in the body copy. Key-term asides should be a single sentence that
includes the term in italics. For example, "A _portal_ is…"
{% endAside %}

### Codelab asides

```text
{% raw %}&#123;% Aside 'codelab' %&#125;
Use the codelab aside to link to an associated codelab.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'codelab' %}
  [Using Imagemin with Grunt](#)
{% endAside %}

### Update asides

```text
{% raw %}&#123;% Aside 'update' %&#125;
Use the update aside in select cases where updates concerning a developing
situation around a certain API or metric can be effectively communicated.
&#123;% endAside %&#125;{% endraw %}
```

{% Aside 'update' %}
Use the update aside in select cases where updates concerning a developing
situation around a certain API or metric can be effectively communicated.
{% endAside %}