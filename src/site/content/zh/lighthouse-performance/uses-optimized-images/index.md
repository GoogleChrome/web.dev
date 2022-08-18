---
layout: post
title: 对图像进行高效编码
description: 了解 uses-optimized-images 审计。
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-optimized-images
---

Lighthouse 报告的 Opportunities 部分列出了所有未优化的图像，以及可能节省的空间（以[千字节 (KiB)](https://en.wikipedia.org/wiki/Kibibyte) 为单位）。优化这些图像，使页面加载速度更快并消耗更少的数据：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="Lighthouse 对图像进行高效编码审计的截图", width="800", height="263" %}</figure>

## Lighthouse 如何将图像标记为可优化

Lighthouse 会收集页面上的所有 JPEG 或 BMP 图像，将每个图像的压缩级别设置为 85，然后将原始版本与压缩版本进行比较。如果可以节省 4KiB 或更大空间，Lighthouse 会将该图像标记为可优化。

## 如何优化图像

可以采取许多步骤来优化图像，包括：

- [使用图像 CDN](/image-cdns/)
- [压缩图像](/use-imagemin-to-compress-images)
- [用视频替换动画 GIF](/replace-gifs-with-videos)
- [延迟加载图像](/use-lazysizes-to-lazyload-images)
- [提供响应式图像](/serve-responsive-images)
- [提供尺寸正确的图像](/serve-images-with-correct-dimensions)
- [使用 WebP 图像](/serve-images-webp)

## 使用 GUI 工具优化图像

另一种方法是通过安装在计算机上并以 GUI 形式运行的优化器来优化图像。例如，使用 [ImageOptim](https://imageoptim.com/mac)，将图像拖放到其 UI 中，然后它会自动压缩图像而不会明显影响质量。如果您正在运行一个小型网站并且可以处理手动优化的所有图像，这个选项可能已经足够好了。

[Squoosh](https://squoosh.app/) 是另一个选择。Squoosh 由 Google Web DevRel 团队维护。

## 程序栈特定的指南

### Drupal

考虑使用[一个模块](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search)来自动优化并减少通过网站上传的图像的大小，同时保持质量。此外，确保对网站上呈现的所有图像使用 Drupal 的内置[响应式图像样式](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8)（在 Drupal 8 及更高版本中提供）。

### Joomla

考虑使用[图像优化插件](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance)来压缩图像，同时保持质量。

### Magento

考虑使用[可优化图像的第三方 Magento 扩展](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image)。

### WordPress

考虑使用[图像优化 WordPress 插件](https://wordpress.org/plugins/search/optimize+images/)来压缩图像，同时保持质量。

## 资源

- [**高效编码图像**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-optimized-images.js)
