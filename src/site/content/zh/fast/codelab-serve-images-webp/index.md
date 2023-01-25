---
layout: codelab
title: 使用命令行创建 WebP 图片
authors:
  - katiehempenius
description: |2-

  在此 Codelab 中，了解如何使用 WebP 提供优化的图片。
date: 2018-11-05
glitch: webp-cli
related_post: serve-images-webp
tags:
  - performance
---

已经为您安装了 webp <a href="https://developers.google.com/speed/webp/docs/precompiled">命令行工具</a>，您可以立即开始使用。此工具可以将 JPG、PNG 和 TIFF 图片转换为 WebP 格式。

## 将图片转换为 WebP

{% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

1. 输入以下命令：

```bash
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

此命令以 `50` 的质量（`0` 最差；`100` 最佳）转换 `images/flower1.jpg` 文件并将其保存为 `images/flower1.webp`。

{% Aside %}您想知道为什么要输入 `cwebp` 而不是 `webp` 吗？WebP 有两个单独的命令分别用于 WebP 图片的编码和解码。`cwebp` 将图片编码为 WebP，而 `dwebp` 则将图片从 WebP 解码。 {% endAside %}

执行此操作后，您应该在控制台中看到如下内容：

```bash
Saving file 'images/flower1.webp'
File:      images/flower1.jpg
Dimension: 504 x 378
Output:    29538 bytes Y-U-V-All-PSNR 34.57 36.57 36.12   35.09 dB
           (1.24 bpp)
block count:  intra4:        750  (97.66%)
              intra16:        18  (2.34%)
              skipped:         0  (0.00%)
bytes used:  header:            116  (0.4%)
             mode-partition:   4014  (13.6%)
 Residuals bytes  |segment 1|segment 2|segment 3|segment 4|  total
    macroblocks:  |      22%|      26%|      36%|      17%|     768
      quantizer:  |      52 |      42 |      33 |      24 |
   filter level:  |      16 |       9 |       6 |      26 |
```

您刚刚成功将图片转换为 WebP。

但是，像这样一次对一张图片运行 `cwebp` 命令，转换许多图片将需要很长时间。如果您需要这样做，您可以改为使用脚本。

- 在控制台中运行此脚本（不要忘记反撇号）：

```bash
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

此脚本以 `50` 的质量转换 `images/` 目录中的所有文件，并将它们保存为同一目录中的新文件（文件名相同，但文件扩展名为 `.webp`）。

### ✔︎ 签入

您的 `images/` 目录中现在应该有 6 个文件：

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

接下来，更新此 Glitch，向支持它的浏览器提供 WebP 图片。

## 使用 `<picture>` 标签添加 WebP 图片

利用 `<picture>` 标签可向较新的浏览器提供 WebP，同时保持对旧浏览器的支持。

- 在 `index.html` 中将 `<img src="images/flower1.jpg"/>` 替换为下列 HTML：

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

- 接下来，使用 `<picture>` 标记替换 `flower2.jpg` 和 `flower3.png` 的 `<img>` 标记。

### ✔︎ 签入

完成后，`index.html` 的 `<picture>` 标签应如下所示：

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower2.webp">
  <source type="image/jpeg" srcset="images/flower2.jpg">
  <img src="images/flower2.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower3.webp">
  <source type="image/png" srcset="images/flower3.png">
  <img src="images/flower3.png">
</picture>
```

接下来，使用 Lighthouse 验证您是否在站点上正确地实施了 WebP 图片。

## 利用 Lighthouse 验证 WebP 使用情况

利用 Lighthouse 的 **Serve images in next-gen formats**（以下一代格式提供图片）性能审计可以了解是否站点上的所有图片都在使用诸如 WebP 的下一代格式。

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. 验证是否通过了**以下一代格式提供图片**审计。

{% Img src="image/admin/Y8x0FLWs1Xsf32DX20DG.png", alt="在 Lighthouse 中通过'以下一代格式提供图片'审计", width="701", height="651" %}

成功！现在，您在站点上提供的便是 WebP 图片。
