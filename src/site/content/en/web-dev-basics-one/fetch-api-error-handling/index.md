---
layout: post
title: Implement error handling when using the Fetch API
description: Catching errors when working with the Fetch API.
authors:
  - umarhansa
date: 2022-05-23
---

This article demonstrates some error handling approaches when working with the [Fetch API](/learn/pwa/serving/). The Fetch API lets you make a request to a remote network resource. When you make a remote network call, your web page becomes subject to a variety of potential network errors.

The following sections describe potential errors and describe how to write code that provides a sensible level of functionality that is resilient to errors and unexpected network conditions. Resilient code keeps your users happy and maintains a standard level of service for your website.

## Anticipate potential network errors

This section describes a scenario in which the user creates a new video named
`"My Travels.mp4"` and then attempts to upload the video to a video-sharing website.

When working with Fetch, it's easy to consider the [happy path](https://en.wikipedia.org/wiki/Happy_path) where the user successfully uploads the video. However, there are other paths that are not as smooth, but for which web developers must plan. Such (unhappy) paths can happen due to user error, through unexpected environmental conditions, or because of a bug on the video-sharing website.

### Examples of user errors

-  The user uploads an image file (such as JPEG) instead of a video file.
-  The user begins uploading the wrong video file. Then, part way through the upload, the user specifies the correct video file for upload.
-  The user accidentally clicks "Cancel upload" while the video is uploading.

### Examples of environmental changes

-  The internet connection goes offline while the video is uploading.
-  The browser restarts while the video is uploading.
-  The servers for the video-sharing website restart while the video is uploading.

### Examples of errors with the video-sharing website

-  The video-sharing website cannot handle a filename with a space. Instead of `"My Travels.mp4"`, it expects a name such as `"My_Travels.mp4"` or `"MyTravels.mp4"`.
-  The video-sharing website cannot upload a video that exceeds the maximum acceptable file size.
-  The video-sharing website does not support the video codec in the uploaded video.

These examples can and do happen in the real world. You may have encountered such examples in the past! Let's pick one example from each of the previous categories, and discuss the following points:

-  What is the default behavior if the video-sharing service cannot handle the given example?
-  What does the user expect to happen in the example?
-  How can we improve the process?

<div class="table-wrapper scrollbar">
<table>
  <thead>
    <tr>
      <th scope="row">Action</th>
      <td>The user begins uploading the wrong video file. Then, part way through the upload, the user specifies the correct video file for upload.</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">What happens by default</th>
      <td>The original file continues to upload in the background while the new file uploads at the same time.</td>
    </tr>
    <tr>
      <th scope="row">What the user expects</th>
      <td>The user expects the original upload to stop so that no extra internet bandwidth is wasted.</td>
    </tr>
    <tr>
      <th scope="row">What can be improved</th>
      <td>JavaScript cancels the Fetch request for the original file before the new file begins to upload.</td>
    </tr>
  </tbody>
</table>
</div>

<div class="table-wrapper scrollbar">
<table>
  <thead>
    <tr>
      <th scope="row">Action</th>
      <th>The user loses their internet connection part way through uploading the video.</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">What happens by default</th>
      <td>The upload progress bar appears to be stuck on 50%. Eventually, the Fetch API experiences a timeout and the uploaded data is discarded. When internet connectivity returns, the user has to reupload their file.</td>
    </tr>
    <tr>
      <th scope="row">What the user expects</th>
      <td>The user expects to be notified when their file cannot be uploaded, and they expect their upload to automatically resume at 50% when they are back online.</td>
    </tr>
    <tr>
      <th scope="row">What can be improved</th>
      <td>The upload page informs the user of internet connectivity issues, and reassures the user that the upload will resume when internet connectivity has resumed.</td>
    </tr>
  </tbody>
</table>
</div>

<div class="table-wrapper scrollbar">
<table>
  <thead>
    <tr>
      <th scope="row">Action</th>
      <th>The video-sharing website cannot handle a filename with a space. Instead of "My Travels.mp4", it expects names such as "My_Travels.mp4" or "MyTravels.mp4".</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">What happens by default</th>
      <td>The user must wait for the upload to completely finish. Once the file is uploaded, and the progress bar reads "100%", the progress bar displays the message: "Please try again."</td>
    </tr>
    <tr>
      <th scope="row">What the user expects</th>
      <td>The user expects to be told of filename limitations before upload begins, or at least within the first second of uploading.</td>
    </tr>
    <tr>
      <th scope="row">What can be improved</th>
      <td>Ideally, the video-sharing service supports filenames with spaces. Alternative options are to notify the user of filename limitations before uploading begins. Or, the video-sharing service should reject the upload with a detailed error message.</td>
    </tr>
  </tbody>
</table>
</div>

## Handle errors with the Fetch API

Note that the following code examples use [top-level `await`](https://v8.dev/features/top-level-await) ([browser support](https://caniuse.com/mdn-javascript_operators_await_top_level)) because this feature can simplify your code.

### When the Fetch API throws errors

This example uses a [`try`/`catch` block](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) statement to catch any errors thrown within the `try` block. For example, if the Fetch API cannot fetch the specified resource, then an error is thrown. Within a `catch` block like this, take care to provide a [meaningful](https://developer.mozilla.org/docs/Glossary/Graceful_degradation) user experience. If a spinner, a common user interface that represents some sort of progress, is shown to the user, then you could take the following actions within a `catch` block:

1. Remove the spinner from the page.
1. Provide helpful messaging that explains what went wrong, and what options the user can take.
1. Based on the available options, present a "Try again" button to the user.
1. Behind the scenes, send the details of the error to your error-tracking service, or to the back-end. This action logs the error so it can be diagnosed at a later stage.

```js
try {
  const response = await fetch('https://website');
} catch (error) {
  // TypeError: Failed to fetch
  console.log('There was an error', error);
}
```

At a later stage, while you diagnose the error that you logged, you can write a [test case](https://en.wikipedia.org/wiki/Test_case) to catch such an error before your users are aware something is wrong. Depending on the error, the test could be a unit, integration, or acceptance test.

### When the network status code represents an error

This code example makes a request to an HTTP testing service that always responds with the HTTP status code [`429 Too Many Requests`](https://developer.mozilla.org/docs/Web/HTTP/Status/429). Interestingly, the response does not reach the `catch` block. A 404 status, amongst certain other status codes, does not return [a network error](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful) but instead resolves normally.

To check that the HTTP status code was successful, you can use any of the following options:

-  Use the [`Response.ok`](https://developer.mozilla.org/docs/Web/API/Response/ok) property to determine whether the status code was in the range from `200` to `299`.
-  Use the [`Response.status`](https://developer.mozilla.org/docs/Web/API/Response/status) property to determine whether the response was successful.
-  Use any other metadata, such as [`Response.headers`](https://developer.mozilla.org/docs/Web/API/Response/headers), to assess whether the response was successful.

```js
try {
  const response = await fetch('https://httpbin.org/status/429');
  // network error in the 4xx–5xx range
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  // use response here if we didn't throw above
  doSomethingWith(response);
} catch (error) {
  console.log(error);
}
```

The best practice is to work with people in your organization and team to understand potential HTTP response status codes. Backend developers, developer operations, and service engineers can sometimes provide unique insight into possible edge cases that you might not anticipate.

{% Aside %}
Note from the author: I was recently scrolling through an infinite scrolling list on a website, trying to quickly reach the bottom. Eventually, the page seemed to break with no helpful messaging. Upon inspecting the network request via DevTools, it became clear that the HTTP status code error `429 Too Many Requests` was returned. In an ideal scenario, such internal errors are surfaced to the web page interface.
{% endAside %}

### When there is an error parsing the network response

This code example demonstrates another type of error that can arise with parsing a response body. The [`Response`](https://developer.mozilla.org/docs/Web/API/Response) interface offers convenient methods to parse different types of data, such as text or JSON. In the following code, a network request is made to an HTTP testing service that returns an HTML string as the response body. However, an attempt is made to parse the response body as [JSON](https://developer.mozilla.org/docs/Web/API/Response/json), throwing an error.

```js
let json;

try {
  const response = await fetch('https://httpbin.org/html');
  json = await response.json();
} catch (error) {
  if (error instanceof SyntaxError) {
    // Unexpected token < in JSON
    console.log('There was a SyntaxError', error);
  } else {
    console.log('There was an error', error);
  }
}

if (json) {
  console.log('Use the JSON here!', json);
}
```

You must prepare your code to take in a variety of response formats, and verify that an unexpected response doesn't break the web page for the user.

Consider the following scenario: You have a remote resource that returns a valid JSON response, and it is parsed successfully with the `Response.json()` method. It may happen that the service goes down. Once down, a [`500 Internal Server Error`](https://developer.mozilla.org/docs/Web/HTTP/Status/500) is returned. If appropriate error-handling techniques are not used during the parsing of JSON, this could break the page for the user because an unhandled error is thrown.

### When the network request must be canceled before it completes

This code example uses an [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController) to cancel an in-flight request. An in-flight request is a network request that has started but has not completed.

The scenarios where you may need to cancel an in-flight request can vary, but it ultimately depends on your use case and environment. The following code demonstrates how to pass an [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal) to the Fetch API. The `AbortSignal` is attached to an `AbortController`, and the `AbortController` includes an [`abort()`](https://developer.mozilla.org/docs/Web/API/AbortController/abort) method, which signifies to the browser that the network request should be canceled.

```js
const controller = new AbortController();
const signal = controller.signal;

// Cancel the fetch request in 500ms
setTimeout(() => controller.abort(), 500);

try {
  const url = 'https://httpbin.org/delay/1';
  const response = await fetch(url, { signal });
  console.log(response);
} catch (error) {
  // DOMException: The user aborted a request.
  console.log('Error: ', error)
}
```

## Conclusion

One important aspect of handling errors is to define the various parts that can go wrong. For each scenario, make sure you have an appropriate fallback in place for the user. With regards to a fetch request, ask yourself questions such as:

-  What happens if the target server goes down?
-  What happens if Fetch receives an unexpected response?
-  What happens if the user's internet connection fails?

Depending on the complexity of your web page, you can also sketch out a flowchart which describes the functionality and user interface for different scenarios.
