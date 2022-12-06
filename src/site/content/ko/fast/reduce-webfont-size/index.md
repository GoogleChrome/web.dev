---
layout: post
title: WebFont 크기 줄이기
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |2

  이 게시물은 좋은 타이포그래피가 느린 사이트를 의미하지 않도록 사이트에서 사용하는 WebFonts의 크기를 줄이는 방법을 설명합니다.
tags:
  - performance
  - fonts
---

타이포그래피는 좋은 디자인, 브랜딩, 가독성 및 접근성의 기본입니다. WebFont는 위의 모든 것 이상을 가능하게 합니다. 텍스트는 선택 가능하고 검색 가능하며 확대/축소 가능하고 높은 DPI 친화적이며 화면 크기와 해상도에 관계없이 일관되고 선명한 텍스트 렌더링을 제공합니다. WebFonts는 좋은 디자인, UX 및 성능에 매우 중요합니다.

WebFont 최적화는 전체 성능 전략의 중요한 부분입니다. 각 글꼴은 추가 리소스이며 일부 글꼴은 텍스트 렌더링을 차단할 수 있지만 페이지에서 WebFonts를 사용한다고 해서 더 느리게 렌더링되어야 하는 것은 아닙니다. 반대로 최적화된 글꼴을 페이지에 로드 및 적용하는 방법에 대한 신중한 전략과 결합하면 전체 페이지 크기를 줄이고 페이지 렌더링 시간을 개선할 수 있습니다.

## WebFont의 구조

*WebFont*는 글리프 모음이며 각 글리프는 문자나 기호를 설명하는 벡터 모양입니다. 결과적으로 두 개의 간단한 변수가 특정 글꼴 파일의 크기를 결정합니다. 각 글리프의 벡터 경로 복잡성과 특정 글꼴의 글리프 수입니다. 예를 들어, 가장 인기 있는 WebFont 중 하나인 Open Sans에는 라틴어, 그리스어 및 키릴 문자를 포함하는 897개의 글리프가 포함되어 있습니다.

{% Img src="image/admin/B92rhiBJD9sx88a5CvVy.png", alt="글꼴 글리프 테이블", width="800", height="309" %}

글꼴을 선택할 때 지원되는 문자 집합을 고려하는 것이 중요합니다. 페이지 콘텐츠를 여러 언어로 현지화해야 하는 경우 사용자에게 일관된 모양과 경험을 제공할 수 있는 글꼴을 사용해야 합니다. 예를 들어, [Google의 Noto 글꼴 모음](https://www.google.com/get/noto/)은 전 세계의 모든 언어를 지원하는 것을 목표로 합니다. 그러나 모든 언어가 포함된 Noto의 총 크기는 1.1GB+ ZIP 다운로드가 됩니다.

이 게시물에서는 WebFont의 전달된 파일 크기를 줄이는 방법을 알아봅니다.

### WebFont 형식

오늘날 웹에서는 4가지 글꼴 컨테이너 형식을 사용하고 있습니다.

- [EOT](https://en.wikipedia.org/wiki/Embedded_OpenType)
- [TTF](https://en.wikipedia.org/wiki/TrueType)
- [WOFF](https://en.wikipedia.org/wiki/Web_Open_Font_Format)
- [WOFF2](https://www.w3.org/TR/WOFF2/).

[WOFF](http://caniuse.com/#feat=woff) 및 [WOFF 2.0](http://caniuse.com/#feat=woff2)이 가장 폭넓게 지원되지만 이전 브라우저와의 호환성을 위해 다른 형식을 포함해야 할 수도 있습니다.

- WOFF 2.0 변형을 지원하는 브라우저에 제공합니다.
- 대부분의 브라우저에 WOFF 변형을 제공합니다.
- 이전 Android(4.4 미만) 브라우저에 TTF 변형을 제공합니다.
- 이전 IE(IE9 미만) 브라우저에 EOT 변형을 제공합니다.

[{% Aside %} 기술적으로 SVG 글꼴 컨테이너](http://caniuse.com/svg-fonts)라는 또 다른 컨테이너 형식이 있지만 IE와 Firefox는 이를 지원하지 않았으며 이제 Chrome에서 더 이상 사용되지 않습니다. 따라서 사용이 제한적이며 이 가이드에서는 의도적으로 생략했습니다. {% endAside %}

### 압축으로 글꼴 크기 줄이기

글꼴은 문자 형태를 설명하는 경로 집합인 글리프 모음입니다. 개별 글리프는 다르지만 GZIP 또는 호환 가능한 압축기로 압축할 수 있는 유사한 정보가 많이 포함되어 있습니다.

- EOT 및 TTF 형식은 기본적으로 압축되지 않습니다. 이러한 형식을 제공할 때 서버가 [GZIP 압축](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer#text-compression-with-gzip)을 적용하도록 구성되어 있는지 확인하십시오.
- WOFF에는 압축 기능이 내장되어 있습니다. WOFF 압축기가 최적의 압축 설정을 사용하고 있는지 확인하십시오.
- WOFF2는 사용자 지정 전처리 및 압축 알고리즘을 사용하여 다른 형식에 비해 ~30% 파일 크기 감소를 제공합니다. 자세한 내용 [은 WOFF 2.0 평가 보고서](http://www.w3.org/TR/WOFF20ER/)를 참조하십시오.

마지막으로 일부 글꼴 형식에는 일부 플랫폼에서 필요하지 않을 수 있는 [글꼴 힌트](https://en.wikipedia.org/wiki/Font_hinting) 및 [커닝](https://en.wikipedia.org/wiki/Kerning) 정보와 같은 추가 메타데이터가 포함되어 있어 추가 파일 크기 최적화가 가능합니다. 사용 가능한 최적화 옵션에 대해서는 글꼴 압축기에 문의하고 이 경로를 선택하는 경우 이러한 최적화된 글꼴을 테스트하고 각 브라우저에 전달할 적절한 인프라가 있는지 확인하십시오. 예를 들어 [Google Fonts](https://fonts.google.com/)는 각 글꼴에 대해 30개 이상의 최적화된 변형을 유지 관리하고 각 플랫폼 및 브라우저에 대한 최적의 변형을 자동으로 감지하여 제공합니다.

{% Aside %} EOT, TTF 및 WOFF 형식에 [Zopfli 압축](http://en.wikipedia.org/wiki/Zopfli) 사용을 고려하세요. Zopfli는 zlib 호환 압축기로 gzip에 비해 파일 크기가 5% 감소합니다. {% endAside %}

## @font-face를 사용하여 글꼴 모음 정의

`@font-face` CSS at-rule을 사용하면 특정 글꼴 리소스의 위치, 스타일 특성, 사용해야 하는 유니코드 코드포인트를 정의할 수 있습니다. `@font-face` 선언의 조합은 "글꼴 패밀리"를 구성하는 데 사용할 수 있으며, 브라우저는 이 글꼴 리소스를 다운로드하여 현재 페이지에 적용해야 하는 글꼴 리소스를 평가하는 데 사용할 수 있습니다.

### 가변 글꼴 고려

가변 글꼴은 글꼴의 여러 변형이 필요한 경우 글꼴의 파일 크기를 크게 줄일 수 있습니다. 일반 및 볼드 스타일과 기울임꼴 버전을 로드할 필요 없이 모든 정보가 포함된 단일 파일을 로드할 수 있습니다.

가변 글꼴은 이제 모든 최신 브라우저에서 지원됩니다. 자세한 내용 [은 웹의 가변 글꼴 소개](/variable-fonts/) 에서 확인하세요.

### 올바른 형식 선택

각 `@font-face` 선언은 여러 선언의 논리적 그룹 역할을 하는 글꼴 모음의 이름, 스타일, 두께 및 스트레치와 같은 [글꼴 속성](http://www.w3.org/TR/css3-fonts/#font-prop-desc) 및 글꼴 리소스에 대한 위치의 우선 순위 목록을 지정하는 [src 설명자](http://www.w3.org/TR/css3-fonts/#src-desc)를 제공합니다.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome.woff2') format('woff2'),
        url('/fonts/awesome.woff') format('woff'),
        url('/fonts/awesome.ttf') format('truetype'),
        url('/fonts/awesome.eot') format('embedded-opentype');
}

@font-face {
  font-family: 'Awesome Font';
  font-style: italic;
  font-weight: 400;
  src: local('Awesome Font Italic'),
        url('/fonts/awesome-i.woff2') format('woff2'),
        url('/fonts/awesome-i.woff') format('woff'),
        url('/fonts/awesome-i.ttf') format('truetype'),
        url('/fonts/awesome-i.eot') format('embedded-opentype');
}
```

먼저, 위의 예는 두 가지 스타일(normal 및 *italic*)을 가진 단일 *Awesome Font* 모음을 정의하며, 각 스타일은 서로 다른 글꼴 리소스 집합을 가리킵니다. 차례로 각 `src` 설명자에는 우선 순위가 지정되고 쉼표로 구분된 리소스 변형 목록이 포함됩니다.

- `local()` 지시문을 사용하면 로컬에 설치된 글꼴을 참조, 로드 및 사용할 수 있습니다.
- `url()` 지시문을 사용하면 외부 글꼴을 로드할 수 있으며 제공된 URL에서 참조하는 글꼴 형식을 나타내는 선택적 `format()` 힌트를 포함할 수 있습니다.

{% Aside %} 기본 시스템 글꼴 중 하나를 참조하지 않는 한 사용자가 로컬로 설치하는 경우는 드뭅니다. 특히 모바일 기기에서는 추가 글꼴을 "설치"하는 것이 사실상 불가능합니다. 항상 "만약에 대비하여" `local()`로 시작해야 하며 `url()` 항목 목록을 제공해야 합니다. {% endAside %}

브라우저는 글꼴이 필요하다고 판단하면 지정된 순서대로 제공된 리소스 목록을 반복하고 적절한 리소스를 로드하려고 시도합니다. 예를 들어 위의 예를 따르면 다음과 같습니다.

1. 브라우저는 페이지 레이아웃을 수행하고 페이지에 지정된 텍스트를 렌더링하는 데 필요한 글꼴 변형을 결정합니다.
2. 필요한 각 글꼴에 대해 브라우저는 해당 글꼴을 로컬에서 사용할 수 있는지 확인합니다.
3. 글꼴을 로컬에서 사용할 수 없는 경우 브라우저는 외부 정의를 반복합니다.
    - 형식 힌트가 있는 경우 브라우저는 다운로드를 시작하기 전에 힌트를 지원하는지 확인합니다. 브라우저가 힌트를 지원하지 않으면 브라우저는 다음 힌트로 넘어갑니다.
    - 형식 힌트가 없으면 브라우저는 리소스를 다운로드합니다.

적절한 형식 힌트와 함께 로컬 및 외부 지시문을 조합하면 사용 가능한 모든 글꼴 형식을 지정하고 브라우저가 나머지를 처리하도록 할 수 있습니다. 브라우저는 필요한 리소스를 결정하고 최적의 형식을 선택합니다.

{% Aside %} 글꼴 변형이 지정되는 순서가 중요합니다. 브라우저는 지원하는 첫 번째 형식을 선택합니다. 따라서 최신 브라우저에서 WOFF 2.0을 사용하려면 WOFF 위에 WOFF 2.0 선언을 배치해야 합니다. {% endAside %}

### 유니코드 범위 하위 집합

스타일, 두께 및 늘이기 같은 글꼴 속성 외에도 `@font-face` 규칙을 사용하면 각 리소스에서 지원하는 유니코드 코드포인트 집합을 정의할 수 있습니다. 이를 통해 큰 유니코드 글꼴을 더 작은 하위 집합(예: 라틴어, 키릴 자모 및 그리스어 하위 집합)으로 분할하고 특정 페이지의 텍스트를 렌더링하는 데 필요한 글리프만 다운로드할 수 있습니다.

[유니코드 범위 설명자](http://www.w3.org/TR/css3-fonts/#descdef-unicode-range)를 사용하면 쉼표로 구분된 범위 값 목록을 지정할 수 있습니다. 각 목록은 다음 세 가지 형식 중 하나일 수 있습니다.

- 단일 코드포인트(예: `U+416` )
- 간격 범위(예: `U+400-4ff` ): 범위의 시작 및 끝 코드포인트를 나타냅니다.
- 와일드카드 범위(예: `U+4??` ): `?` 문자는 16진수를 나타냅니다.

예를 들어, *Awesome Font* 모음을 라틴어 및 일본어 하위 집합으로 분할할 수 있으며 각 하위 집합은 브라우저가 필요에 따라 다운로드합니다.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-jp.woff2') format('woff2'),
        url('/fonts/awesome-jp.woff') format('woff'),
        url('/fonts/awesome-jp.ttf') format('truetype'),
        url('/fonts/awesome-jp.eot') format('embedded-opentype');
  unicode-range: U+3000-9FFF, U+ff??; /* Japanese glyphs */
}
```

{% Aside %} 유니코드 범위 하위 설정은 상형 문자 수가 서양 언어보다 훨씬 많고 일반적인 "전체" 글꼴이 수십 킬로바이트가 아닌 메가바이트로 측정되는 아시아 언어에 특히 중요합니다. {% endAside %}

유니코드 범위 하위 집합과 글꼴의 각 스타일 변형에 대한 개별 파일을 사용하면 더 빠르고 효율적으로 다운로드할 수 있는 합성 글꼴 모음을 정의할 수 있습니다. 방문자는 필요한 변형과 하위 집합만 다운로드하며 페이지에서 보거나 사용할 수 없는 하위 집합을 강제로 다운로드하지 않습니다.

대부분의 브라우저는 [이제 unicode-range를 지원](http://caniuse.com/#feat=font-unicode-range)합니다. 이전 브라우저와의 호환성을 위해 "수동 하위 설정"으로 대체해야 할 수도 있습니다. 이 경우 필요한 모든 하위 집합이 포함된 단일 글꼴 리소스를 제공하고 나머지는 브라우저에서 숨겨야 합니다. 예를 들어 페이지에서 라틴 문자만 사용하는 경우 다른 글리프를 제거하고 해당 특정 하위 집합을 독립 실행형 리소스로 제공할 수 있습니다.

1. **필요한 하위 집합을 결정합니다.**
    - 브라우저가 유니코드 범위 하위 집합을 지원하는 경우 올바른 하위 집합을 자동으로 선택합니다. `@font-face` 규칙에 적절한 유니코드 범위를 지정하기만 하면 됩니다.
    - 브라우저가 유니코드 범위 하위 집합을 지원하지 않으면 페이지에서 불필요한 하위 집합을 모두 숨겨야 합니다. 즉, 개발자는 필수 하위 집합을 지정해야 합니다.
2. **글꼴 하위 집합 생성:**
    - 오픈 소스 [pyftsubset 도구](https://github.com/behdad/fonttools/)를 사용하여 글꼴의 하위 집합을 만들고 최적화하십시오.
    - 일부 글꼴 서비스는 페이지에 필요한 하위 집합을 수동으로 지정하는 데 사용할 수 있는 사용자 정의 쿼리 매개변수를 통한 수동 하위 설정을 허용합니다. 글꼴 제공업체의 설명서를 참조하십시오.

### 글꼴 선택 및 합성

각 글꼴 모음은 여러 스타일 변형(일반, 굵게, 기울임꼴)과 각 스타일에 대한 여러 가중치로 구성되며, 각 스타일에는 서로 다른 간격, 크기 또는 다른 모양과 같은 매우 다른 글리프 모양이 포함될 수 있습니다.

{% Img src="image/admin/FNtAc2xRmx2MuUt2MADj.png", alt="글꼴 두께", width="697", height="127" %}

예를 들어, 위의 다이어그램은 400(일반), 700(굵게) 및 900(매우 굵게)의 세 가지 다른 굵기 두께를 제공하는 글꼴 모음을 보여줍니다. 다른 모든 중간 변형(회색으로 표시됨)은 브라우저에서 가장 가까운 변형에 자동으로 매핑됩니다.

<blockquote>
  <p>면이 없는 가중치를 지정하면 가중치가 가까운 면이 사용됩니다. 일반적으로 굵은 가중치는 가중치가 더 큰 면에 매핑되고 가벼운 가중치는 가중치가 더 가벼운 면에 매핑됩니다.</p>
<cite><p data-md-type="paragraph"><a href="http://www.w3.org/TR/css3-fonts/#font-matching-algorithm">CSS 글꼴 일치 알고리즘</a></p></cite>
</blockquote>

*기울임꼴* 변형에도 유사한 논리가 적용됩니다. 글꼴 디자이너는 생성할 변형을 제어하고 페이지에서 사용할 변형을 제어합니다. 각 변형은 별도의 다운로드이므로 변형 수를 작게 유지하는 것이 좋습니다. *예를 들어, Awesome Font* 모음에 대해 두 개의 굵은 변형을 정의할 수 있습니다.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 700;
  src: local('Awesome Font'),
        url('/fonts/awesome-l-700.woff2') format('woff2'),
        url('/fonts/awesome-l-700.woff') format('woff'),
        url('/fonts/awesome-l-700.ttf') format('truetype'),
        url('/fonts/awesome-l-700.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

위의 예는 동일한 라틴 문자 집합(`U+000-5FF`)을 포함하지만 일반(400) 및 굵게(700)의 두 가지 "가중치"를 제공하는 두 가지 리소스로 구성된 *Awesome Font* 모음을 선언합니다. 그러나 CSS 규칙 중 하나가 다른 글꼴 두께를 지정하거나 font-style 속성을 기울임꼴로 설정하면 어떻게 됩니까?

- 정확한 글꼴 일치를 사용할 수 없는 경우 브라우저는 가장 가까운 글꼴로 대체합니다.
- 일치하는 스타일이 없으면(예: 위의 예에서 기울임꼴 변형이 선언되지 않은 경우) 브라우저는 자체 글꼴 변형을 합성합니다.

{% Img src="image/admin/a8Jo2cIO1tPsj71AzftS.png", alt="글꼴 합성", width="800", height="356" %}

{% Aside 'warning' %} 합성된 접근 방식은 기울임꼴 형태의 모양이 매우 다른 키릴 자모와 같은 스크립트에는 적합하지 않을 수 있습니다. 해당 스크립트에서 적절한 충실도를 위해 실제 기울임꼴 글꼴을 사용하십시오. {% endAside %}

위의 예는 Open Sans의 실제 글꼴과 합성 글꼴 결과의 차이를 보여줍니다. 합성된 모든 변형은 단일 400 가중치 글꼴에서 생성됩니다. 보시다시피 결과에 눈에 띄는 차이가 있습니다. 굵게 및 비스듬한 변형을 생성하는 방법에 대한 세부 정보는 지정되지 않습니다. 따라서 결과는 브라우저마다 다르며 글꼴에 따라 크게 달라집니다.

{% Aside %} 최상의 일관성과 시각적 결과를 얻으려면 글꼴 합성에 의존하지 마십시오. 대신 사용된 글꼴 변형의 수를 최소화하고 해당 위치를 지정하여 페이지에서 사용할 때 브라우저에서 다운로드할 수 있도록 합니다. 또는 가변 글꼴을 사용하도록 선택합니다. 즉, 어떤 경우에는 합성된 변형이 [실행 가능한 옵션](https://www.igvita.com/2014/09/16/optimizing-webfont-selection-and-synthesis/)일 수 있지만 합성된 변형을 사용할 때는 주의해야 합니다. {% endAside %}

## WebFont 크기 최적화 체크리스트

- **글꼴 사용 감사 및 모니터링:** 페이지에 너무 많은 글꼴을 사용하지 말고 각 글꼴에 대해 사용된 변형 수를 최소화하십시오. 이는 사용자에게 보다 일관되고 빠른 경험을 제공하는 데 도움이 됩니다.
- **글꼴 리소스의** 하위 집합: 많은 글꼴이 하위 집합이 되거나 여러 유니코드 범위로 분할되어 특정 페이지에 필요한 글리프만 제공할 수 있습니다. 이렇게 하면 파일 크기가 줄어들고 리소스의 다운로드 속도가 향상됩니다. 그러나 하위 집합을 정의할 때 글꼴 재사용을 위해 최적화하도록 주의하십시오. 예를 들어, 각 페이지에 서로 다르지만 겹치는 문자 집합을 다운로드하지 마십시오. 예를 들어 라틴어 및 키릴 자모와 같은 스크립트를 기반으로 하위 집합을 지정하는 것이 좋습니다.
- **각 브라우저에 최적화된 글꼴 형식** 제공: 각 글꼴을 WOFF 2.0, WOFF, EOT 및 TTF 형식으로 제공합니다. EOT 및 TTF 형식은 기본적으로 압축되지 않으므로 GZIP 압축을 적용해야 합니다.
- **`src` 목록에서 `local()`에 우선 순위 부여:** 목록 `local('글꼴 이름')` 처음에 `src` 요청이 이미 설치된 글꼴에 대해 HTTP 요청이 이뤄지지 않았음을 확인합니다.
- **[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)를 사용하여** [텍스트 압축](https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/)을 테스트합니다.
