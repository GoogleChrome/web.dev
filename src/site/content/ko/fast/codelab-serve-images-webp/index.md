---
layout: codelab
title: 명령줄을 사용하여 WebP 이미지 만들기
authors:
  - katiehempenius
description: 이 코드랩에서는 WebP를 사용하여 최적화된 이미지를 제공하는 방법을 알아봅니다.
date: 2018-11-05
glitch: webp-cli
related_post: 서브 이미지 WebP
tags:
  - performance
---

webp <a href="https://developers.google.com/speed/webp/docs/precompiled">명령줄 도구</a>가 이미 설치되었으므로 시작할 준비가 되었습니다. 이 도구는 JPG, PNG 및 TIFF 이미지를 WebP로 변환합니다.

## 이미지를 WebP로 변환

{% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

1. 다음 명령을 입력합니다.

```bash
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

이 명령은 품질 `50` ( `0`이 최악, `100`이 최고)으로 `images/flower1.jpg` 파일을 변환하고 `images/flower1.webp`로 저장합니다.

{% Aside %} `webp` 대신 왜  `cwebp`를 입력했는지 궁금하십니까? WebP에는 WebP 이미지를 인코딩 및 디코딩하기 위한 두 가지 별도의 명령이 있습니다. `cwebp`는 이미지를 WebP로 인코딩하고, `dwebp`은 WebP에서 이미지를 디코딩합니다. {% endAside %}

이 작업을 수행한 후 콘솔에 다음과 같은 내용이 표시되어야 합니다.

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

이미지를 WebP로 성공적으로 변환했습니다.

그러나 `cwebp` 명령으로 한 번에 한 이미지씩 실행하면 많은 이미지를 변환하는 데 오랜 시간이 걸립니다. 이 작업을 수행해야 하는 경우 스크립트를 대신 사용할 수 있습니다.

- 콘솔에서 이 스크립트를 실행하세요(역따옴표를 잊지 마세요).

```bash
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

이 스크립트는 품질 `50`으로 `images/` 디렉터리의 모든 파일을 변환하고 동일한 디렉터리에 새 파일(같은 파일 이름이지만 `.webp` 파일 확장명을 가짐)로 저장합니다.

### ✔︎ 체크인

`images/` 디렉터리에 6개의 파일이 있어야 합니다.

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

다음으로, 이 Glitch를 업데이트하여 WebP 이미지를 지원하는 브라우저에 제공합니다.

## `<picture>` 태그를 사용하여 WebP 이미지 추가

`<picture>` 태그를 사용하면 이전 브라우저에 대한 지원을 유지하면서 최신 브라우저에 WebP를 제공할 수 있습니다.

- `index.html` `<img src="images/flower1.jpg"/>`를 다음 HTML로 바꿉니다.

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

- 다음으로, `flower2.jpg` 및 `flower3.png`에 대한 `<img>` 태그를 `<picture>` 태그로 교체합니다.

### ✔︎ 체크인

완료되면 `index.html`의 `<picture>` 태그는 다음과 같아야 합니다.

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

그런 다음 Lighthouse를 사용하여 사이트에서 WebP 이미지를 올바르게 구현했는지 확인합니다.

## Lighthouse로 WebP 사용 확인

Lighthouse의 **차세대 형식의 이미지 제공** 성능 감사를 통해 사이트의 모든 이미지가 WebP와 같은 차세대 형식을 사용하고 있는지 알 수 있습니다.

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. **차세대 형식의 이미지 제공** 감사가 통과되었는지 확인합니다.

{% Img src="image/admin/Y8x0FLWs1Xsf32DX20DG.png", alt="Lighthouse에서 '차세대 형식의 이미지 제공' 감사 통과", width="701", height="651" %}

성공! 이제 사이트에서 WebP 이미지를 제공하고 있습니다.
