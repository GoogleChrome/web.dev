<table>
  <thead>
    <tr>
      <th>Impact</th>
      <td>Category</td>
      <td>Recommendation</td>
      <td>How to Improve</td>
    </tr>
  </thead>
  <tbody>
{{#each guides}}
<tr data-guide="{{id}}">
  <th><web-impact-chip></web-impact-chip></th>
  <td>{{this.path}}</td>
  <td>{{this.category}}</td>
  <td><a href="{{this.url}}">{{this.title}}</a></td>
</tr>
{{/each}}
  </tbody>
</table>