<!-- Guides for path -->

{{#each categories}}

<hr />

<div class="path--counter">{{this.num}}</div>

<h2>{{title}}</h2>

<ul>
{{#each guides}}
<li><a href="./{{this.id}}">{{this.title}}</li>
{{/each}}
</ul>

{{/each}}

* Why does this Markdown not work

Hello _there_, [link](https://www.google.com).