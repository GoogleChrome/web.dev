<!-- Guides for path -->

{{#each categories}}

<hr />

<div class="path--counter">{{this.num}}</div>

## {{title}}

{{#each guides}}
* [{{this.title}}]({{../../path}}/{{this.id}})
{{/each}}

{{/each}}