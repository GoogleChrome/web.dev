{{#each topics}}

<h1>{{title}}</h1>
<ul>
{{#each guides}}
  <li><a href="./{{this.id}}">{{this.title}}</li>
{{/each}}
</ul>

{{/each}}