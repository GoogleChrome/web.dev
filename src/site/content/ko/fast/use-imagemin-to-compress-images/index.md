---
layout: post
title: Imagemin을 사용하여 이미지 압축
authors:
  - katiehempenius
date: 2018-11-05
updated: 2020-04-06
description: |2-

  압축되지 않은 이미지는 불필요한 바이트로 페이지를 부풀립니다. Lighthouse를 실행하여 이미지를 압축하여 페이지 로드를 개선할 수 있는 기회를 확인합니다.
codelabs:
  - codelab-imagemin-webpack
  - codelab-imagemin-gulp
  - codelab-imagemin-grunt
tags:
  - performance
---

## 왜 신경을 써야 할까요?

압축되지 않은 이미지는 불필요한 바이트로 페이지를 부풀립니다. 오른쪽 사진은 왼쪽 사진보다 40% 작지만 일반 사용자에게는 동일하게 보일 것입니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<p>{% Img src="image/admin/LRE2JJAuShXTjQF5ZSaR.jpg", alt="", width="376", height="250" %}</p> 20 KB</th>
        <th>
<p>{% Img src="image/admin/u9hncwN4TsT7zw2ObU10.jpg", alt="", width="376", height="250" %}</p> 12 KB</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

## 측정

Lighthouse를 실행하여 이미지를 압축하여 페이지 로드를 개선할 수 있는 기회를 확인합니다. 이러한 기회는 "효율적으로 이미지 인코딩"에 나열되어 있습니다.

{% Img src="image/admin/LnIukPEZHuVJwBtuJ7mc.png", alt="image", width="800", height="552" %}

{% Aside %} Lighthouse는 현재 JPEG 형식의 이미지만 압축할 수 있는 기회에 대해 보고합니다. {% endAside %}

## Imagemin

Imagemin은 다양한 이미지 형식을 지원하고 빌드 스크립트 및 빌드 도구와 쉽게 통합되므로 이미지 압축에 탁월한 선택입니다. Imagemin은 [CLI](https://github.com/imagemin/imagemin-cli) 및 [npm 모듈](https://www.npmjs.com/package/imagemin)로 사용할 수 있습니다. 일반적으로 npm 모듈은 더 많은 구성 옵션을 제공하기 때문에 최선의 선택이지만, 코드를 건드리지 않고 Imagemin을 사용하려는 경우 CLI가 적절한 대안이 될 수 있습니다.

### 플러그인

Imagemin은 "플러그인"을 중심으로 구축되었습니다. 플러그인은 특정 이미지 형식을 압축하는 npm 패키지입니다(예: "mozjpeg"는 JPEG 압축). 인기 있는 이미지 형식에는 선택할 수 있는 여러 플러그인이 있을 수 있습니다.

플러그인을 선택할 때 고려해야 할 가장 중요한 사항은 "손실"인지 "무손실"인지입니다. 무손실 압축에서는 데이터가 손실되지 않습니다. 손실 압축은 파일 크기를 줄이지만 이미지 품질을 저하시킬 수 있습니다. 플러그인이 "손실"인지 "무손실"인지를 언급하지 않으면 API로 알 수 있습니다. 출력의 이미지 품질을 지정할 수 있다면 "손실"입니다.

대부분의 사람들에게는 손실 플러그인이 최선의 선택입니다. 훨씬 더 큰 파일 크기 절감 효과를 제공하며 요구 사항에 맞게 압축 수준을 사용자 지정할 수 있습니다. 아래 표에는 인기 있는 Imagemin 플러그인이 나열되어 있습니다. 이것들이 사용 가능한 유일한 플러그인은 아니지만 모두 프로젝트에 좋은 선택이 될 것입니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>이미지 형식</th>
        <th>손실 플러그인</th>
        <th>무손실 플러그인</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-mozjpeg">imagemin-mozjpeg</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-jpegtran">imagemin-jpegtran</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-pngquant">imagemin-pngquant</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-optipng">imagemin-optipng</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="https://www.npmjs.com/package/imagemin-giflossy">imagemin-giflossy</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-gifsicle">imagemin-gifsicle</a></td>
      </tr>
      <tr>
        <td>SVG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-svgo">imagemin-svgo</a></td>
        <td></td>
      </tr>
      <tr>
        <td>WebP</td>
        <td><a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Imagemin CLI

Imagemin CLI는 imagemin-gifsicle, imagemin-jpegtran, imagemin-optipng, imagemin-pngquant 및 imagemin-svgo의 5가지 플러그인과 함께 작동합니다. Imagemin은 입력의 이미지 형식에 따라 적절한 플러그인을 사용합니다.

"images/" 디렉터리의 이미지를 압축하고 동일한 디렉터리에 저장하려면 다음 명령을 실행하십시오(원본 파일 덮어쓰기).

```bash
$ imagemin images/* --out-dir=images
```

### Imagemin npm 모듈

만약 당신이 이 빌드 도구들 중 하나를 사용한다면, [webpack](/codelab-imagemin-webpack), [gulp](/codelab-imagemin-gulp) 또는 [grunt](/codelab-imagemin-grunt)로 Imaginemin의 코드랩을 확인하십시오.

Imagemin 자체를 노드 스크립트로 사용할 수도 있습니다. 이 코드는 "imagemin-mozjpeg" 플러그인을 사용하여 JPEG 파일을 50 품질로 압축합니다('0'은 최악, '100'은 최고):

```js
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      {
        destination: 'destination_dir',
        plugins: [imageminMozjpeg({quality: 50})]
      }
  );
  console.log(files);
})();
```
