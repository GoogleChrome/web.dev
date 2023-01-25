---
title: JavaScript Promises：简介
subhead: Promise 简化了延迟和异步计算。Promise 代表一个尚未完成的操作。
description: Promise 简化了延迟和异步计算。Promise 代表一个尚未完成的操作。
date: 2013-12-16
updated: 2021-01-18
tags:
  - javascript
authors:
  - jakearchibald
feedback:
  - api
---

诸位开发同仁，请准备迎接 Web 开发史上的重大时刻。

<em>[鼓声响起来]</em>

Promise 已经来到了 JavaScript！

<em>[璀璨的烟花在天上亮起，五彩纸屑纷纷落下，人们为之疯狂]</em>

此时此刻，您会是下列几种人之一：

- 大家在周围欢呼，但您根本不知道这是为了什么。也许您甚至不知道这个 promise 到底是什么东西。您耸了耸肩，但肩上却感到了五彩纸屑的重量。假如是这样，请别担心，我花了很长时间才弄清楚它的重要性。您可能想[从头](#whats-all-the-fuss-about)开始了解。
- 您兴奋地挥出一拳！可算等到了！您之前已经用过这些 Promise，但让人苦恼的是，所有的实现都采用略有不同的 API。官方 JavaScript 版本的 API 是什么？您可能想从[术语](#promise-terminology)开始。
- 您对它已经有所了解了，对那些上蹿下跳的新人嗤之以鼻。花点时间享受下您的优越感，然后直接前往 [API 参考](#promise-api-reference)吧。

## 有什么好大惊小怪的？ {: #whats-all-the-fuss-about }

JavaScript 是单线程的，这意味着不能同时运行两个脚本；它们必须依次运行。在浏览器中，JavaScript 与许多其他内容共享一个线程，而这些内容因浏览器而异。不过 JavaScript 通常与绘画、更新样式和处理用户操作（例如突出显示文本和与表单控件交互）在同一个队列中。这些事件中的活动会推迟其他事件。

人类则是多线程的。您可以使用多个手指打字，一边开车一边聊天。唯一的麻烦是打喷嚏，因为打喷嚏时必须暂停所有当前活动。这一点很烦人，尤其是当您开车在并试图聊天时。您不想写出黏糊糊的代码。

您可能已经在用事件和回调来解决这个问题了。事件如下：

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // woo yey image loaded
});

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

这一点也不赖嘛。我们获取图像，添加几个侦听器，然后可以在调用其中一个侦听器前停止 JavaScript 的执行。

遗憾的是，在上面的例子中，事件可能在我们开始侦听它们之前就发生了，所以我们需要使用图像的 complete 属性来解决这个问题：

```js
var img1 = document.querySelector('.img-1');

function loaded() {
  // woo yey image loaded
}

if (img1.complete) {
  loaded();
}
else {
  img1.addEventListener('load', loaded);
}

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

这不会获取在我们有机会聆听它们之前就出错的图像；遗憾的是，DOM 并没有给我们提供解决的办法。此外，这还只是加载一张图片。如果我们想知道一组图像在何时加载，情况就会变得更加复杂。

## 事件并非万能

事件对可以在同一个对象上发生多次的活动是个好东西，比如 `keyup` ， `touchstart` 等。有了那些事件，就无需在添加侦听器前了解到底发生了什么事。但在涉及到异步成功/失败时，理想情况下，您需要用到下列代码：

```js
img1.callThisIfLoadedOrWhenLoaded(function() {
  // loaded
}).orIfFailedCallThis(function() {
  // failed
});

// and…
whenAllTheseHaveLoaded([img1, img2]).callThis(function() {
  // all loaded
}).orIfSomeFailedCallThis(function() {
  // one or more failed
});
```

这就是 Promise 的作用，但命名更好了。假如 HTML 图像元素有一个返回 promise 的 ready 方法，我们可以这样做：

```js
img1.ready()
.then(function() {
  // loaded
}, function() {
  // failed
});

// and…
Promise.all([img1.ready(), img2.ready()])
.then(function() {
  // all loaded
}, function() {
  // one or more failed
});
```

从本质看，promise 有点像事件监听器，只不过：

- Promise 只能成功或失败一次。它不能成功或失败两次，也不能从成功切换到失败，反之亦然。
- 如果 Promise 成功或失败，并且您稍后添加成功/失败回调，则将调用正确的回调，即使该事件发生的时间更早。

这对于异步成功/失败非常有用，因为您对某些操作的确切时间没兴趣，反而对结果的反应更感兴趣。

## Promise 术语 {: #promise-terminology }

[Domenic Denicola](https://twitter.com/domenic) 校对阅读了本文的初稿，并评价我的术语根本不及格。他把我关了起来，罚我抄了 100 遍的《[States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)》，还给我的父母写了一封信表示担忧。尽管如此，我仍然弄混了很多术语，但下面列出了基本知识：

Promise 可以是：

- **已完成**- 与 promise 相关的操作成功
- **已拒绝**- 与 promise 相关的操作失败
- **待定**- 尚未完成或已拒绝
- **已解决**- 已完成或已拒绝

[本规范](https://www.ecma-international.org/ecma-262/#sec-promise-objects)还使用术语 **thenable** 来描述一个拥有 `then` 方法的类 promise 对象。这个术语总是让我想起前英格兰足球经理 [Terry Venables](https://en.wikipedia.org/wiki/Terry_Venables)，所以我会尽量少用它。

## Promise 来到了 JavaScript！

Promise 已经以库的形式出现了一段时间，例如：

- [Q](https://github.com/kriskowal/q)
- [when](https://github.com/cujojs/when)
- [WinJS](https://msdn.microsoft.com/en-us/library/windows/apps/br211867.aspx)
- [RSVP.js](https://github.com/tildeio/rsvp.js)

以上列出的库和 JavaScript Promise 共享一个通用的标准化行为，称之为 [Promises/A+](https://github.com/promises-aplus/promises-spec) 。如果您是 jQuery 用户，它们也有一个叫做 [Deferreds](https://api.jquery.com/category/deferred-object/) 的类似行为。然而，Deferreds 与 Promise/A+ 并不兼容，这使得它们[略有不同，而且用途更少](https://thewayofcode.wordpress.com/tag/jquery-deferred-broken/)，所以要小心。 jQuery 也有一个 [Promise 类型](https://api.jquery.com/Types/#Promise)，但它只是 Deferred 的一个子集，并且存在同样的问题。

尽管 promise 实现遵循标准化行为，但它们的整体 API 各不相同。 JavaScript promise 在 API 方面与 RSVP.js 类似。下面列出了创建 promise 的方法：

```js
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

promise 构造函数使用了一个参数，一个带有两个参数 resolve 和 reject 的回调。在回调中执行一些操作，比如异步；然后如果一切顺利，就调用 resolve，否则会调用 reject。

与 JavaScript 中的 `throw` 类似，使用 Error 对象拒绝是一种常见而非必须的做法。使用 Error 对象的好处在于它们可以捕获堆栈跟踪，从而更好地发挥调试工具的作用。

下面列出了使用 promise 的方法：

```js
promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```

`then()`有两个参数，一个成功案例的回调，另一个是失败案例的回调。这两者都是可选项，因此您只能为成功案例或失败案例添加回调。

JavaScript promise 在 DOM 中最初叫做 Futures，后来改名为 Promises，并最终进入了 JavaScript。在 JavaScript 中使用它们比在 DOM 中使用更好，因为它们可用于非浏览器 JS 上下文中，例如 Node.js（至于是否在其核心 API 中使用，则是另一个问题了）。

尽管它们是 JavaScript 的功能，但 DOM 也可以使用。事实上，所有具有异步成功/失败方法的新 DOM API 都将使用 Promise。这在 [Quota Management](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html#idl-def-StorageQuota) 、[Font Load Events](http://dev.w3.org/csswg/css-font-loading/#font-face-set-ready) 、[ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/cf459d473ae09f6994e8539113d277cbd2bce939/service_worker.ts#L17) 、[Web MIDI](https://webaudio.github.io/web-midi-api/#widl-Navigator-requestMIDIAccess-Promise-MIDIOptions-options) 和 [Streams](https://github.com/whatwg/streams#basereadablestream) 等中已经很常见了。

## 浏览器支持和 polyfill

现在，浏览器已经中实现了 promise。

从 Chrome 32、Opera 19、Firefox 29、Safari 8 和 Microsoft Edge 开始，promises 是默认开启的。

若要使缺乏完整 promise 实现的浏览器符合规范，或将 promise 添加到其他浏览器和 Node.js 中，请查看[polyfill](https://github.com/jakearchibald/ES6-Promises#readme) (2k gzipped)。

## 与其他库的兼容性

JavaScript promise API 会将任何使用 `then()` 方法的对象当做类 promise（或者在 promise 中叫 `thenable`，*唉*）来处理，所以如果您使用返回 Q promise 的库，也没关系，它将与新的 JavaScript promise 良好兼容。

不过就像我之前说得那样，jQuery 的 Deferreds 的作用不大。但幸好您可以将它们转换为标准 promise，而这值得尽快完成：

```js
var jsPromise = Promise.resolve($.ajax('/whatever.json'))
```

在这里，jQuery 的`$.ajax`返回一个 Deferred。因为它使用了一个 `then()` 方法， `Promise.resolve()` 可以把它变成 JavaScript promise。但是，有时 deferred 会向其回调传递多个参数，例如：

```js
var jqDeferred = $.ajax('/whatever.json');

jqDeferred.then(function(response, statusText, xhrObj) {
  // ...
}, function(xhrObj, textStatus, err) {
  // ...
})
```

而 JS promise 会忽略除第一个之外的所有参数：

```js
jsPromise.then(function(response) {
  // ...
}, function(xhrObj) {
  // ...
})
```

值得庆幸的是，这通常是您想要的结果，或者至少可以让您访问想要的内容。另外请注意，jQuery 不遵循将 Error 对象传递给拒绝的约定。

## 将复杂的异步代码简单化

好吧，我们来写些代码。比方说，我们想要：

1. 启动一个旋转器，表明正在加载的过程
2. 为一个故事获取几个 JSON，为我们提供标题以及每章的 url
3. 给页面添加标题
4. 获取每一章
5. 将故事添加到页面
6. 停止旋转器

……但也要告诉用户中途是否出现问题。假如出现问题，我们也需要在那时停止旋转器，否则它会继续旋转，并与其他用户界面发生冲突。

当然，您不会使用 JavaScript 来传递故事，[因为使用 HTML 会更快](https://jakearchibald.com/2013/progressive-enhancement-is-faster/)，但这种模式在处理 API 时很常见：多次获取数据，然后在所有数据获取完毕后执行操作。

首先，让我们处理从网络获取数据：

## 将 XMLHttpRequest Promise 化

如果可能采取向后兼容的方式，那么可以更新旧的 API 来使用 Promise。 `XMLHttpRequest` 是一个主要的候选对象，但同时让我们写一个简单的函数来发出 GET 请求：

```js
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}
```

现在让我们使用它：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
})
```

现在我们可以在不手动输入 `XMLHttpRequest` 的情况下发出 HTTP 请求，这一点非常好，因为越少看到`XMLHttpRequest` 的驼峰式大小写，我就会越快乐。

## 链接

`then()` 并不是故事的结尾，您可以将 `then` 链接起来，来进行转换值或依次运行其他异步操作。

### 转换值

您可以简单地通过返回新值来转换值：

```js
var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
})
```

作为一个实际的例子，让我们回到：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
})
```

响应是 JSON，但我们目前以纯文本形式接收它。我们可以改变 get 函数以使用 JSON [`responseType`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest#responseType) ，但同时也可以在 promise 领域解决它：

```js
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
})
```

由于 `JSON.parse()` 使用一个参数并返回一个转换后的值，我们可以创建一个快捷方式：

```js
get('story.json').then(JSON.parse).then(function(response) {
  console.log("Yey JSON!", response);
})
```

事实上，我们可以很容易地生成 `getJSON()` 函数：

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

`getJSON()` 依然会返回一个 promise，它获取一个 url，然后将响应解析为 JSON。

### 队列异步操作

您还可以链接`then`以按顺序运行异步操作。

当 `then()` 回调返回结果时，这有些神奇。如果返回的是一个值，那么将使用该值调用下一个 `then()`。但如果返回的是类 promise 的内容，那么下一个 `then()` 会等待它，并且仅在该 promise 解决（成功/失败）时调用。例如：

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  console.log("Got chapter 1!", chapter1);
})
```

在这里，我们向 `story.json` 发出一个异步请求，它为我们提供了一组要请求的 URL，然后我们请求其中第一个 URL。就是在这时候，promise 开始从简单的回调模式中脱颖而出。

您甚至可以生成一个获取章节的快捷方法：

```js
var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

// and using it is simple:
getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1);
}).then(function(chapter) {
  console.log(chapter);
})
```

在调用 `getChapter` 之前，我们不用下载 `story.json`。但接下来调用 `getChapter` 的时候，我们可以重复使用故事的 promise，所以只用获取一次 `story.json`。Promise，真棒！

## 错误处理

正如之前看到的， `then()` 有两个参数，分别表示成功和失败（promises 的术语叫做完成和拒绝）：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
})
```

您还可以使用 `catch()` ：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
})
```

`catch()` 并没有任何特别之处，只是 `then(undefined, func)` 的添加剂，但它的可读性更好。请注意，上面的两个代码示例中的行为不同，后者等效于：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).then(undefined, function(error) {
  console.log("Failed!", error);
})
```

这种差异很微妙，但非常有用。 当出现拒绝回调（或 `catch()` ，因为它是等效的）时，promise 拒绝会跳到下一个 `then()`。这时会调用 `then(func1, func2)` 、`func1` 或 `func2`，但不会同时调用两个。但是对于 `then(func1).catch(func2)`，如果 `func1` 拒绝，两者都会被调用，因为它们是链中的单独步骤。采取以下措施：

```js
asyncThing1().then(function() {
  return asyncThing2();
}).then(function() {
  return asyncThing3();
}).catch(function(err) {
  return asyncRecovery1();
}).then(function() {
  return asyncThing4();
}, function(err) {
  return asyncRecovery2();
}).catch(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})
```

上面的流程与普通的 JavaScript try/catch 流程非常相似，在 try 中发生的错误会立即进入 `catch()` 块。这是上面的流程图（因为我喜欢流程图）：

<div style="position: relative; padding-top: 93%;">
  <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden"
   src="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/simQvoUExWisIW0XxToH.svg" | imgix }}" frameborder="0" allowtransparency="true"></iframe>
</div>

蓝线通往完成的 promise，红线通往拒绝的 promise。

### JavaScript 异常和 promise

当明确拒绝 promise 时就会出现拒绝，此外，当在构造函数回调中引发错误时，也会暗示出现拒绝：

```js
var jsonPromise = new Promise(function(resolve, reject) {
  // JSON.parse throws an error if you feed it some
  // invalid JSON, so this implicitly rejects:
  resolve(JSON.parse("This ain't JSON"));
});

jsonPromise.then(function(data) {
  // This never happens:
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

这意味着在 Promise 构造函数回调中完成所有与 Promise 相关的工作非常有用，这样一来，错误会被自动捕获并变成拒绝。

在 `then()` 回调中引发的错误也是如此。

```js
get('/').then(JSON.parse).then(function() {
  // This never happens, '/' is an HTML page, not JSON
  // so JSON.parse throws
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

### 实践中的错误处理

对于故事和章节，可以使用 catch 向用户显示错误：

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Failed to show chapter");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

如果获取 `story.chapterUrls[0]` 失败（例如 http 500 或用户离线），它将跳过所有后续的成功回调，其中包括尝试将响应解析为 JSON 的 `getJSON()`，同时还会跳过将 chapter1.html 添加到页面的回调。相反，它移动到 catch 回调。因此，如果之前的任何操作均失败，那么”无法显示章节“将添加到页面中。

和 JavaScript 的 try/catch 一样，捕捉错误后，将继续执行后续代，所以旋转器总是隐藏的，这正是我们想要的结果。以上变成了下列代码的非阻塞异步版本：

```js
try {
  var story = getJSONSync('story.json');
  var chapter1 = getJSONSync(story.chapterUrls[0]);
  addHtmlToPage(chapter1.html);
}
catch (e) {
  addTextToPage("Failed to show chapter");
}
document.querySelector('.spinner').style.display = 'none'
```

您可能只想将 `catch()` 用于记录目的，而不从错误中恢复。为此，只需重新引发错误即可。我们可以在 `getJSON()` 方法中做到这一点：

```js
function getJSON(url) {
  return get(url).then(JSON.parse).catch(function(err) {
    console.log("getJSON failed for", url, err);
    throw err;
  });
}
```

我们成功获取了一章，但我们想要所有的章节。现在就来解决这个问题。

## 并行和排序：两者兼得

考虑异步并非易事。如果您正在努力摆脱困境，请尝试把它当成同步的来编写代码。在这种情况下：

```js
try {
  var story = getJSONSync('story.json');
  addHtmlToPage(story.heading);

  story.chapterUrls.forEach(function(chapterUrl) {
    var chapter = getJSONSync(chapterUrl);
    addHtmlToPage(chapter.html);
  });

  addTextToPage("All done");
}
catch (err) {
  addTextToPage("Argh, broken: " + err.message);
}

document.querySelector('.spinner').style.display = 'none'
```

{% Glitch { id: 'promises-sync-example', height: 480 } %}

成功了！但它是同步的，并在下载内容时锁定了浏览器。为了使这项工作变成异步的，我们使用 `then()` 使事件依次发生。

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // TODO: for each url in story.chapterUrls, fetch & display
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

但如何遍历章节 url 并按顺序获取它们呢？这样**行不通**：

```js
story.chapterUrls.forEach(function(chapterUrl) {
  // Fetch chapter
  getJSON(chapterUrl).then(function(chapter) {
    // and add it to the page
    addHtmlToPage(chapter.html);
  });
})
```

`forEach` 不是异步感知的，所以章节会按照它们的下载的顺序出现，这基本上就是电影《低俗小说》的写作方式。可我们不是在写剧本，所以得解决这个问题。

### 创建序列

我们想把 `chapterUrls` 数组变成一个 promise 序列。可以使用 `then()` 实现：

```js
// Start off with a promise that always resolves
var sequence = Promise.resolve();

// Loop through our chapter urls
story.chapterUrls.forEach(function(chapterUrl) {
  // Add these actions to the end of the sequence
  sequence = sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
})
```

这是我们第一次看到 `Promise.resolve()` ，它可创建一个可解析为您赋予它任何值的 promise。如果您传递给它一个 `Promise` 实例，它会返回该实例（**注意：**这是对规范的一个更改，某些实现尚未遵循）。如果您向它传递一些类 `Promise`（拥有 `then()` 方法），它会创建一个真正的 Promise，以相同的方式完成/拒绝。如果您传入任何其他值，例如 `Promise.resolve('Hello')` ，它会创建一个满足该值的 promise。如果您不用任何值调用它，如上所述，它将以“未定义”来完成。

另外还有 `Promise.reject(val)` ，它创建了一个拒绝您赋予值（或未定义）的 promise。

我们可以使用 [`array.reduce`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 整理上面的代码：

```js
// Loop through our chapter urls
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // Add these actions to the end of the sequence
  return sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve())
```

这与前面的示例相同，但不需要单独的 sequence 变量。为数组中的每个项目调用我们的 reduce 回调。第一次调用时，sequence 是 `Promise.resolve()` ，但对于其余的调用，sequence 是我们从上一次调用返回的任何内容。`array.reduce` 对于将数组简化为单个值非常有用，在这种情况下这个值就是 promise。

现在把它放在一起：

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  return story.chapterUrls.reduce(function(sequence, chapterUrl) {
    // Once the last chapter's promise is done…
    return sequence.then(function() {
      // …fetch the next chapter
      return getJSON(chapterUrl);
    }).then(function(chapter) {
      // and add it to the page
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-example', height: 480 } %}

好了，这就是同步版本的完全异步版本。但我们可以做得更好。目前页面的下载方式如下：

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

浏览器非常擅长一次下载多个内容，因此依次下载章节会损失性能。我们的目标是同时下载它们，并且全部下载完毕后进行处理。幸好有一个合适的 API：

```js
Promise.all(arrayOfPromises).then(function(arrayOfResults) {
  //...
})
```

`Promise.all` 使用一个数组的 promise，并所有 promise 成功完成后创建一个已完成的 promise。您会以传入的 promise 相同的顺序获得一系列结果（无论 promise 完成到什么程度）。

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Take an array of promises and wait on them all
  return Promise.all(
    // Map our array of chapter urls to
    // an array of chapter json promises
    story.chapterUrls.map(getJSON)
  );
}).then(function(chapters) {
  // Now we have the chapters jsons in order! Loop through…
  chapters.forEach(function(chapter) {
    // …and add to the page
    addHtmlToPage(chapter.html);
  });
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened so far
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-all-example', height: 480 } %}

根据连接情况，这可能比逐个加载快几秒钟，并且比第一次尝试使用的代码更少。章节可以按任何顺序下载，但它们会以正确的顺序出现在屏幕上。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

但是，我们仍然可以提高感知性能。当第一章下载完毕时，我们应该将其添加到页面中。这让用户可以在其余章节下载完毕之前开始阅读。当第三章到达时，我们不会将其添加到页面中，因为用户可能没有意识到第二章还未准备好。当第二章到来时，我们就可以添加第二章和第三章了，以此类推。

为此，我们同时为所有章节获取 JSON，然后创建一个序列将它们添加到文档中：

```js
getJSON('story.json')
.then(function(story) {
  addHtmlToPage(story.heading);

  // Map our array of chapter urls to
  // an array of chapter json promises.
  // This makes sure they all download in parallel.
  return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
      // Use reduce to chain the promises together,
      // adding content to the page for each chapter
      return sequence
      .then(function() {
        // Wait for everything in the sequence so far,
        // then wait for this chapter to arrive.
        return chapterPromise;
      }).then(function(chapter) {
        addHtmlToPage(chapter.html);
      });
    }, Promise.resolve());
}).then(function() {
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-best-example', height: 480 } %}

就这样，两全其美！交付所有内容所需的时间相同，但用户会更快地获得第一个内容。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

在这个小例子中，所有章节大约在同一时间到达，但一次显示一个章节的优势将被更多、更大的章节放大。

[使用 Node.js 样式的回调或事件](https://gist.github.com/jakearchibald/0e652d95c07442f205ce)执行上述操作大约会有两倍的代码量，但更重要的是，它的遵循难度更高。然而，Promise 的故事还没有结束，当与其他 ES6 特性结合时，它们会变得更加容易。

## 奖励回合：扩展能力

自从我最初写这篇文章以来，使用 Promise 的能力已经得到了极大的扩展。从 Chrome 55 开始，异步函数允许以同步方式编写基于 Promise 的代码，但不会阻塞主线程。您可以在[我的异步函数](/async-functions)一文中查看更多相关信息。主流浏览器都广泛支持 Promise 和 async 函数。您可以在 MDN 的 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) 和 [异步函数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)参考中找到详细信息。

非常感谢 Anne van Kesteren、Domenic Denicola、Tom Ashworth、Remy Sharp、Addy Osmani、Arthur Evans 和 Yutaka Hirano，他们校对了本文并提出了更正/建议。

另外，感谢 [Mathias Bynens](https://mathiasbynens.be/) 对本文[多个部分](https://github.com/html5rocks/www.html5rocks.com/pull/921/files)的更新工作。
