---
title: Gathering data
description: >
  Learn how to measure and analyze your form.
authors:
  - michaelscharnagl
date: 2021-11-03
---

In this module, you learn how to define goals, analyze your forms, measure changes, 
and get notified about new issues.

## Ensure you identify issues, problems, and goals

As a first step, you need a way to identify issues and goals. 
One way is to use [analytics](/learn/forms/testing/#analytics) 
to get an overview of where your form may need improvements. 

After analytics is up and running for your site, 
you can monitor 
[bounce rate](https://support.google.com/analytics/answer/1009409?hl=en) 
and other metrics for every page with a form within your site. 
If the bounce rate is high, users may be leaving your site without submitting the form. 
There are many potential reasons why this happens: 
for example, the form may be too complicated, or it's unclear what data should be entered.

{% Aside %}
Always respect the privacy of your users, with analytics data as well as form data. 
Collect the minimum amount of data you require and be transparent with your users about what data you are collecting. 
There are also 
[privacy and data protection laws](/learn/forms/security-privacy/#help-users-access-their-personal-data) that you must follow. 
In some countries, you need consent from a user before you can collect data. 
{% endAside %}

To get a clearer picture of a high bounce rate, you can define 
[goals](https://support.google.com/analytics/answer/1012040) 
to identify in detail where users leave your form.

A [goal funnel](https://support.google.com/analytics/answer/1012040?hl=en&ref_topic=6150889#funnels_for_destination_goals&zippy=%2Cin-this-article)
 (or _conversion funnel_) is a series of interactions that lead to a goal such as a completed purchase (a _conversion_). 
 Each goal funnel consists of individual steps such as opening a shopping cart page or proceeding to a checkout page.

The goal funnel for your form might look like this:

1. The user opens page A with the form.
1. The user fills out the name field.
1. The user fills out the postal code field.
1. The user submits the form.
1. The user navigates to page B. 

Goal funnels can give you an overview of where users leave your form, and where you need to improve it.

As well as using analytics to track page metrics such as time-on-page or exit rates, 
you can also monitor [events](https://support.google.com/analytics/answer/1033068?hl=en#zippy=%2Cin-this-article). 
These allow you to track individual interactions, 
such as button clicks or interactions with form fields. 
For example, you can set up a [custom event](https://developers.google.com/analytics/devguides/collection/analyticsjs/events), 
which fires when a user fills out a specific `<input>`. 
Or you can track the percentage of your users who submit a form. 

## Analyze your forms

You can create custom events for almost every interaction, and monitor form completion step-by-step. 
This isn't always necessary though: 
it's better to start with a small number of custom events, 
and only add more if you need more details to find an issue with your form.

Focus first on the most important goals, such as successful checkout. 
You can always expand your goals later if more details are needed. 
Identify your main goals, measure achievement of these goals, analyze the data, identify potential changes, 
adapt your form and measure again.

## Ensure that you fix problems with your form

Say you identified an issue with your form. What should you do next? 
First, you need to correct the issue and deploy a new version of your form. 
After some days, it's now time to measure how effective the change was.

Did the bounce rate decrease for your form? 
Great, now look at the goal funnel to see which parts improved. 
Are a high proportion of users still leaving before they fill in the postal code, for example? 
Adapt your goal funnel steps if necessary, deploy further changes, 
and analyze your form again until you are happy with the outcome.

## Get notified when there are problems

How can you get notified about potential issues without constantly checking your analytics dashboard? 
You can set up [alerts](https://support.google.com/analytics/answer/1033021). 
A common alert is about traffic drops. 
You can monitor your form pages, and get notified when the traffic is unusually low for a day. 
Or, coming back to bounce rates, you can set up an alert if the bounce rate for a page increases significantly.

Alerts help you identify issues fast, and ensure you don't miss new problems with your form.

Want to get a summary of your site's analytics? You can create 
[reports](https://support.google.com/analytics/answer/1010054), 
and get notified via email. This is a good way to monitor form usage.

## Resources

- [Google Analytics: Bounce rates](https://support.google.com/analytics/answer/1009409?hl=en)
- [Google Analytics: Alerts](https://support.google.com/analytics/answer/1033021)
- [Google Analytics: Event measuring](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
