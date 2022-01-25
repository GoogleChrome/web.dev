---
layout: post
title: WebP 이미지 사용
authors:
  - katiehempenius
description: WebP 이미지는 JPEG 및 PNG 이미지보다 작습니다. 일반적으로 파일 크기가 25~35% 감소합니다. 이렇게 하면 페이지 크기가 줄어들고 성능은 향상됩니다.
date: 2018-11-05
updated: 2020-04-06
codelabs:
  - 서브 이미지 WebP
tags:
  - performance
feedback:
  - api
---

## 왜 신경을 써야 할까요?

WebP 이미지는 JPEG 및 PNG 이미지보다 작습니다. 일반적으로 파일 크기가 25~35% 감소합니다. 이렇게 하면 페이지 크기가 줄어들고 성능은 향상됩니다.

- YouTube는 WebP 미리 보기 이미지로 전환하면 [페이지 로드 속도가 10% 빨라진다는 것](https://www.youtube.com/watch?v=rqXMwLbYEE4)을 발견했습니다.
- 페이스북은 WebP 사용으로 전환했을 때 JPEG의 경우 파일 크기가 25~35% 감소하고 PNG의 경우 파일 크기가 80% 감소하는 효과를 [경험했습니다](https://code.fb.com/android/improving-facebook-on-android/).

WebP는 JPEG, PNG 및 GIF 이미지를 훌륭하게 대체합니다. 또한 WebP는 무손실 및 손실 압축을 모두 제공합니다. 무손실 압축은 데이터가 손실되지 않습니다. 손실 압축은 파일 크기를 줄이지만 이미지 품질을 저하시킬 수 있습니다.

## 이미지를 WebP로 변환

사람들은 일반적으로 이미지를 WebP로 변환하기 위해 [cwebp 명령줄 도구](https://developers.google.com/speed/webp/docs/using) 또는 [Imagemin WebP 플러그인](https://github.com/imagemin/imagemin-webp) (npm 패키지) 중 하나를 사용합니다. Imagemin WebP 플러그인은 일반적으로 프로젝트에서 빌드 스크립트나 빌드 도구(예: Webpack 또는 Gulp)를 사용하는 경우 가장 좋은 선택인 반면 CLI는 간단한 프로젝트에 적합하거나 이미지를 한 번만 변환해야 하는 경우에 적합합니다.

이미지를 WebP로 변환할 때 다양한 압축 설정을 지정할 수 있는 옵션이 있지만 대부분의 사람들에게 있어 가장 신경 써야 할 것은 품질 설정뿐입니다. 0(최악)에서 100(최상) 사이의 품질 수준을 지정할 수 있습니다. 이미지 품질과 필요에 맞는 파일 크기 사이의 적절한 균형이 어느 수준인지 찾는 것에 열중할 가치가 있습니다.

### cwebp 사용

cwebp의 기본 압축 설정을 사용하여 단일 파일을 변환합니다.

```bash
cwebp images/flower.jpg -o images/flower.webp
```

품질 수준 `50`을 사용하여 단일 파일을 변환합니다.

```bash
cwebp -q 50 images/flower.jpg -o images/flower.webp
```

디렉터리의 모든 파일을 변환합니다.

```bash
for file in images/*; do cwebp "$file" -o "${file%.*}.webp"; done
```

### Imagemin 사용

Imagemin WebP 플러그인은 단독으로 또는 선호하는 빌드 도구(Webpack/Gulp/Grunt/etc.)와 함께 사용할 수 있습니다. 여기에는 일반적으로 빌드 스크립트 또는 빌드 도구의 구성 파일에 코드를 10줄까지 추가하는 작업이 포함됩니다. 다음은 [Webpack](https://glitch.com/~webp-webpack) , [Gulp](https://glitch.com/~webp-gulp) 및 [Grunt](https://glitch.com/~webp-grunt)에서 이를 수행하는 방법의 예시입니다.

이러한 빌드 도구 중 하나를 사용하지 않는 경우 Imagemin 자체를 노드 스크립트로 사용할 수 있습니다. 이 스크립트는 `images` 디렉터리에 있는 파일을 변환하고 `compressed_images` 디렉터리에 저장합니다.

```js
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

## WebP 이미지 제공

사이트가 WebP 호환 [브라우저](https://caniuse.com/#search=webp)만 지원하는 경우 읽기를 중지할 수 있습니다. 그렇지 않으면 WebP를 최신 브라우저에 제공하고 대체 이미지를 이전 브라우저에 제공합니다.

**이전:**

```html
<img src="flower.jpg" alt="">
```

**이후:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

서로 상대적으로 정렬되는 방식을 포함한 [`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture), [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) 및 `<img>` 태그는 모두 상호 작용하여 이러한 최종 결과를 얻습니다.

### 그림

`<picture>` 태그는 0개 이상의 `<source>` 태그와 하나의 `<img>` 태그에 대한 래퍼를 제공합니다.

### 소스

`<source>` 태그는 미디어 리소스를 지정합니다.

브라우저는 지원하는 형식으로 나열된 첫 번째 소스를 사용합니다. `<source>` 태그에 나열된 형식을 브라우저가 지원하지 않으면 `<img>` 태그에 지정된 이미지를 로드하는 것으로 대체됩니다.

{% Aside 'gotchas' %}

- "선호하는" 이미지 형식에 대한 `<source>` 태그는 다른 `<source>` 태그보다 먼저 나열되어야 합니다.

- `type` 속성의 값은 이미지 형식에 해당하는 MIME 유형이어야 합니다. 이미지의 [MIME 유형](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)과 파일 확장자는 종종 비슷하지만 반드시 같은 것은 아닙니다(예: `.jpg` 대 `image/jpeg`).

{% endAside %}

### 이미지

`<img>` 태그는 `<picture>` 태그를 지원하지 않는 브라우저에서 코드를 작동하게 하는 것입니다. 브라우저가 `<picture>` 태그를 지원하지 않으면 지원하지 않는 태그를 무시합니다. 따라서 브라우저는 `<img src="flower.jpg" alt="">` 태그만 "보고" 해당 이미지를 로드합니다.

{% Aside 'gotchas' %}

- `<img>` 태그는 항상 포함되어야 하며 모든 `<source>` 태그 다음으로 항상 마지막에 나열되어야 합니다.
- `<img>` 태그로 지정된 리소스는 대체적으로 사용할 수 있도록 보편적으로 지원되는 형식(예: JPEG)이어야 합니다. {% endAside %}

## WebP 사용 확인

Lighthouse는 사이트의 모든 이미지가 WebP를 사용하여 제공되고 있는지 확인하는 데 사용할 수 있습니다. Lighthouse 성능 감사(**Lighthouse &gt; 옵션 &gt; 성능**)를 실행하고 **차세대 형식의 이미지 제공** 감사 결과를 찾습니다. Lighthouse는 WebP에서 제공되지 않는 모든 이미지를 나열합니다.
