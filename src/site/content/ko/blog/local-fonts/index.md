---
layout: post
title: 로컬 글꼴로 고급 입력 체계 사용
subhead: Local Font Access API를 사용하여 사용자의 로컬에 설치된 글꼴에 액세스하고 해당 글꼴에 대한 낮은 수준의 세부 정보를 얻는 방법을 알아봅니다.
tags:
  - blog
  - fonts
  - capabilities
authors:
  - thomassteiner
description: Local Fonts API는 사용자가 설치한 로컬 글꼴을 열거하고 다양한 트루타입/오픈타입 테이블에 대한 낮은 수준의 액세스를 제공합니다.
date: 2020-08-24
updated: 2021-07-30
hero: image/admin/oeXwG1zSwnivzpvcUJly.jpg
alt: 글꼴 책의 페이지입니다.
feedback:
  - api
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-7289075996899147775"
---

{% Aside %} Local Font Access API는 [기능 프로젝트](https://developer.chrome.com/blog/capabilities/)의 일부이며 현재 개발 중입니다. 이 게시물은 구현이 진행되는 대로 업데이트됩니다. {% endAside %}

## 웹 안전 글꼴

웹 개발을 오랫동안 해오셨다면 소위 [웹 안전 글꼴](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Fundamentals#Web_safe_fonts)을 기억하실 것입니다. 이 글꼴은 가장 많이 사용되는 운영 체제(즉, Windows, macOS, 가장 일반적인 Linux 배포판, Android 및 iOS)의 거의 모든 인스턴스에서 사용할 수 있는 것으로 알려져 있습니다. 2000년대 초반에 Microsoft는 *"이 글꼴을 지정하는 웹 사이트를 방문할 때마다 사이트 디자이너가 의도한 대로 정확히 페이지가 표시될 것"*이라는 목표로 이러한 글꼴을 무료로 다운로드할 수 있는 *웹용 트루타입 핵심 글꼴*이라는 [이니셔티브](https://web.archive.org/web/20020124085641/http://www.microsoft.com/typography/fontpack/default.htm)를 주도했습니다. 예, 여기에는 [Comic Sans MS](https://docs.microsoft.com/en-us/typography/font-list/comic-sans-ms)로 설정된 사이트가 포함됩니다. 다음은 고전적인 웹 안전 글꼴 스택([`sans-serif`](https://developer.mozilla.org/docs/Web/CSS/font-family#%3Cgeneric-name%3E:~:text=sans%2Dserif,-Glyphs) 글꼴의 궁극적인 대체 포함)이며 이는 다음과 같이 보일 수 있습니다.

```css
body {
  font-family: Helvetica, Arial, sans-serif;
}
```

## 웹 글꼴

웹에 안전한 글꼴이 정말로 중요했던 시대는 오래전에 사라졌습니다. 오늘날 우리는 [웹 글꼴](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Web_fonts)을 갖고 있으며, 그중 일부는 노출된 다양한 축의 값을 변경하여 추가로 조정할 수 있는 [가변 글꼴](/variable-fonts/)이기도 합니다. 다운로드할 글꼴 파일을 지정하는 CSS 시작 부분에 [`@font-face`](https://developer.mozilla.org/docs/Web/CSS/@font-face) 블록을 선언하여 웹 글꼴을 사용할 수 있습니다.

```css
@font-face {
  font-family: 'FlamboyantSansSerif';
  src: url('flamboyant.woff2');
}
```

그런 다음, 다음과 같이 [`font-family`](https://developer.mozilla.org/docs/Web/CSS/font-family)를 지정하여 사용자 정의 웹 글꼴을 사용할 수 있습니다.

```css
body {
  font-family: 'FlamboyantSansSerif';
}
```

## 핑거프린트 벡터로 사용되는 로컬 글꼴

대부분의 웹 글꼴은 웹에서 제공됩니다. 그런데 흥미로운 사실은 `@font-face` 선언의 [`src`](https://developer.mozilla.org/docs/Web/CSS/@font-face/src#Values:~:text=%3Curl%3E%20%5B%20format(%20%3Cstring%3E%23%20)%20%5D%3F,-Specifies) 속성이 [`url()`](https://developer.mozilla.org/docs/Web/CSS/@font-face/src)과는 별도로 [`local()`](https://developer.mozilla.org/docs/Web/CSS/@font-face/src#format():~:text=downloaded.-,%3Cfont%2Dface%2Dname%3E) 함수를 허용한다는 것입니다. 이를 통해 사용자 정의 글꼴을 로컬로 로드할 수 있습니다(놀랍지 않나요!). 사용자가 자신의 운영 체제에 *FlamboyantSansSerif*를 설치한 경우 이를 다운로드하기보다는 로컬 복사본을 사용합니다.

```css
@font-face {
  font-family: 'FlamboyantSansSerif';
  src: local('FlamboyantSansSerif'), url('flamboyant.woff2');
}
```

이 접근 방식은 잠재적으로 대역폭을 절약할 수 있는 훌륭한 대체 메커니즘을 제공합니다. 인터넷에서는 불행히도 좋은 것을 가질 수 없습니다. `local()` 함수의 문제점은 브라우저 핑거프린트에 악용될 수 있다는 것입니다. 사용자가 설치한 글꼴 목록을 보면 꽤 식별할 수 있습니다. 많은 회사는 자체 회사 글꼴을 갖고 있으며 또한 해당 회사 직원의 랩톱에는 이러한 글꼴이 설치되어 있습니다. 예를 들어 Google에는 *Google Sans*라는 회사 글꼴이 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xivl6c1xM2VlqFf9GvgQ.png", alt="The macOS Font Book app showing a preview of the Google Sans font.", width="800", height="420" %} <figcaption> Google 직원의 노트북에 설치된 Google Sans 글꼴. </figcaption></figure>

공격자는 *Google Sans*와 같이 알려진 많은 회사 글꼴이 있는지 테스트하여 어느 회사에서 일하는지 확인하려고 할 수 있습니다. 공격자는 캔버스에서 이러한 글꼴로 설정된 텍스트를 렌더링하고 글리프를 측정하려고 시도합니다. 글리프가 회사 글꼴의 알려진 모양과 일치하면 공격자가 맞는 추측을 한 것입니다. 글리프가 일치하지 않으면 공격자는 회사 글꼴이 설치되지 않았으며 기본 대체 글꼴이 사용되었음을 알 수 있습니다. 이러한 내용이나 기타 브라우저의 핑거프린트 공격에 대한 자세한 내용은 Laperdix *외*의 [설문조사 문서](http://www-sop.inria.fr/members/Nataliia.Bielova/papers/Lape-etal-20-TWEB.pdf)를 참조하세요.

회사 글꼴은 별도의 설치된 글꼴 목록만 있어도 식별할 수 있습니다. 이러한 공격 벡터의 상황이 너무 나빠서 최근 WebKit 팀은 *"[사용 가능한 글꼴 목록에] 웹 글꼴과 운영 시스템과 함께 제공되는 글꼴만 포함하고 로컬 사용자가 설치한 글꼴은 포함하지 않기"*로 [결정했습니다](https://webkit.org/tracking-prevention/#table-of-contents-toggle:~:text=Changed%20font%20availability%20to%20web%20content,but%20not%20locally%20user%2Dinstalled%20fonts). (여기에 로컬 글꼴에 대한 액세스 권한 부여에 대한 기사가 있습니다.)

## 로컬 글꼴 액세스 API

이 문서의 시작은 여러분을 부정적인 감정을 느끼게 만들 수 있습니다. 우리는 정말로 좋은 글꼴은 가질 수 없을까요? 걱정마세요. 우리는 할 수 있을 거라 생각합니다. 세상이 무너져도 [빠져나갈 방법은 있습니다](http://hyperboleandahalf.blogspot.com/2013/05/depression-part-two.html#Blog1:~:text=like-,hopeless). 하지만 먼저 여러분 스스로에게 던질 수 있는 질문에 답하겠습니다.

### 웹 글꼴이 있다면 Local Font Access API가 필요한 이유는 무엇인가요?

전문가 수준의 디자인 및 그래픽 도구는 역사적으로 웹에서 제공하기 어려웠습니다. 한 가지 걸림돌은 디자이너가 로컬에 설치한 전문적으로 구성되고 유용한 다양한 글꼴에 액세스하고 사용할 수 없다는 것이었습니다. 웹 글꼴은 일부 게시 사용 사례를 활성화하지만 래스터라이저가 글리프 윤곽선을 렌더링하는 데 사용하는 벡터 글리프 모양 및 글꼴 테이블에 대한 프로그래밍 방식 액세스를 활성화하지 못합니다. 마찬가지로 웹 글꼴의 이진 데이터에 액세스할 수 있는 방법이 없습니다.

- 디자인 도구가 자체 오픈타입 레이아웃 구현을 수행하고, 글리프 모양에 대한 벡터 필터 또는 변환 수행과 같은 작업을 위해 디자인 도구가 더 낮은 수준에서 연결되도록 하려면 글꼴 바이트에 대한 액세스가 필요합니다.
- 개발자는 웹으로 가져오는 응용 프로그램에 대한 레거시 글꼴 스택이 있을 수 있습니다. 이러한 스택을 사용하려면 일반적으로 웹 글꼴이 제공하지 않는 글꼴 데이터에 직접 액세스해야 합니다.
- 일부 글꼴은 웹을 통한 제공이 허가되지 않을 수 있습니다. 예를 들어, Linotype은 [데스크톱 사용](https://www.linotype.com/25/font-licensing.html)만 포함하는 일부 글꼴에 대한 라이선스를 보유하고 있습니다.

Local Font Access API는 이러한 문제를 해결하기 위한 시도입니다. 이는 두 부분으로 구성됩니다.

- 사용자가 사용 가능한 전체 시스템 글꼴 집합에 대한 액세스 권한을 부여할 수 있도록 하는 **(글꼴 열거font enumeration) API**.
- 각 열거 결과에서 전체 글꼴 데이터를 포함하는 저수준(바이트 지향) **SFNT 컨테이너 액세스**를 요청하는 기능.

### 현재 상태 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">단계</th>
<th data-md-type="table_cell">상태</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 안내서 만들기</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/local-font-access" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초기 초안 작성</td>
<td data-md-type="table_cell">진행</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 피드백 수집 및 설계 반복</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">진행</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 원본 평가판</td>
<td data-md-type="table_cell"><a>완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 출시</td>
<td data-md-type="table_cell">시작되지 않음</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

### Local Font Access API를 사용하는 방법

#### about://flags를 통한 활성화

Local Font Access API를 로컬에서 실험하려면 `about://flags`에서 `#font-access` 플래그를 사용 설정합니다.

#### 기능 감지

Local Font Access API가 지원되는지 확인하려면 다음을 사용합니다.

```js
if ('fonts' in navigator) {
  // The Local Font Access API is supported
}
```

#### 권한 요청

사용자의 로컬 글꼴에 대한 액세스는 [`navigator.permissions.request()`](https://w3c.github.io/permissions/#requesting-more-permission)로 요청할 수 있는 `"local-fonts"` 권한 뒤에 있습니다.

```js
// Ask for permission to use the API
try {
  const status = await navigator.permissions.request({
    name: 'local-fonts',
  });
  if (status.state !== 'granted') {
    throw new Error('Permission to access local fonts not granted.');
  }
} catch (err) {
  // A `TypeError` indicates the 'local-fonts'
  // permission is not yet implemented, so
  // only `throw` if this is _not_ the problem.
  if (err.name !== 'TypeError') {
    throw err;
  }
}
```

#### 로컬 글꼴 열거

권한이 부여되면 `navigator.fonts`에 노출된 `FontManager` 인터페이스에서 `query()`를 호출하여 브라우저에 로컬로 설치된 글꼴을 요청할 수 있습니다. 그러면 페이지와 함께 공유되어 사용자가 전체 또는 하위 집합을 선택할 수 있도록 하는 선택기가 표시됩니다. 결과적으로 여러분이 반복할 수 있는 배열이 생성됩니다. 각 글꼴은 속성이 `family`(예: `"Comic Sans MS"`), `fullName`(예: `"Comic Sans MS"`), `postscriptName`(예: `"ComicSansMS"`)인 개체로 표시됩니다.

```js
// Query for all available fonts and log metadata.
try {
  const pickedFonts = await navigator.fonts.query();
  for (const metadata of pickedFonts) {
    console.log(metadata.postscriptName);
    console.log(metadata.fullName);
    console.log(metadata.family);
  }
} catch (err) {
  console.error(err.name, err.message);
}
```

#### SFNT 데이터 액세스

전체 [SFNT](https://en.wikipedia.org/wiki/SFNT) 액세스는 `FontMetadata` 개체의 `blob()` 메서드를 통해 사용할 수 있습니다. SFNT는 PostScript, 트루타입, 오픈타입, WOFF(Web Open Font Format) 글꼴 등과 같은 다른 글꼴을 포함할 수 있는 글꼴 파일 형식입니다.

```js
try {
  const pickedFonts = await navigator.fonts.query();
  for (const metadata of pickedFonts) {
    // We're only interested in a particular font.
    if (metadata.family !== 'Comic Sans MS') {
      continue;
    }
    // `blob()` returns a Blob containing valid and complete
    // SFNT-wrapped font data.
    const sfnt = await metadata.blob();

    const sfntVersion = new TextDecoder().decode(
      // Slice out only the bytes we need: the first 4 bytes are the SFNT
      // version info.
      // Spec: https://docs.microsoft.com/en-us/typography/opentype/spec/otff#organization-of-an-opentype-font
      await sfnt.slice(0, 4).arrayBuffer(),
    );

    let outlineFormat = 'UNKNOWN';
    switch (sfntVersion) {
      case '\x00\x01\x00\x00':
      case 'true':
      case 'typ1':
        outlineFormat = 'truetype';
        break;
      case 'OTTO':
        outlineFormat = 'cff';
        break;
    }
    console.log('Outline format:', outlineFormat);
  }
} catch (err) {
  console.error(err.name, err.message);
}
```

## 데모

아래 [데모](https://local-font-access.glitch.me/demo/)에서 Local Font Access API가 작동하는 것을 볼 수 있습니다. [소스 코드](https://glitch.com/edit/#!/local-font-access?path=README.md%3A1%3A0)도 확인하세요. 데모는 로컬 글꼴 선택기를 구현하는 [`<font-select>`](https://github.com/tomayac/font-select)라는 사용자 정의 요소를 보여줍니다.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/local-font-access?path=index.html&amp;previewSize=100" title="local-font-access on Glitch" allow="local-fonts" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 개인정보 보호 고려사항

`"local-fonts"` 권한은 높은  수준의 핑거프린트가 가능한 화면을 제공하는 것으로 보입니다. 그러나 브라우저는 원하는 것을 자유롭게 반환할 수 있습니다. 예를 들어, 익명성에 중점을 둔 브라우저는 브라우저에 내장된 기본 글꼴 세트만 제공하도록 선택할 수 있습니다. 이와 유사하게 브라우저는 디스크에 나타나는 것과 똑같은 테이블 데이터를 제공할 필요가 없습니다.

가능한 경우 Local Font Access API는 언급된 사용 사례를 활성화하는 데 필요한 정보만 정확히 노출하도록 설계되었습니다. 시스템 API는 설치된 글꼴 목록을 무작위 또는 정렬된 순서가 아니라 글꼴 설치 순서로 생성할 수 있습니다. 이러한 시스템 API에서 제공하는 설치된 글꼴 목록을 정확하게 반환하면 핑거프린트에 사용될 수 있는 추가 데이터를 노출할 수 있으며 우리가 활성화하려는 사용 사례는 이 순서를 유지할 경우 지원되지 않습니다. 결과적으로 이 API는 반환된 데이터를 반환하기 전에 정렬해야 합니다.

## 보안 및 권한

Chrome 팀은 사용자 제어, 투명성 및 인체 공학을 포함하여 [강력한 웹 플랫폼 기능에 대한 액세스 제어](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)에 정의된 핵심 원칙을 사용하여 Local Font Access API를 설계하고 구현했습니다.

### 사용자 제어

사용자의 글꼴에 대한 액세스는 전적으로 사용자의 통제 하에 있으며 [권한 레지스트리](https://w3c.github.io/permissions/#permission-registry)에 나열된 `"local-fonts"` 권한이 부여되지 않는 한 허용되지 않습니다.

### 투명성

사이트에 사용자의 로컬 글꼴에 대한 액세스 권한이 부여되었는지 여부는 [사이트 정보 시트](https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform=Desktop)에서 확인할 수 있습니다.

### 권한 지속성

`"local-fonts"` 권한은 페이지를 새로고침해도 유지됩니다. *사이트 정보* 시트를 통해 이를 철회할 수 있습니다.

## 피드백 {: #feedback }

Chrome 팀은 Local Font Access API에 대한 여러분의 경험을 듣고 싶습니다.

### API 설계에 대해 알려주세요

API에 대해 예상한 대로 작동하지 않는 것이 있습니까? 아니면 아이디어를 구현하는 데 필요한 메서드나 속성이 누락되었습니까? 보안 모델에 대한 질문이나 의견이 있으십니까? [해당 GitHub 리포지토리](https://github.com/WICG/local-font-access/issues) 에 사양 문제를 제출하거나 기존 문제에 생각을 추가하세요.

### 구현 문제 보고

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요? [new.crbug.com](https://new.crbug.com)에서 버그를 신고하세요. 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고, **구성요소** 상자에 `Blink>Storage>FontAccess`를 입력하세요. [Glitch](https://glitch.com/)는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

### API에 대한 지원 표시

Local Font Access API를 사용할 계획입니까? Chrome 팀이 기능의 우선순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

[@ChromiumDev](https://twitter.com/ChromiumDev)으로 해시태그 [`#LocalFontAccess`](https://twitter.com/search?q=%23LocalFontAccess&src=typed_query&f=live)를 포함한 트윗을 보내서 어디에서 어떻게 활용하고 있는지 알려주세요.

## 유용한 링크

- [설명자](https://github.com/WICG/local-font-access)
- [사양 초안](https://wicg.github.io/local-font-access/)
- [글꼴 열거에 대한 Chromium 버그](https://bugs.chromium.org/p/chromium/issues/detail?id=535764)
- [글꼴 테이블 액세스에 대한 Chromium 버그](https://crbug.com/982054)
- [ChromeStatus 항목](https://chromestatus.com/feature/6234451761692672)
- [GitHub repo](https://github.com/WICG/local-font-access/issues)
- [TAG 검토](https://github.com/w3ctag/design-reviews/issues/399)
- [Mozilla 표준 위치](https://github.com/mozilla/standards-positions/issues/401)
- [원본 평가판](https://developers.chrome.com/origintrials/#/view_trial/-7289075996899147775)

## 감사의 말

Local Font Access API 사양은 [Emil A. Eklund](https://www.linkedin.com/in/emilaeklund/), [Alex Russell](https://infrequently.org/), [Joshua Bell](https://www.linkedin.com/in/joshuaseanbell/), [Olivier Yiptong](https://github.com/oyiptong/)이 편집했습니다. 이 문서는 [Joe Medley](https://github.com/jpmedley), [Dominik Röttsches](https://fi.linkedin.com/in/dominik-r%C3%B6ttsches-7323684), [Olivier Yiptong](https://github.com/oyiptong/)이 검토했습니다. 영웅 이미지는 [Unsplash](https://unsplash.com/photos/qrjvkj-oS-M)의 [Brett Jordan](https://unsplash.com/@brett_jordan)이 제공했습니다.
