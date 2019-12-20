---
layout: post
title: Strategies for Adopting Progressive Web Apps
authors:
  - petelepage
date: 2018-11-05
description: |
  TODO
---

One of the great things about the technology that makes web apps installable and work offline is that they’re designed with progressive enhancement in mind. That means they can be included in your website today, without any changes aside from registering them! Create a basic Web App Manifest, a self-contained offline page, and a Service Worker to cache and serve the offline page, and you’re set! This will provide a very basic offline experience for your users, but the following three strategies can help you provide an even better experience, each with a different level of investment needed.

## Focus on a Feature

After providing a basic offline experience, you can improve upon it by focusing on a feature. Pick one feature that will have a high impact to your users or our business. This will allow you to dip your toes into the pool of Progressive Web Apps without making too many changes at once.

The Weather Channel saw success with this strategy. They had been interested in Progressive Web Apps for quite some time, but they needed to prioritize based on what they believed would be the highest impact for both their users and their business. Because of this, they decided to focus on a single feature first, Web Push Notifications. They rolled it out globally in over 30 languages, allowing their mobile web app users to subscribe to notifications just like their native app users.

![Floating image of Weather Company](https://chrome-enterprise-workshops.firebaseapp.com/pwas/#/42)

## Build a Simple Version

The second strategy is to build a simple version. Take an existing section of your application or a specific user journey, and enhance it as a Progressive Web App. This allows for a low-stakes experiment, allowing you to rethink an experience for your users with Progressive Web Apps in mind from the beginning.

For Air Berlin, they chose to focus on the post-booking experience. They needed to deliver a fast, engaging, reliable experience. They determined their users at the airport require quick access to itinerary details, their boarding pass, and destination information. They rethought this journey as a Progressive Web App, giving them load times of under a second, and even faster for subsequent loads! After a passenger has checked in, they can access their journey details and boarding pass, even when offline.

![Floating image splash of Air Berlin](https://chrome-enterprise-workshops.firebaseapp.com/pwas/#/46)

## Start from the Ground Up

The final strategy requires the most investment; it’s starting from the ground up. If you’re going through a redesign or are able to start from scratch, include Progressive Web Apps as part of that from the start. Doing so enables you to much more easily use Progressive Web App design patterns than the other strategies, in particular allowing you to take advantage of all of the power of Service Workers and the Cache Storage API from the get-to.

Konga is a major e-commerce player in Nigeria. They decided to start from scratch, calling it “Konga EZ”, pronounced “easy”. They had to deliver a full end-to-end web experience that was as fast and reliable as their native iOS and Android apps, and checkout and their catalogue had to work offline.

They focused a lot on minimizing data consumption, which is critical for their users. Comparing data to usage to their native app, initial load took up to 92% less data and data usage to first transaction was 82% less.

![Floating image splash of Konga](https://chrome-enterprise-workshops.firebaseapp.com/pwas/#/46)

## At The Crossroads of Web and Native

Progressive Web Apps provide you with a unique opportunity; they allow you build apps with the reach and control of web apps _and_ most of the capabilities and ease of use and access of native apps. Using Service Workers, the Cache Storage API, and a Web App Manifest, you can make your web app work offline and make it installable and discoverable across mobile and desktop devices. From just a custom offline page to a full redesign, every team’s journey to Progressive Web Apps is different. Yours starts here.
