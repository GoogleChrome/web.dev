---
layout: post
title: 没有为地址栏设置主题颜色
description: 了解如何为渐进式 Web 应用设置地址栏主题颜色。
web_lighthouse:
  - themed-omnibox
date: 2019-05-04
updated: 2020-06-17
---

通过设置浏览器地址栏的主题，来匹配您的[渐进式 Web 应用 (PWA)](/discover-installable) 的品牌颜色，提供更加身临其境的用户体验。

## 浏览器兼容性

在撰写本文时，基于 Android 的浏览器已支持为浏览器地址栏设置主题。请参阅[浏览器兼容性](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility)了解更新信息。

## Lighthouse 主题颜色审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记出没有为地址栏设置主题的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="Lighthouse 审计显示地址栏的颜色与页面颜色不匹配", width="800", height="98" %}</figure>

如果 Lighthouse 没有找到页面的 HTML 中的`theme-color`元标记和 [web 应用清单中的](/add-manifest)`theme_color`属性，则审计将失败。

请注意，Lighthouse 不会测试这些值是否为有效的 CSS 颜色值。

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 如何为地址栏设置主题颜色

### 第 1 步：将`theme-color`元标记添加到您想要品牌化的每个页面

通过`theme-color`元标记，当用户将您的网站作为普通网页访问时，地址栏会带有品牌标识。将标签的`content`属性设置为任何有效的 CSS 颜色值：

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

在 Google[对 Android 版 Chrome 39 中的`theme-color`的支持中](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)了解有关`theme-color`元标记的更多信息。

### 第 2 步：将`theme_color`属性添加到您的 web 应用清单

Web 应用清单中的`theme_color`属性，可确保在用户从主屏幕启动您的 PWA 时对地址栏进行品牌化。与`theme-color`元标记不同，您只需要在[清单](/add-manifest)中定义一次。将该属性设置为任何有效的 CSS 颜色值：

```html/1
{
  "theme_color": "#317EFB"
  …
}
```

浏览器会根据清单中的`theme_color`为应用的每个页面设置地址栏颜色。

## 资源

- [**没有为地址栏设置主题颜色**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/themed-omnibox.js)
- [添加 web 应用清单](/add-manifest)
- [对 Android 版 Chrome 39 中的`theme-color`](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android) 的支持
