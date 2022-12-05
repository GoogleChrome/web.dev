---
layout: post
title: 点击目标大小不当
description: |2-

  了解“点击目标大小不当”Lighthouse 审计。
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - tap-targets
---

点击目标是网页上用户通过触摸设备可以与之互动的区域。按钮、链接和表单元素都有点击目标。

许多搜索引擎根据页面对移动设备的友好程度对页面进行排名。确保点击目标足够大，并且彼此相距足够远，可使您的页面更适合移动设备并更容易访问。

## Lighthouse 点击目标审计失败的原因

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会将点击目标太小或相距太近的页面标记出来：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="显示大小不合适的点击目标的 Lighthouse 审计", width="800", height="206" %}</figure>

小于 48 像素 x 48 像素或间距小于 8 像素的目标不能通过审计。审计失败时，Lighthouse 会将结果列出在一个三列的表格中：

<div class="table-wrapper scrollbar">
  <table>
    <tbody>
      <tr>
        <td><strong>点按目标</strong></td>
        <td>大小不合适的点击目标。</td>
      </tr>
      <tr>
        <td><strong>尺寸</strong></td>
        <td>目标的边界矩形的大小（以像素为单位）。</td>
      </tr>
      <tr>
        <td><strong>重叠目标</strong></td>
        <td>哪些其他点击目标（如果有）相距过近。</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## 如何修复您的点击目标

**第 1 步：**增加过小的点击目标的大小。 48 像素乘 48 像素的点击目标永远不会审计失败。如果您有不应该以更大尺寸*显示*的元素（例如，图标），请尝试增加 `padding` 属性：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="大小适当的点击目标", width="800", height="419" %}<figcaption>使用 <code>padding</code> 使点击目标变大而不改变元素的外观。</figcaption></figure>

**第 2 步：** 使用诸如 `margin` 的属性增加距离太近的点击目标之间的间距。点击目标之间应该至少有 8 像素的距离。

## 资源

- [可访问的点击目标](/accessible-tap-targets)：有关如何确保您的点击目标可供所有用户访问的更多信息。
- [**点击目标大小不当**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/tap-targets.js)
