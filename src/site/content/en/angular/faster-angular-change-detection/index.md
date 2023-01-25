---
layout: post
title: "Optimize Angular's change detection"
subhead: |
  Implement faster change detection for better user experience.
hero: image/admin/gzvMgZD2uXO7L49EWuIV.jpg
alt: An array of light bulbs with a single bulb turned on.
date: 2019-07-09
description: |
  Learn how to optimize your Angular app's change detection to make it more responsive.
authors:
  - mgechev
tags:
  - angular
  - performance
feedback:
  - api
---

Angular runs its [change detection mechanism](https://angular.io/api/core/ChangeDetectorRef) periodically so that changes to the data model are reflected in an app's view. Change detection can be triggered either manually or through an asynchronous event (for example, a user interaction or an XHR completion).

Change detection is a powerful tool, but if it's run very often, it can trigger a lot of computations and block the main browser thread.

In this post you'll learn how to control and optimize the change detection mechanism by skipping parts of your application and running change detection only when necessary.


## Inside Angular's change detection

To understand how Angular's change detection works, let's look at a sample app!

_You can find the code for the app in [this GitHub repository](https://github.com/mgechev/change-detection-web-dev)._

The app lists employees from two departments in a company—sales and R&D—and has two components:

* `AppComponent`, which is the root component of the app, and
* Two instances of `EmployeeListComponent`, one for sales and one for R&D.

{% Img src="image/admin/JtDFr3VL1e2AyUvhbKVU.png", alt="Sample application", width="800", height="456" %}

You can see the two instances of `EmployeeListComponent` in the template for `AppComponent`:

```html
<app-employee-list
  [data]="salesList"
  department="Sales"
  (add)="add(salesList, $event)"
  (remove)="remove(salesList, $event)"
></app-employee-list>

<app-employee-list
  [data]="rndList"
  department="R&D"
  (add)="add(rndList, $event)"
  (remove)="remove(rndList, $event)"
></app-employee-list>
```

For each employee there's a name and a numeric value. The app passes the employee's numeric value to a business calculation and visualizes the result on screen.

{% Aside %}

For simplicity, the app is using an inefficient version of the [fibonacci function](https://en.wikipedia.org/wiki/Fibonacci_number) as its calculation to show the implications of heavy bindings in an app.

{% endAside %}

Now take a look at `EmployeeListComponent`:

```js
const fibonacci = (num: number): number => {
  if (num === 1 || num === 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
};

@Component(...)
export class EmployeeListComponent {
  @Input() data: EmployeeData[];
  @Input() department: string;
  @Output() remove = new EventEmitter<EmployeeData>();
  @Output() add = new EventEmitter<string>();

  label: string;

  handleKey(event: any) {
    if (event.keyCode === 13) {
      this.add.emit(this.label);
      this.label = '';
    }
  }

  calculate(num: number) {
    return fibonacci(num);
  }
}
```

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

This code iterates over all the employees in the list and, for each one, renders a list item. It also includes an `ngModel` directive for two-way data binding between the input and the `label` property declared in `EmployeeListComponent`.

With the two instances of `EmployeeListComponent`, the app forms the following component tree:

{% Img src="image/admin/iMfgq2xaKVRcXc3LhWW7.png", alt="Component tree", width="800", height="454" %}

`AppComponent` is the root component of the application. Its child components are the two instances of `EmployeeListComponent`. Each instance has a list of items (E<sub>1</sub>, E<sub>2</sub>, etc.) that represent the individual employees in the department.

When the user begins entering the name of a new employee in the input box in an`EmployeeListComponent`, Angular triggers change detection for the entire component tree starting from `AppComponent`. This means that while the user is typing in the text input, Angular is repeatedly recalculating the numeric values associated with each employee to verify that they haven't changed since the last check.

To see how slow this can be, open the [non-optimized version of the project on StackBlitz](https://stackblitz.com/github/mgechev/change-detection-web-dev) and try entering an employee name.

You can verify that the slowdown comes from the `fibonacci` function by setting up the [example project](https://github.com/mgechev/change-detection-web-dev) and opening the **Performance** tab of Chrome DevTools.

{% Instruction 'devtools-performance', 'ol' %}

Now click **Record** <span style="width: 13px;height: 13px;background-color: #6E6E6E;display: inline-block;border-radius: 50%;margin-left: 3px;margin-right: 3px;"></span> (in the top-left corner of the **Performance** panel) and start typing in one of the text boxes in the app. In a few seconds, click **Record** <span style="width: 13px;height: 13px;background-color: #6E6E6E;display: inline-block;border-radius: 50%;margin-left: 3px;margin-right: 3px;"></span> again to stop recording. Once Chrome DevTools processes all the profiling data it collected, you'll see something like this:

{% Img src="image/admin/1rXcCcnM7rLj183jgQCk.png", alt="Performance profiling", width="800", height="276" %}

If there are many employees in the list, this process may block the browser's UI thread and cause frame drops, which leads to a bad user experience.

## Skipping component subtrees

When the user is typing in the text input for the _sales_ `EmployeeListComponent` you know that the data in the _R&D_ department isn't changing—so there's no reason to run change detection on its component. To make sure the R&D instance doesn't trigger change detection, set the `changeDetectionStrategy` of `EmployeeListComponent` to `OnPush`:

```js
import { ChangeDetectionStrategy, ... } from '@angular/core';

@Component({
  selector: 'app-employee-list',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['employee-list.component.css']
})
export class EmployeeListComponent {...}
```

Now when the user types in a text input, change detection is only triggered for the corresponding department:

{% Img src="image/admin/1hUupNUByRDQLyYYvMcX.png", alt="Change detection in a component subtree", width="800", height="462" %}

_You can find this optimization applied to the original application [here](https://github.com/mgechev/change-detection-web-dev/tree/onpush)._

You can read more about the `OnPush` change detection strategy in the [official Angular documentation](https://angular.io/api/core/ChangeDetectionStrategy).

To see the effect of this optimization, enter a new employee in the [application on StackBlitz](https://stackblitz.com/github/mgechev/change-detection-web-dev/tree/onpush).

## Using pure pipes

Even though the change detection strategy for the `EmployeeListComponent` is now set to `OnPush`, Angular still recalculates the numeric value for all employees in a department when the user types in the corresponding text input.

To improve this behavior you can take advantage of [pure pipes](https://angular.io/guide/pipes#pure-and-impure-pipes). Both pure and impure pipes accept inputs and return results that can be used in a template. The difference between the two is that a pure pipe will recalculate its result only if it receives a different input from its previous invocation.

Remember that the app calculates a value to display based on the employee's numeric value, invoking the `calculate` method defined in `EmployeeListComponent`. If you move the calculation to a pure pipe, Angular will recalculate the pipe expression only when its arguments change. The framework will determine if the arguments of the pipe have changed by performing a reference check. This means that Angular won't perform any recalculations unless the numeric value for an employee is updated.

Here's how to move the business calculation to a pipe called `CalculatePipe`:

```js
import { Pipe, PipeTransform } from '@angular/core';

const fibonacci = (num: number): number => {
  if (num === 1 || num === 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
};

@Pipe({
  name: 'calculate'
})
export class CalculatePipe implements PipeTransform {
  transform(val: number) {
    return fibonacci(val);
  }
}
```

The `transform` method of the pipe invokes the `fibonacci` function. Notice that the pipe is pure. Angular will consider all pipes pure unless you specify otherwise.

Finally, update the expression inside of the template for `EmployeeListComponent`:

```html
<mat-chip-list>
  <md-chip>
    {% raw %}{{ item.num | calculate }}{% endraw %}
  </md-chip>
</mat-chip-list>
```

That's it! Now when the user types in the text input associated with any department, the app won't recalculate the numeric value for individual employees.

In the app below you can see how much smoother the typing is!

To see the effect of the last optimization [try this example on StackBlitz](https://stackblitz.com/github/mgechev/change-detection-web-dev/tree/pure-pipe).

_The code with the pure pipe optimization of the original application is available [here](https://github.com/mgechev/change-detection-web-dev/tree/pure-pipe)._

## Conclusion

When facing runtime slowdowns in an Angular app:

1. Profile the application with Chrome DevTools to see where the slowdowns are coming from.
2. Introduce the `OnPush` change detection strategy to prune a component's subtrees.
3. Move heavy computations to pure pipes to allow the framework to perform caching of the computed values.
