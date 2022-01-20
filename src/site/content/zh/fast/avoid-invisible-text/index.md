---
layout: post
title: 在字体加载期间避免不可见的文本
authors:
  - katiehempenius
description: 字体通常是需要一段时间才能加载完毕的大文件。为了解决这个问题，部分浏览器会在字体加载完毕前隐藏文本（“不可见文本的闪现”）。如果您在优化性能，可能会想避免“不可见文本闪现”，并使用系统字体立即向用户显示内容。
date: 2018-11-05
codelabs:
  - codelab-avoid-invisible-text
tags:
  - performance
feedback:
  - api
---

## 为什么要关注这一问题？

字体通常是需要一段时间才能加载完毕的大文件。为了解决这个问题，部分浏览器会在字体加载完毕前隐藏文本（“不可见文本的闪现”）。如果您在优化性能，可能会想避免“不可见文本闪现”，并使用系统字体立即向用户显示内容（“无风格文本的闪现”）。

## 立即显示文本

本指南概述了实现此目的的两种方法：第一种方法非常简单，但没有通用浏览器[支持](https://caniuse.com/#search=font-display)；第二种方法需要更多的工作，但具有完整的浏览器支持。对您来说，最好的选择是您将实际实施和维护的那个方法。

## 选项 1：使用 font-display

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>之前</th>
        <th>之后</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td>
<code>@font-face {
  font-family: Helvetica;
  &lt;strong&gt;font-display: swap;&lt;/strong&gt;
}
</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)是用于指定字体显示策略的 API。`swap`告诉浏览器使用该字体的文本应立即使用系统字体进行显示。自定义字体准备就绪后，系统字体就会被换掉。

如果浏览器不支持`font-display` ，那么它将继续遵循其加载字体的默认行为。点击[这里](https://caniuse.com/#search=font-display)查看有哪些浏览器支持`font-display` 。

这些是常见浏览器的默认 font-loading 行为：

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>浏览器</strong></th>
        <th><strong>如果字体未准备好，则默认行为是...</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Edge</td>
        <td>在字体准备好之前使用系统字体。替换字体。</td>
      </tr>
      <tr>
        <td>Chrome</td>
        <td>隐藏文本，最多 3 秒。如果文本还没有准备好，使用系统字体直到字体准备好。替换字体。</td>
      </tr>
      <tr>
        <td>火狐</td>
        <td>隐藏文本，最多 3 秒。如果文本还没有准备好，使用系统字体直到字体准备好。替换字体。</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>隐藏文本直到字体准备好。</td>
      </tr>
    </tbody>
  </table>
</div>

## 选项 2：在自定义字体被加载完毕前，一直等待

只需要多做一些工作，就可以在所有浏览器上实现相同的行为。

这种方法分为三个部分：

- 不要在刚开始加载页面时使用自定义字体。这样可确保浏览器立即使用系统字体显示文本。
- 检测何时会加载自定义字体。有了[FontFaceObserver](https://github.com/bramstein/fontfaceobserver)库，通过几行 JavaScript 代码就可以实现该功能。
- 更新页面样式来使用自定义字体。

为了实现该功能，您需要进行以下更改：

- 重构 CSS，从而在刚开始加载页面时不使用自定义字体。
- 将脚本添加到页面。该脚本会检测自定义字体何时加载，然后更新页面样式。

{% Aside 'codelab' %}[使用 Font Face Observer 立即显示文本](/codelab-avoid-invisible-text)。 {% endAside %}

## 验证

运行 Lighthouse 以验证站点是否使用`font-display: swap`来显示文本：

{% Instruction 'audit-performance', 'ol' %}

确认**确保在 webfont 加载期间文本保持可见**审计通过。
