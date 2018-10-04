{{#each categories}}

<hr />

<div class="path--counter">{{this.num}}</div>

## {{title}}

{{#each guides}}
* <a href="./{{this.id}}">{{this.title}}</li>
{{/each}}

{{/each}}