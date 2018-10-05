<!-- Guides for path -->

{{#each categories}}

<hr />

<div class="path--counter">{{this.num}}</div>

## {{title}}

{{#each guides}}
* [{{this.title}}]({{this.id}})
{{/each}}

{{/each}}