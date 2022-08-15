---
layout: post
title: 背景色和前景色没有足够的对比度
description: 了解如何通过确保所有文本都有足够的颜色对比度来提高网页的可访问性。
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - color-contrast
---

对比度低的文本（即亮度过于接近背景亮度的文本）可能难以阅读。例如，在白色背景上呈现浅灰色文本，使用户难以分辨字符的形状，这会降低阅读理解程度并减慢阅读速度。

虽然这个问题对于视力不佳的人来说尤其具有挑战性，但低对比度的文本会对所有用户的阅读体验产生负面影响。例如，如果您曾经在户外使用移动设备阅读过某些内容，那么您可能已经体验到需要具有足够对比度的文本。

## Lighthouse 颜色对比度审计为何失败

Lighthouse 会将背景色和前景色对比度不足的文本标记出来：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hD4Uc22QqAdrBLdRPhJe.png", alt="显示背景色和前景色对比度不足的 Lighthouse 审计", width="800", height="343" %}</figure>

Lighthouse 使用 <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">WCAG 2.1 的成功标准 1.4.3</a> 来评估文本的颜色对比度：

- 18 pt 或 14 pt 加粗的文本需要的对比度为 3:1。
- 所有其他文本需要的的对比度为 4.5:1。

由于审计的性质，Lighthouse 无法检查叠加在图像上的文本的颜色对比度。

{% Aside 'caution' %} 在 2.1 版中，WCAG 扩展了其颜色对比度要求，[加入了用户界面元素和图像](https://www.w3.org/TR/WCAG21/#non-text-contrast)。Lighthouse 不会检查这些元素，但您应该手动检查以确保您的整个站点可供视力不佳的人访问。 {% endAside %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何保证文本有足够的颜色对比度

确保页面上的所有文本都符合 <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum" rel="noopener">WCAG 指定</a>的最低颜色对比度：

- 18 pt 或 14 pt 加粗的文本为3:1
- 所有其他文本为 4.5:1

一种找到满足对比度要求的颜色的方法是使用 Chrome DevTools 的颜色选取器：

1. 右键单击（在 Mac 上按住 `Command` 键单击）要检查的元素，然后选择 **Inspect** （检查）。
2. 在 **Elements**（元素）窗格的 **Styles**（样式）选项卡中，找到 `color` 值。
3. 单击值旁边的颜色缩略图。

颜色选取器会告诉您该元素是否符合颜色对比度要求，同时考虑字体大小和粗细：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/osaU6NOcyElBALiXmRa5.png", alt="突出显示颜色对比度信息的 Chrome DevTools 颜色选取器屏幕截图", width="298", height="430" %}</figure>

您可以使用颜色选取器来调整颜色，直到其对比度足够高。在 HSL 颜色格式中进行调整最简单。单击选取器右侧的切换按钮切换到该格式：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uUGdLr7fYCrmqtCrtpJK.png", alt="突出显示颜色格式切换的 Chrome DevTools 颜色选择器屏幕截图", width="298", height="430"%}</figure>

获得传递的颜色值后，更新项目的 CSS。

更复杂的情况，例如渐变上的文本或图像上的文本，需要手动检查，UI 元素和图像也是如此。对于图像上的文本，您可以使用 DevTools 的背景颜色选择器来检查文本出现的背景：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PFznOtjzMF3nZy3IsCtW.png", alt="带背景颜色选取器的 Chrome DevTools 的屏幕截图", width="301", height="431" %}</figure>

对于其他情况，请考虑使用 Paciello Group 的 <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Color Contrast Analyzer  </a> 之类的工具。

## 资源

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/color-contrast.js" rel="noopener" class=""><strong class="_active_edit_href">背景色和前景色对比度不足</strong>审计的源代码</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/color-contrast" rel="noopener">文本元素必须与背景有足够的颜色对比度 (Deque University)</a>
- <a href="https://developer.paciellogroup.com/resources/contrastanalyser" rel="noopener">Colour Contrast Analyser</a>
