---
layout: post
title: 반응형 이미지 제공
authors:
  - katiehempenius
description: 데스크톱 크기의 이미지를 모바일 장치에 제공하면 필요한 것보다 2~4배 더 많은 데이터를 사용할 수 있습니다. 이미지에 대한 "일률적인" 접근 방식 대신 다양한 장치에 다양한 이미지 크기를 제공하십시오.
date: 2018-11-05
updated: 2021-06-04
codelabs:
  - codelab-specifying-multiple-slot-widths
  - codelab-art-direction
  - codelab-density-descriptors
tags:
  - performance
---

데스크톱 크기의 이미지를 모바일 장치에 제공하면 필요한 것보다 2~4배 더 많은 데이터를 사용할 수 있습니다. 이미지에 대한 "일률적인" 접근 방식 대신 다양한 장치에 다양한 이미지 크기를 제공하십시오.

## 이미지 크기 조정

가장 널리 사용되는 이미지 크기 조정 도구 중 두 가지는 [Sharp npm 패키지](https://www.npmjs.com/package/sharp) 와 [ImageMagick CLI 도구](https://www.imagemagick.org/script/index.php) 입니다.

Sharp 패키지는 이미지 크기 조정을 자동화하는 데 적합합니다(예: 웹사이트의 모든 동영상에 대해 여러 크기의 축소판 그림 생성). 빌드 스크립트 및 도구와 빠르고 쉽게 통합됩니다. 반면 ImageMagick은 전적으로 명령줄에서 사용되기 때문에 일회성 이미지 크기 조정에 유용합니다.

### sharp

sharp를 Node 스크립트로 사용하려면 이 코드를 프로젝트에 별도의 스크립트로 저장한 다음 실행하여 이미지를 변환합니다.

```javascript
const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach(file => {
  sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
  });
```

### ImageMagick

이미지 크기를 원래 크기의 33%로 조정하려면 터미널에서 다음 명령을 실행합니다.

```bash
convert -resize 33% flower.jpg flower-small.jpg
```

너비 300픽셀 x 높이 200픽셀에 맞게 이미지 크기를 조정하려면 다음 명령을 실행합니다.

```bash
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

### 몇 개의 이미지 버전을 만들어야 합니까?

이 질문에 대한 하나의 "정답"은 없습니다. 그러나 일반적으로 3~5개의 서로 다른 크기의 이미지를 제공합니다. 더 많은 이미지 크기를 제공하면 성능이 향상되지만 서버에서 더 많은 공간을 차지하고 HTML을 조금 더 작성해야 합니다.

### 다른 옵션

[Thumbor](https://github.com/thumbor/thumbor)(오픈 소스) 및 [Cloudinary](https://cloudinary.com/)와 같은 이미지 서비스도 확인할 가치가 있습니다. 이미지 서비스는 요청 기반 반응형 이미지(및 이미지 조작)를 제공합니다. Thumbor는 서버에 설치하여 설정됩니다. Cloudinary는 이러한 세부 정보를 처리하며 서버 설정이 필요하지 않습니다. 둘 모두 반응형 이미지를 만드는 쉬운 방법입니다.

## 여러 이미지 버전 제공

여러 이미지 버전을 지정하면 브라우저에서 사용하기에 가장 적합한 버전을 선택합니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>전</strong></th>
        <th><strong>후</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          &lt;img src="flower-large.jpg"&gt;
        </td>
        <td>
          &lt;img src="flower-large.jpg" srcset="flower-small.jpg 480w,
          flower-large.jpg 1080w" sizes="50vw"&gt;
        </td>
      </tr>
    </tbody>
  </table>
</div>

`<img>` 태그의 [`src`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-src), [`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset) 및 [`sizes`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes) 속성은 모두 이 최종 결과를 얻기 위해 상호 작용합니다.

### "src" 속성

src 속성은 이 코드가 `srcset` 및 `sizes` 속성을 [지원](https://caniuse.com/#search=srcset)하지 않는 브라우저에서 작동하도록 합니다. 브라우저가 이러한 속성을 지원하지 않으면 `src` 속성에서 지정한 리소스를 로드하는 것으로 대체됩니다.

{% Aside 'gotchas' %} `src` 속성으로 지정한 리소스는 모든 장치 크기에서 잘 작동할 만큼 충분히 커야 합니다. {% endAside %}

### "srcset" 속성

`srcset` 속성은 이미지 파일 이름과 너비 또는 밀도 설명자를 쉼표로 구분한 목록입니다.

이 예시에서는 [너비 설명자](https://www.w3.org/TR/html5/semantics-embedded-content.html#width-descriptor)를 사용합니다. `480w`는 `flower-small.jpg`의 너비가 480px임을 브라우저에 알리는 너비 설명자입니다. `1080w`는 `flower-large.jpg`의 너비가 1080px임을 브라우저에 알리는 너비 설명자입니다.

"너비 설명자"는 멋지게 들리지만 브라우저에 이미지의 너비를 알려주는 하나의 방법일 뿐입니다. 이렇게 하면 브라우저에서 이미지 크기를 결정하기 위해 이미지를 다운로드할 필요가 없습니다.

{% Aside 'gotchas' %} 너비 설명자를 작성하려면 `w` 단위(`px` 대신)를 사용합니다. 예를 들어 너비가 1024px인 이미지는 `1024w`로 작성하게 됩니다. {% endAside %}

**추가 크레딧:** 다양한 이미지 크기를 제공하기 위해 밀도 설명자에 대해 알 필요는 없습니다. 그러나 밀도 설명자의 작동 방식이 궁금한 경우 [해상도 전환 코드 랩](/codelab-density-descriptors)을 확인합니다. 밀도 설명자는 장치의 [픽셀 밀도](https://en.wikipedia.org/wiki/Pixel_density)에 따라 다양한 이미지를 제공하는 데 사용됩니다.

### "크기" 속성

크기 속성은 이미지가 표시될 때 브라우저에 이미지의 너비를 알려줍니다. 그러나 크기 속성은 표시 크기에 영향을 주지 않습니다. 이를 위해서는 여전히 CSS가 필요합니다.

브라우저는 로드할 이미지를 결정하기 위해 사용자 장치에 대해 알고 있는 정보(예: 치수 및 픽셀 밀도)와 함께 이 정보를 사용합니다.

브라우저가 '`sizes`' 속성을 인식하지 못하는 경우 브라우저는 '`src`' 속성에서 지정한 이미지를 로드하도록 대체합니다. (브라우저는 '`sizes`' 및 '`srcset`' 속성을 동시에 지원하므로 브라우저는 두 속성을 모두 지원하거나 둘 다 지원하지 않게 됩니다.)

{% Aside 'gotchas' %} 다양한 단위를 사용하여 슬롯 너비를 지정할 수 있습니다. 다음은 모두 유효한 크기입니다.

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

다음은 유효한 크기가 아닙니다.

- `25%` (비율은 크기 속성과 함께 사용할 수 없음) {% endAside %}

**추가 크레딧:** 멋지게 만들고 싶은 경우 크기 속성을 사용하여 여러 슬롯 크기를 지정할 수도 있습니다. 이것은 다른 뷰포트 크기에 대해 다른 레이아웃을 사용하는 웹 사이트를 수용합니다. 이 작업을 수행하는 방법을 알아 보려면 이 [다중 슬롯 코드 샘플](/codelab-specifying-multiple-slot-widths)을 확인하십시오.

### (좀 더) 추가 크레딧

이미 나열된 모든 추가 크레딧 외에도(이미지는 복잡합니다!) [아트 디렉션](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)에도 이와 동일한 개념을 사용할 수 있습니다. 아트 디렉션은 완전히 다른 모양의 이미지(같은 이미지의 다른 버전이 아닌)를 다른 뷰포트에 제공하는 실행 방법입니다. [아트 디렉션 코드 랩](/codelab-art-direction)에서 자세히 알아볼 수 있습니다.

## 검증

반응형 이미지를 구현한 후에는 Lighthouse를 사용하여 누락된 이미지가 없는지 확인할 수 있습니다. Lighthouse 성능 감사(**Lighthouse &gt; 옵션 &gt; 성능**)를 실행하고 **적절한 크기의 이미지** 감사 결과를 찾습니다. 이 결과에는 크기를 조정해야 하는 이미지가 나열됩니다.
