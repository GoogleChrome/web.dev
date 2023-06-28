---
title: '{% raw %} / {% verbatim %}'
---

`EmployeeListComponent` accepts a list of employees and a department name as inputs. When the user tries to remove or add an employee, the component triggers a corresponding output. The component also defines the `calculate` method, which implements the business calculation.

Here's the template for `EmployeeListComponent`:

```html
<h1 title="Department">{% raw %}{{ department }}{% endraw %}</h1>
<mat-form-field>
  <input placeholder="Enter name here" matInput type="text" [(ngModel)]="label" (keydown)="handleKey($event)">
</mat-form-field>
<mat-list>
  <mat-list-item *ngFor="let item of data">
    <h3 matLine title="Name">
      {% raw %}{{ item.label }}{% endraw %}
    </h3>
    <md-chip title="Score" class="mat-chip mat-primary mat-chip-selected" color="primary" selected="true">
      {% raw %}{{ calculate(item.num) }}{% endraw %}
    </md-chip>
  </mat-list-item>
</mat-list>
```