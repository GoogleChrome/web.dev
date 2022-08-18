---
layout: post
title: "<video> 和 <source> 标签"
authors:
  - samdutton
  - joemedley
  - derekherman
description: 您已经为 Web 正确准备了视频文件，也为其设置了正确的尺寸和分辨率，甚至还创建了适用于不同浏览器的单独 WebM 和 MP4 文件。为了让用户能够观看，您仍然需要为其添加一个网页。
date: 2014-02-15
updated: 2021-07-05
tags:
  - media
---

您为 Web [正确准备了视频文件](/prepare-media/)，也为其设置了正确的尺寸和分辨率，甚至还创建了适用于不同浏览器的单独 WebM 和 MP4 文件。

为了让用户观看视频，您仍需要将其添加到网页中。正确执行此操作需要添加两个 HTML 元素：[`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video) 和 [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) 元素。除有关这些标签的基础知识外，本文还阐述了为了打造良好的用户体验，需要添加到这些标签的属性。

{% Aside %} 您随时可以选择将文件上传到 [YouTube](https://www.youtube.com/) 或 [Vimeo](https://vimeo.com)。在许多情况下，这比本文所描述的过程更可取。这些服务可以为您处理格式和文件类型转换，并提供了在网页中嵌入视频的方法。如果要自己管理，请继续阅读。{% endAside %}

## 指定单个文件

您可以单独使用 video 元素，但建议不要这样做。请始终使用 `type` 属性，如下所示。浏览器使用它来确定是否可以播放提供的视频文件。如果不能，则显示包含的文本。

```html
<video src="chrome.webm" type="video/webm">
    <p>Your browser cannot play the provided video file.</p>
</video>
```

### 指定多个文件格式

回想一下[媒体文件基础知识](/media-file-basics/)，并非所有浏览器都支持相同的视频格式。`<source>` 元素允许您指定多种格式作为备用，以防用户的浏览器不支持其中一种。

下面的示例将生成在后文中用作示例的嵌入视频。

```html
<video controls>
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4" type="video/mp4">
  <p>Your browser cannot play the provided video file.</p>
</video>
```

[在 Glitch 上试用一下](https://track-demonstration.glitch.me)（[源代码](https://glitch.com/edit/#!/track-demonstration)）

{% Aside %} 请注意，前面的示例中引入了 `controls` 属性。它会指示浏览器允许用户控制视频播放，包括音量、定位，选择字幕和暂停/恢复播放等。{% endAside %}

尽管可选，但您始终要将 `type` 属性添加到 `<source>` 标签事件。这样可以确保浏览器只下载能够播放的文件。

与提供不同的 HTML 或服务器端脚本相比，这种方法有几个优点，尤其是在移动设备上：

- 您可以按偏好顺序列出格式。
- 客户端切换减少延迟；只发出一个请求来获取内容。
- 让浏览器选择格式比使用具有用户代理检测的服务器端支持数据库更简单快速，而且可能更可靠。
- 指定每个文件源的类型可以提高网络性能；浏览器可以选择视频源，无需下载部分视频来“嗅探”格式。

这些问题在移动环境下尤其重要。在这种环境下，带宽和延迟非常重要，而且用户的耐心可能有限。当多个来源具有不支持的类型时，省略 `type` 属性可能影响性能。

您有几种方法可以深入了解详细信息。查看 [A Digital Media Primer for Geeks](https://www.xiph.org/video/vid1.shtml) 可了解有关视频和音频如何在 Web 上工作的更多信息。您还可以使用 DevTools 中的[远程调试](https://developer.chrome.com/docs/devtools/remote-debugging/)来比较具有[类型属性和](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/notype.html)和[没有类型属性](https://googlesamples.github.io/web-fundamentals/fundamentals/media/video-main.html)的网络活动。

{% Aside 'caution' %} 请务必检查浏览器开发人员工具中的响应标头，以[确保服务器报告正确的 MIME 类型](https://developer.mozilla.org/en/docs/Properly_Configuring_Server_MIME_Types)；否则视频源类型检查将不起作用。{% endAside %}

### 指定开始和结束时间

节省带宽并改善网站响应性：利用媒体片段为视频元素添加开始和结束时间。

<figure>
  <video controls width="100%">
    <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm#t=5,10" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4#t=5,10" type="video/mp4">
    <p>该浏览器不支持视频元素。</p>
  </source></source></video></figure>

要使用媒体片段，请将 `#t=[start_time][,end_time]` 添加到媒体 URL。例如，要播放从 5 秒到 10 秒的视频，请指定：

```html
<source src="video/chrome.webm#t=5,10" type="video/webm">
```

您还可以使用 `<hours>:<minutes>:<seconds>` 来指定时间。例如，`#t=00:01:05` 将在一分五秒时开始播放视频。要仅播放视频的第一分钟，请指定 `#t=,00:01:00`。

您可以使用此功能在同一视频上提供多个视图（例如 DVD 中的提示点），而无需编码和提供多个文件。

要让此功能起作用，您的服务器必须支持范围请求并启用该功能。默认情况下，大多数服务器会启用范围请求。由于某些托管服务会将其关闭，因此，您要确认范围请求可用于在您的站点上使用片段。

幸运的是，您可以在浏览器开发人员工具中执行此操作。例如，在 Chrome 中，它位于[“网络”面板](https://developer.chrome.com/docs/devtools/#network)中。请查找 `Accept-Ranges` 标头并验证它是否显示 `bytes`。在下图中，我将标头上画了一个红色框。如果您没有看到 `bytes` 值，则需要联系您的托管服务提供商。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/20DlLyicG5PAo6TXBKh3.png", alt="Chrome DevTools 截屏：Accept-Ranges: bytes。", width="800", height="480" %}<figcaption> Chrome DevTools 截屏：Accept-Ranges: bytes。</figcaption></figure>

### 包含海报图像

将 poster 属性添加到 `video` 元素，以便查看者可以在加载元素后立即了解内容，而无需下载视频或开始播放。

```html
<video poster="poster.jpg" ...>
  …
</video>
```

如果视频 `src` 遭到损坏或不支持任何提供的视频格式，海报也可以作为备用。海报图像的唯一缺点是需要额外的文件请求，它会消耗一些带宽，并且需要进行渲染。有关详细信息，请参阅[有效的编码图像](/uses-optimized-images/)。

<div class="w-columns">{% Compare 'worse' %}<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R8VNeplKwajJhOuVkPDT.png", alt="没有备用海报，只能看到视频未显示。", width="360", height="600" %}</figure>
</div>
<p data-md-type="paragraph">{% CompareCaption %} 如果没有备用海报，则只能看到视频未显示。{% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html"><figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rNhydHVGeL2P0sQ0je5k.png", alt="备用海报看起来就像获取了视频的第一帧。", width="360", height="600" %}</figure></div>
<p data-md-type="paragraph">{% CompareCaption %} 备用海报看起来就像获取了视频的第一帧。{% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

### 确保视频不溢出容器

当视频元素对视口来说太大时，它们可能会溢出容器，导致用户无法看到内容或使用控件。

<div class="w-columns">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cDl2OfCE3hQivhaNvMUh.png", alt="Android Chrome 截屏，纵向：无样式的视频元素溢出视口。", width="338", height="600" %}<figcaption>Android Chrome 截屏，纵向：无样式的视频元素溢出视口。</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bCiZsNkZNsAhWbOBsLCs.png", alt="Android Chrome 截屏，横向：无样式的视频元素溢出视口。", width="800", height="450" %}<figcaption> Android Chrome 截屏，横向：无样式的视频元素溢出视口。</figcaption></figure>
</div>

您可以使用 CSS 控制视频尺寸。如果 CSS 不能满足您的所有需求，JavaScript 库和插件（如 [FitVids](http://fitvidsjs.com/) ，本文不做讨论）可以提供帮助，即便是来自 YouTube 和其他来源的视频，也是如此。不幸的是，这些资源会增加[网络负载大小](/total-byte-weight/)，从而对您的收入和用户的费用产生负面影响。

对于本文介绍了这些简单用途，可利用 [CSS 媒体查询](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#css-media-queries)来根据视口尺寸指定元素的大小；`max-width: 100%` 就非常合适。

对于 iframe 中的媒体内容（例如 YouTube 视频），请尝试响应式方法（例如 [John Surdakowski 提出的方法](http://avexdesigns.com/responsive-youtube-embed/)）。

{% Aside 'caution' %} 请勿强制调整元素大小，导致[宽高比](https://www.google.com/search?q=aspect+ratio&oq=aspect+ratio&aqs=chrome..69i57j35i39j0l6.1896j0j7&sourceid=chrome&ie=UTF-8)与原始视频不同。视频压扁或拉伸后效果会很糟糕。{% endAside %}

#### CSS

```css
.video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 0;
    height: 0;
    overflow: hidden;
}

.video-container iframe,
.video-container object,
.video-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

#### HTML

```html
<div class="video-container">
  <iframe src="//www.youtube.com/embed/l-BA9Ee2XuM"
          frameborder="0" width="560" height="315">
  </iframe>
</div>
```

试用一下

对比[响应示例](https://googlesamples.github.io/web-fundamentals/fundamentals/media/responsive_embed.html)与[非响应版本](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/unyt.html)。如您所见，非响应版本的用户体验不佳。

### 设备方向

对于桌面显示器或笔记本电脑来说，设备方向不是问题，但是，当考虑为移动设备和平板电脑设计网页时，这一点非常重要。

iPhone 上的 Safari 可以很好地切换纵向和横向模式：

<div class="w-columns">
<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AmHneDShMOioWZwYG2kF.png", alt="iPhone 上的 Safari 中播放的视频截屏，纵向。", width="338", height="600" %} <figcaption>iPhone 上的 Safari 中播放视频截屏，纵向。</figcaption></figure><figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MZwkLJaXVk4g8lruhiKZ.png", alt="iPhone 上的 Safari 中播放的视频截屏，横向。", width="600", height="338" %} <figcaption>iPhone 上的 Safari 中播放的视频截屏，横向。</figcaption></figure>
</div>

iPad 上的设备方向和 Android 上的 Chrome 都可能有问题。例如，在不进行任何自定义的情况下，iPad 上横向播放的视频可能如下所示：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9FsExgY6cJFfMkxOPNkl.png", alt="iPad 上的 Safari 中播放的视频截屏，横向。", width="600", height="450" %} <figcaption>iPad 上的 Safari 中播放的视频截屏，横向。</figcaption></figure>

使用 CSS 设置视频 `width: 100%` 或 `max-width: 100%` 可以解决许多设备的方向布局问题。

### 自动播放

`autoplay` 属性用于控制浏览器是否立即下载和播放视频。它的具体工作方式取决于平台和浏览器。

- Chrome：取决于多个因素，包括但不限于是否在桌面上查看，以及移动用户是否已将网站或应用添加到主屏幕。有关详细信息，请参阅[自动播放最佳实践](/autoplay-best-practices/)。

- Firefox：阻止所有视频和声音，但允许用户为所有或特定站点放宽这些限制。有关详细信息，请参阅[在 Firefox 中允许或阻止媒体自动播放](https://support.mozilla.org/kb/block-autoplay)

- Safari：过去一直需要用户手势操作，但最近的版本放宽了这一要求。有关详细信息，请参阅 [iOS 上的新 &lt;video&gt; 策略](https://webkit.org/blog/6784/new-video-policies-for-ios/)。

即使在可以自动播放的平台上，您也需要考虑启用此功能是否合适：

- 数据使用可能费用高昂。
- 在用户需要之前播放媒体会占用带宽和 CPU，从而导致页面渲染延迟。
- 用户可能处于播放视频或音频会造成干扰的环境中。

### 预载

`preload` 属性用于向浏览器提供关于要预先加载多少信息或内容的提示。

<table class="responsive">
  <thead>
    <tr>
      <th>值</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-th="Value"><code>none</code></td>
      <td data-th="Description">用户可能选择不观看视频，因此不要预先加载任何内容。</td>
    </tr>
    <tr>
      <td data-th="Value"><code>metadata</code></td>
      <td data-th="Description">元数据（持续时间、尺寸、文本轨道）应预先加载，但尽量不要预先加载视频。</td>
    </tr>
    <tr>
      <td data-th="Value"><code>auto</code></td>
      <td data-th="Description">认为立即下载整个视频可行。空字符串会产生相同的结果。</td>
    </tr>
  </tbody>
</table>

在不同的平台上，`preload` 属性的效果不同。例如，在桌面上，Chrome 会缓存 25 秒的视频，但是，在 iOS 或 Android 上则不缓存。这意味着在移动设备上可能出现播放启动延迟的情况，而在桌面上则不会发生。有关更多详细信息，请参阅[利用音频和视频预载快速播放](/fast-playback-with-preload/)或 [Steve Souders 的博客](https://www.stevesouders.com/blog/2013/04/12/html5-video-preload/)。

现在，您已经了解了如何将媒体添加到网页中，可以开始学习[媒体可访问性](/media-accessibility/)了，您将了解为了让有听力障碍的用户观看，或者当播放音频不可行时，如何为视频添加字幕。
