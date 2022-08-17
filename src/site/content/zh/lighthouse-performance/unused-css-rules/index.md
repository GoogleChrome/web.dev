---
layout: post
title: 删除未使用的 CSS
description: 了解 unused-css-rules 审计。
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - unused-css-rules
---

Lighthouse 报告的“Opportunities（机会）”部分列出了所有未使用 CSS 的样式表，可能节省 2 KiB 或更多。删除未使用的 CSS 以减少网络活动消耗的不必要的字节：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m3WfvnCGJgrC5wqyvyyQ.png", alt="Lighthouse 删除未使用的 CSS 审计的屏幕截图", width="800", height="235" %}</figure>

## 未使用的 CSS 如何降低性能

使用 `<link>` 标签是向页面添加样式的常用方法：

```html
<!doctype html>
<html>
  <head>
    <link href="main.css" rel="stylesheet">
    ...
```

浏览器下载的 `main.css` 文件与使用它的 HTML 分开存储，因此称为外部样式表。

默认情况下，浏览器必须下载、解析并处理它遇到的所有外部样式表，然后才能在用户屏幕上显示或呈现任何内容。浏览器在处理样式表之前尝试显示内容是没有意义的，因为样式表可能包含影响页面样式的规则。

每个外部样式表都必须从网络下载。这些额外的网络传输会显著增加用户在屏幕上看到任何内容之前必须等待的时间。

未使用的 CSS 还会减慢浏览器构建[渲染树](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)的速度。渲染树类似于 DOM 树，不同之处在于渲染树包括每个节点的样式。要构建渲染树，浏览器必须遍历整个 DOM 树，并检查哪些 CSS 规则适用于每个节点。未使用的 CSS 越多，浏览器就可能需要花费更多的时间来计算每个节点的样式。

## 如何检测未使用的 CSS {: #覆盖率 }

借助 Chrome DevTools 的“Coverage（覆盖率）”选项卡，您可以发现关键和非关键 CSS。请参阅[使用 Coverage 选项卡查看已使用和未使用的 CSS](https://developer.chrome.com/docs/devtools/css/reference/#coverage)。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ydgzuclRCAlY2nzrpDmk.png", alt="Chrome DevTools：Coverage 选项卡", width="800", height="407" %} <figcaption> Chrome DevTools：Coverage 选项卡。</figcaption></figure>

您还可以从 Puppeteer 中提取此信息。请参阅 [page.coverage](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagecoverage)。

## 内联关键 CSS 并延迟非关键 CSS

类似于内联 `<script>` 标签中的代码，在 HTML 页面 `head` 的 `<style>` 块中内联首次绘制所需的关键样式。然后使用 `preload` 链接异步加载其余样式。

考虑使用[关键工具](https://github.com/addyosmani/critical/blob/master/README.md)自动化提取和内联“首屏”CSS 的过程。

在[延迟非关键 CSS](/defer-non-critical-css) 中了解更多信息。

## 特定于堆栈的指南

### Drupal

考虑删除未使用的 CSS 规则，只将需要的 Drupal 库附加到页面中的相关页面或组件。有关详细信息，请参阅[定义库](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library)。

### Joomla

考虑减少或切换在页面中加载未使用 CSS 的 [Joomla 扩展](https://extensions.joomla.org/)数量。

### WordPress

考虑减少或切换在页面中加载未使用 CSS 的 [WordPress 插件](https://wordpress.org/plugins/)数量。

## 资源

- [**删除未使用的 CSS** 审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unused-css-rules.js)
