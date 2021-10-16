---
noindex: true
permalink: "/sitemap.xml"
---
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.all %}
{%- if not page.data.noindex and not page.data.draft %}
  {# Verify that the page has a permalink so we don't pull in things like #}
  {# the service worker partial. #}
  {# Use the page's canonicalUrl which ignores the language directories. #}
  {%- if page.url %}
  {% set fullUrl %}{{ site.url }}{{ page.url }}{% endset %}
  <url>
    <loc>{{ fullUrl }}</loc>
    {%- set lastMod = page.data.date -%}
    {%- if page.data.updated -%}
      {%- set lastMod = page.data.updated -%}
    {%- endif -%}
    {%- if lastMod %}
    <lastmod>{{ lastMod | htmlDateString }}</lastmod>
    {%- endif %}
  </url>
  {%- endif %}
{%- endif %}
{%- endfor %}
</urlset>
