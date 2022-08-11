---
layout: post
title: 延迟加载图像
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: 本文解释了延迟加载，以及在延迟加载图像时可用的选项。
tags:
  - performance
  - images
feedback:
  - api
---

通过在 HTML 中将图像作为 `<img>` 元素内联，或用作 CSS 背景图像，可以在网页上显示图像。在本文中，您将了解如何延迟加载这两种类型的图像。

## 内嵌图像 {: #images-inline }

最常见的延迟加载图像是在 `<img>` 元素中使用的图像。对于内嵌图像，我们有三个延迟加载选项，可以组合使用以实现跨浏览器的最佳兼容性：

- [使用浏览器级延迟加载](#images-inline-browser-level)
- [使用 Intersection Observer（交叉观察器）](#images-inline-intersection-observer)
- [使用滚动和调整大小事件处理程序](#images-inline-event-handlers)

### 使用浏览器级延迟加载 {: #images-inline-browser-level }

Chrome 和 Firefox 都支持通过 `loading` 属性实现延迟加载。此属性可以添加到 `<img>` 元素中，也可以添加到 `<iframe>` 元素中。 `lazy` 会值告诉浏览器，如果图像位于时区，则立即加载图像，并在用户滚动到它们附近时获取其他图像。

{% Aside %} 请注意，`<iframe loading="lazy">` 目前还不是标准规范。虽然已经在 Chromium 中得到了应用，但它还没有设立规范，并且以后可能会出现改动。我们建议在它纳入规范前，不要使用 `loading` 属性延迟加载 iframe。 {% endAside %}

有关浏览器支持的详细信息，请参阅 MDN [浏览器兼容性](https://developer.mozilla.org/docs/Web/HTML/Element/img#Browser_compatibility)表的 `loading`字段。如果浏览器不支持延迟加载，则该属性将被忽略，图像将像往常一样立即加载。

对于大多数网站，将此属性添加到内嵌图像能够提高性能，并避免用户加载那些他们可能永远不会看到的图像。如果您的网站有大量图像，并希望确保那些使用不支持延迟加载的浏览器用户受益，那么需要将其与下面说明的方法之一结合起来。

要了解更多信息，请查看[Web 的浏览器级延迟加载](/browser-level-image-lazy-loading/)。

### 使用 Intersection Observer {: #images-inline-intersection-observer }

为填充 `<img>` 元素的延迟加载，我们使用 JavaScript 来检查它们是否位于视区。若位于视区，则会向它们的 `src` （有时是`srcset` ）属性填充那些指向所需图像内容的 URL。

如果您之前写过延迟加载代码，那么可能已经通过使用诸如 `scroll` 或 `resize` 之类的事件处理程序来完成任务。虽然这种方法在各大浏览器之间的兼容性最好，但现代浏览器提供了一种性能更高、效率更高的方法，通过 [Intersection Observer API](https://developer.chrome.com/blog/intersectionobserver/) 来完成检查元素可见性的工作。

{% Aside %} 并非所有浏览器都支持 Intersection Observer，尤其是 IE11 及更低版本。如果跨浏览器的兼容性至关重要，请务必阅读[下一节](#images-inline-event-handlersy)，它将向您展示如何使用性能较低（但兼容性更好）的滚动和调整大小事件处理程序延迟加载图像。 {% endAside %}

相较于依赖各种事件处理程序的代码，Intersection Observer 更易于使用和阅读，因为您只需注册一个观察器即可观察元素，无需编写繁琐的元素可见性检测代码。剩下的工作就是决定当元素可见时要执行何种操作。我们来为延迟加载的 `<img>` 元素假设这个基本的标记模式：

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="I'm an image!">
```

您应该关注此标记的三个相关部分：

1. `class` 属性，这是您将在 JavaScript 中选择元素的属性。
2. `src` 属性，它会引用页面首次加载时将出现的占位符图像。
3. `data-src` 和 `data-srcset` 属性，它们是占位符属性，包含元素出现在视区中后将加载图像的 URL。

现在让我们看看如何在 JavaScript 中使用 Intersection Observer 通过这种标记模式延迟加载图像：

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});
```

在文档的 `DOMContentLoaded` 事件中，此脚本查询 DOM 中所有 `lazy` 类的 `<img>` 元素。如果 Intersection Observer 可用，创建一个新的观察器，当 `img.lazy` 元素进入视区时运行回调。

{% Glitch { id: 'lazy-intersection-observer', path: 'index.html', previewSize: 0 } %}

Intersection Observer 适用于所有现代浏览器。因此，将其用作 `loading="lazy"` 的 polyfill 将确保大多数访问者都可以使用延迟加载。

## CSS 中的图像 {: #images-css }

虽然 `<img>` 标签是在网页上使用图像的最常见方式，但也可以通过 CSS [`background-image`](https://developer.mozilla.org/docs/Web/CSS/background-image) 属性（和其他属性）调用图像。浏览器级的延迟加载不适用于 CSS 背景图片，因此如果您有要延迟加载的背景图片，那么需要考虑其他方法。

与 `<img>` 元素那种无论可见性如何都会加载的情况不同，CSS 中的图像加载行为需要通过更多的推测来完成。在构建[文档和 CSS 对象模型](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model)以及[渲染树](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)时，浏览器会在请求外部资源之前检查文档的 CSS 应用方式。如果浏览器确定涉及外部资源的 CSS 规则不适用于当前构建的文档，那么浏览器不会请求该资源。

通过使用 JavaScript 来确定元素何时出现在视区内，然后对那个元素应用一个会调用背景图像的类，可以使用此推测行为来延迟 CSS 中的图像加载。这会根据需要下载图像，而不是在初始加载时下载图像。例如，让我们以一个包含大幅英雄背景图片的元素为例：

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

`div.lazy-background` 元素通常包含由某些 CSS 调用的英雄背景图像。但是，在这个延迟加载示例中，您可以通过对视区中的元素添加`visible` 类来隔离 `div.lazy-background`元素的`background-image` 属性。

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Placeholder image */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* The final image */
}
```

从这里开始，请使用 JavaScript 来检查元素是否位于视区中（使用 Intersection Observer！），然后在元素位于视区时将 `visible` 类添加到`div.lazy-background` 元素中，这时会加载图像：

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```

{% Glitch { id: 'lazy-background', path: 'index.html', previewSize: 0 } %}

## 延迟加载库 {: #libraries }

以下库可用于延迟加载图像。

- [lazysizes](https://github.com/aFarkas/lazysizes) 是一个功能齐全的延迟加载库，可以延迟加载图像和 iframe。它使用的模式与本文中的代码示例非常相似，因为它会自动绑定到 `<img>` 元素上 `lazyload` 类，并要求您在 `data-src` 和/或 `data-srcset` 属性中指定图像的 URL，并将其内容分别交换至 `src` 和/或 `srcset`属性。它使用 Intersection Observer（可以对其进行 polyfill），并可以使用[许多插件](https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo)进行扩展来执行诸如延迟加载视频之类的操作。[了解有关使用 lazysizes 的更多信息](/use-lazysizes-to-lazyload-images/)。
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) 是用于延迟加载图像、背景图像、视频、iframe 和脚本的轻量级选项。它利用 Intersection Observer，支持响应式图像，并能开启浏览器级的延迟加载。
- [lozad.js](https://github.com/ApoorvSaxena/lozad.js) 是另一个仅使用 Intersection Observer 的轻量级选项。因此它的性能很好，但需要先进行 polyfill 然后才能在较旧的浏览器上使用。
- [yall.js](https://github.com/malchata/yall.js) 是一个使用 Intersection Observer 并回退到事件处理程序的库。它与 IE11 和主要浏览器都兼容。
- 如果您需要使用 React 特定的延迟加载库，请考虑 [react-lazyload](https://github.com/jasonslyvia/react-lazyload) 。虽然它不使用 Intersection Observer，但*确实*为那些习惯于使用 React 开发应用程序的人提供了一种熟悉的延迟加载图像方法。
