---
layout: post
title: 'prefers-color-scheme: 안녕! 내 오랜 친구 다크'
subhead: 지나친 과장, 혹은 필수? 다크 모드에 대한 모든 것과 사용자에게 도움이 되도록 이를 지원하는 방법에 대해 알아봅니다!
authors:
  - thomassteiner
date: 2019-06-27
updated: 2020-08-02
hero: image/admin/dgDcIJUyuWB5xNn9CODd.jpg
hero_position: 맨 아래
alt: Unsplash에서 Nathan Anderson이 제공한 야간의 산 실루엣 사진.
description: 이제 많은 장치에서 운영 체제 전반에 걸쳐 다크 모드 또는 다크 테마 경험을 지원합니다. 이 게시물에서는 웹 페이지에서 다크 모드를 지원하는 방법을 설명하고 모범 사례를 소개하며, dark-mode-toggle이라는 사용자 지정 요소에 대해 알아봅니다. 웹 개발자는 이 요소를 사용하여 사용자가 특정 웹 페이지에서 운영 체제 수준의 기본 설정을 재정의하도록 할 수 있습니다.
tags:
  - blog
  - css
feedback:
  - api
---

## 소개

{% Aside 'note' %} 저는 다크 모드의 역사와 이론에 대한 배경을 많이 연구했습니다. 다크 모드 작업에만 관심이 있다면 [소개 부분은 건너뛰어](#activating-dark-mode-in-the-operating-system)도 됩니다. {% endAside %}

### *다크 모드* 전의 다크 모드

<figure data-float="right">   {% Img src="image/admin/fmdRPm6K5SXiIRLgyz4y.jpg", alt="그린 스크린 컴퓨터 모니터", width="233", height="175" %}   <figcaption>그린 스크린(<a href="https://commons.wikimedia.org/wiki/File:Compaq_Portable_and_Wordperfect.JPG">출처</a>)</figcaption></figure>

우리는 다크 모드의 시초부터 많은 길을 거쳐왔습니다. 개인용 컴퓨팅이 태동하던 당시에는 다크 모드가 선택의 문제가 아니었습니다. 그저 사실이었죠. 흑백 <abbr title="Cathode-Ray Tube">CRT</abbr> 컴퓨터 모니터는  인광 스크린에 전자 빔을 쏘는 방식으로 작동했고 초기 CRT에 사용된 인광은 녹색이었습니다. 텍스트가 녹색으로 표시되고 화면의 나머지 부분은 검은색이었기 때문에 이러한 모델을 [그린 스크린](https://commons.wikimedia.org/wiki/File:Schneider_CPC6128_with_green_monitor_GT65,_start_screen.jpg)이라고도 많이 불렀습니다.

<figure data-float="left">   {% Img src="image/admin/l9oDlIO59oyJiXVegxIV.jpg", alt="다크 온 화이트 단어 처리", width="222", height="175" %}   <figcaption>다크 온 화이트(<a href="https://www.youtube.com/watch?v=qKkABzt0Zqg">출처</a>)</figcaption></figure>

이후에 도입된 컬러 CRT는 빨간색, 녹색 및 파란색 인광체를 사용하여 여러 색상을 표시했습니다. 세 가지 인광을 모두 활성화하면 흰색이 만들어집니다. 보다 정교한 <abbr title="What You See Is What You Get">WYSIWYG</abbr> [데스크톱 출판](https://en.wikipedia.org/wiki/Desktop_publishing)의 출현으로 가상 문서를 실제 종이와 비슷하게 만드는 아이디어가 인기를 얻었습니다.

<figure data-float="right">{% Img src="image/admin/lnuLLcQzIF7r08lt479k.png", alt="WorldWideWeb 브라우저의 다크 온 화이트 웹페이지", width="233", height="175" %}<figcaption> WorldWideWeb 브라우저(<a href="https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png">출처</a>)</figcaption></figure>

여기서부터 디자인 트렌드로서 *다크 온 화이트(Dark-on-White*)가 시작되었고, 이 트렌드는 [초기 문서 기반의 웹](http://info.cern.ch/hypertext/WWW/TheProject.html)까지 이어졌습니다. 최초의 브라우저인 [WorldWideWeb](https://en.wikipedia.org/wiki/WorldWideWeb)(이 때는 [CSS가 아직 생겨나지도](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#History) 않았음)은 이러한 방식으로 [웹페이지를 표시했습니다](https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png). 재미있는 사실: 터미널 기반 브라우저였던 두 번째 브라우저인 [Line Mode Browser](https://en.wikipedia.org/wiki/Line_Mode_Browser)는 그린 온 다크였습니다. 당시에 웹 페이지와 웹 앱이 일반적으로 밝은 배경에 어두운 텍스트로 디자인되어 [Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)을 포함한 사용자 에이전트 스타일시트에 기본적인 방식으로 자리를 잡게 되었습니다.

<figure data-float="left">{% Img src="image/admin/zCdyRdnAnbrB7aAB0TQi.jpg", alt="침대에 누워 스마트폰을 사용하는 모습", width="262", height="175" %}<figcaption> 침대에서 사용하는 스마트폰(출처: Unsplash)</figcaption></figure>

CRT의 시대는 지났습니다. 콘텐츠 소비와 제작은 <abbr title="액정 디스플레이">백라이트 LCD</abbr>나 에너지 절약형 <abbr title="활성 매트릭스 유기 발광 다이오드">AMOLED</abbr> 화면을 사용하는 모바일 기기로 옮겨가고 있습니다. 더 작고 더 휴대하기 쉬운 컴퓨터, 태블릿 및 스마트폰의 등장으로 새로운 사용 패턴이 생겨나고 있습니다. 웹 브라우징, 재미로 하는 코딩, 고급 게임과 같은 레저 작업은 야간에 어두운 환경에서 이루어지는 경우가 많습니다. 사람들은 심지어 밤에 침대에서 기기를 통한 탐닉에 빠집니다. 사람들이 어둠 속에서 기기를 더 많이 사용할수록 *라이트-온-다크*의 뿌리로 돌아가려는 아이디어가 더 힘을 얻고 있습니다.

### 왜 다크 모드인가?

#### 심미적 이유로 본 다크 모드

[다크 모드를 선호하거나 원하는 이유](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)를 물었을 때 *"눈이 편하다"*라고 대답한 사람들이 가장 많았고 *"우아하고 아름답다"*는 반응이 그 뒤를 이었습니다. Apple은 [다크 모드 개발자 문서](https://developer.apple.com/documentation/appkit/supporting_dark_mode_in_your_interface)에서 다음과 같이 확실히 밝히고 있습니다: *"밝은 모양 또는 어두운 모양을 선택할지의 여부는 대부분의 사용자에게 미학적인 문제이지, 주변 조명 조건과는 관련이 없을 수 있습니다."*

{% Aside 'note' %} 계속해서 [사람들이 다크 모드를 원하는 이유와 이를 사용하는 방식에 대한 사용자 연구](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)에 대해 더 읽어보세요. {% endAside %}

<figure data-float="right">   {% Img src="image/admin/WZ9I5g1YGG6S1TjygEIq.png", alt="Mac OS System 7에서 \"검정 바탕에 흰색\" 모드로 표시된 CloseView", width="193", height="225" %}   <figcaption>System 7 CloseView(<a href="https://archive.org/details/mac_Macintosh_System_7_at_your_Fingertips_1992">출처</a>)</figcaption></figure>

#### 접근성 도구로서의 다크 모드

실제로 다크 모드가 *필요*하고 이를 또 다른 접근성 도구로 사용하는 사람들(예: 저시력자)도 있습니다. 초기에 제가 찾을 수 있었던 이러한 접근성 도구로 [System 7](https://en.wikipedia.org/wiki/System_7)의 *CloseView*라는 기능이 있는데, 이를 통해 *흰색 바탕에 검정*과 *검정 바탕에 흰색* 사이를 전화할 수 있습니다. System 7은 컬러를 지원했지만 기본 사용자 인터페이스는 여전히 흑백이었습니다.

이러한 반전 형태의 기능 구현은 컬러가 도입된 후에는 그 장점이 퇴색되었습니다. [저시력자가 컴퓨팅 장치에 액세스하는 방식](https://dl.acm.org/citation.cfm?id=2982168)에 관한 *Szpiro 등*의 사용자 연구에 따르면, 인터뷰에 응한 모든 사용자는 반전된 이미지를 싫어했으며, 대신 많은 사람들이 어두운 배경에 밝은 텍스트를 선호하는 것으로 나타났습니다. Apple은 이미지, 미디어 및 어두운 색상 스타일을 사용하는 일부 앱을 제외하고 디스플레이의 색상을 반전시키는 [Smart Invert](https://www.apple.com//accessibility/iphone/vision/)라는 기능으로 이러한 사용자 선호도에 응답했습니다.

저시력의 특수한 형태는 디지털 눈피로라고도 하는 컴퓨터 시각 증후군(Computer Vision Syndrome)으로, 이는 *"컴퓨터(데스크톱, 노트북, 태블릿 포함) 및 기타 전자 디스플레이(예: 스마트폰 및 전자책 기기)의 사용과 관련하여 시각 및 시력에 나타나는 복합적 문제"*로 정의됩니다. 청소년이 특히 ​​야간에 전자 기기를 사용하면 수면 시간의 단축, 수면 개시 잠복기의 증가 및 수면 결핍의 증가 등을 겪을 위험이 커지는 것으로 [알려져](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4254760/) 있습니다. 또한, 블루라이트에 대한 노출은 [생체 리듬](https://support.apple.com/en-us/HT207570)과 수면 주기의 조절에 관여하는 것으로 널리 [보고](https://www.college-optometrists.org/oip-resource/computer-vision-syndrome--a-k-a--digital-eye-strain.html)되었으며 불규칙한 조명 환경은 수면 부족으로 이어져 기분 상태와 작업 성과에 영향을 미칠 수 있다고 [Rosenfield의 연구](https://www.college-optometrists.org/oip-resource/computer-vision-syndrome--a-k-a--digital-eye-strain.html)에서 제시하고 있습니다. 이러한 부정적인 영향을 제한하는 방법으로 iOS의 [Night Shift](https://support.apple.com/en-us/HT207570) 또는 Android의 [Night Light](https://support.google.com/pixelphone/answer/7169926?)와 같은 기능을 통해 디스플레이 색온도를 조정하여 블루라이트를 줄이면 효과를 볼 수 있고, 어두운 테마 또는 어두운 모드를 통해 전반적으로 밝은 조명이나 불규칙한 조명을 피하는 것도 효과적입니다.

#### AMOLED 화면의 다크 모드 절전

마지막으로 다크 모드는 <abbr title="활성 매트릭스 유기 발광 다이오드">AMOLED</abbr> 화면에서 *많은* 에너지를 절약하는 것으로 알려져 있습니다. YouTube와 같은 인기 있는 Google 앱에 초점을 맞춘 Android 사례 연구에 따르면 최대 60%까지 전력을 절약할 수 있는 것으로 나타났습니다. 아래 비디오에서 이러한 사례 연구와 앱별 절전 효과에 대한 자세한 내용을 확인할 수 있습니다.

<figure data-size="full">{% YouTube id='N_6sPd0Jd3g', startTime='305' %}</figure>

## 운영 체제에서 다크 모드 활성화

이제 많은 사용자에게 다크 모드가 중요한 이유에 대한 배경을 설명했으니 이를 지원하는 방법을 살펴보도록 하겠습니다.

<figure data-float="left">   {% Img src="image/admin/Yh6SEoWDK1SbqcGjlL6d.png", alt="Android Q 다크 모드 설정", width="218", height="250" %}   <figcaption>Android Q 다크 테마 설정</figcaption></figure>

다크 모드 또는 다크 테마를 지원하는 운영 체제에는 일반적으로 설정 어딘가에 이를 활성화할 수 있는 옵션이 있습니다. macOS X에서는 시스템 환경설정의 *일반* 섹션에 *모양*이라는 이름으로 있고(<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lUAnDhiGiZxigDbCqfn1.png'%20%7C%20imgix%20%7D%7D">스크린샷</a>), Windows 10에서는 *색상* 섹션에 *색상 선택*이라는 이름으로 제공됩니다(<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ahr8nkFttRPCe4RH8IEk.png'%20%7C%20imgix%20%7D%7D">스크린샷</a>). Android Q의 경우 *디스플레이*의 *다크 테마* 토글 스위치에서 찾을 수 있고(<a href="%7B%7B%20'image/admin/Yh6SEoWDK1SbqcGjlL6d.png'%20%7C%20imgix%20%7D%7D">스크린샷</a>) iOS 13에서는 설정의 *디스플레이 및 밝기* 섹션에서 *모양*을 변경할 수 있습니다(<a href="%7B%7B%20'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K0QTu4Elw1ETabtoJjZ1.jpg'%20%7C%20imgix%20%7D%7D">스크린샷</a>).

## `prefers-color-scheme` 미디어 쿼리

시작하기 전에 마지막으로 한 가지 이론을 덧붙이겠습니다. [미디어 쿼리](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries)를 통해 작성자는 렌더링되는 문서와 관계없이 사용자 에이전트 또는 디스플레이 장치의 값이나 기능을 테스트하고 쿼리할 수 있습니다. 이는 CSS `@media` 규칙에서 조건부로 문서에 스타일을 적용하기 위해 사용되고, HTML 및 JavaScript와 같은 다양한 기타 컨텍스트 및 언어에서도 사용됩니다. [미디어 쿼리 레벨 5](https://drafts.csswg.org/mediaqueries-5/)는 사용자가 선호하는 콘텐츠 표시 방식을 사이트에서 감지할 수 있는 한 가지 방법으로, 소위 사용자 기본 설정 미디어 기능을 도입합니다.

{% Aside 'note' %} ☝️ 사용자 선호도가 관련된 기존의 미디어 기능으로 페이지에서 움직임을 줄이고자 하는 요구를 감지할 수 있는 `prefers-reduced-motion`가 있습니다. 제가 전에 <a href="https://developers.google.com/web/updates/2019/03/prefers-reduced-motion" data-md-type="link">`prefers-reduced-motion`에 대해 글을 쓴</a> 적이 있습니다. {% endAside %}

기본 [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) 미디어 기능은 사용자가 페이지에 밝은 색상 또는 어두운 색상 테마를 사용하도록 요청했는지 감지하는 데 사용됩니다. 다음 값으로 작동합니다.

- `light`: 사용자가 시스템에 밝은 테마(밝은 배경에 어두운 텍스트)가 있는 페이지를 선호한다고 알렸음을 나타냅니다.
- `dark`: 사용자가 어두운 테마(어두운 배경에 밝은 텍스트)가 있는 페이지를 선호한다고 시스템에 알렸음을 나타냅니다.

{% Aside 'note' %} 이전 버전의 사양에는 세 번째 값인 `no-preference`가 포함되었습니다. 이는 사용자가 시스템에 어떤 선호도도 나타내지 않았음을 나타내기 위한 것입니다. 어떤 브라우저도 이를 구현하지 않았기 때문에 이 값은 사양에서 [제거](https://github.com/w3c/csswg-drafts/issues/3857#issuecomment-634779976)되었습니다. {% endAside%}

## 다크 모드 지원

### 브라우저에서 다크 모드가 지원되는지 확인하기

다크 모드는 미디어 쿼리를 통해 보고되므로 미디어 쿼리 `prefers-color-scheme`이 일치하는지 여부를 확인하여 현재 브라우저가 다크 모드를 지원하는지 쉽게 확인할 수 있습니다. 어떤 값도 포함하지 않고 단지 미디어 쿼리가 일치하는지만 확인합니다.

```js
if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  console.log('🎉 Dark mode is supported');
}
```

작성 당시를 기준으로, `prefers-color-scheme`은 데스크톱과 모바일(사용 가능한 경우)을 모두 포함해 Chrome 및 Edge 버전 76, Firefox 버전 67, Safari 버전 12.1(macOS) 및 버전 13(iOS)에서 지원됩니다. 다른 모든 브라우저의 경우에는 [지원 테이블을 사용할 수 있습니까?](https://caniuse.com/#feat=prefers-color-scheme)를 확인할 수 있습니다.

{% Aside 'note' %} 이전 브라우저에 다크 모드 지원을 추가하는 사용자 지정 요소인 [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle)를 사용할 수 있습니다. 이 내용은 [본 글 아래](#the-lessdark-mode-togglegreater-custom-element)에서 계속 다룹니다. {% endAside%}

### 요청 시 사용자의 선호도에 대해 알아내기

[`Sec-CH-Prefers-Color-Scheme`](/user-preference-media-features-headers/) 클라이언트 힌트 헤더를 사용하면 사이트에서 요청 시 선택적으로 사용자의 색 구성표 기본 설정을 얻을 수 있으므로 서버가 올바른 CSS를 인라인하여 잘못된 색 테마가 표시되는 것을 방지할 수 있습니다.

### 실제 다크 모드

마지막으로 다크 모드 지원이 실제 상황에서는 어떤지 살펴보겠습니다. [Highlander](https://en.wikipedia.org/wiki/Highlander_(film))와 마찬가지로 다크 모드에서도 어둡거나 밝음 *중 하나만 있을 수 있고, 둘 모두는 불가능합니다!* 이것을 언급하는 이유가 뭘까요? 이 사실이 로딩 전략에 영향을 미치기 때문입니다. **사용자가 현재 사용하지 않는 모드에 대한 중요 렌더링 경로에서 CSS를 다운로드하도록 강요하지 마세요.** 그래서 [중요하지 않은 CSS를 지연](/defer-non-critical-css/)시켜 로드 속도를 최적화하기 위해 실제로 다음 권장 사항을 보여주는 예제 앱에 대한 CSS를 세 부분으로 분할했습니다.

- 사이트에서 보편적으로 사용되는 일반 규칙을 포함하는 `style.css`
- 다크 모드에 필요한 규칙만 포함하는 `dark.css`
- 라이트 모드에 필요한 규칙만 포함하는 `light.css`

### 로드 전략

마지막 두 개인 `light.css` 및 `dark.css`는 `<link media>` 쿼리를 사용하여 조건부로 로드됩니다. 처음에는 [모든 브라우저가 `prefers-color-scheme`](https://caniuse.com/#feat=prefers-color-scheme)을 지원하지는 않을 것입니다([위의 패턴](#finding-out-if-dark-mode-is-supported-by-the-browser)을 사용하여 감지 가능). 저는 아주 작은 인라인 스크립트에 조건부로 삽입된 `<link rel="stylesheet">` 요소를 통해 기본 `light.css` 파일을 로드하는 식으로 이를 동적으로 처리합니다(라이트는 임의의 선택이며, 다크를 기본 대체 환경으로 만들 수도 있었음). [스타일이 지정되지 않은 콘텐츠의 플래시](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)를 방지하기 위해 `light.css`가 로드될 때까지 페이지의 콘텐츠를 숨깁니다.

```html
<script>
  // If `prefers-color-scheme` is not supported, fall back to light mode.
  // In this case, light.css will be downloaded with `highest` priority.
  if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
    document.documentElement.style.display = 'none';
    document.head.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="/light.css" onload="document.documentElement.style.display = \'\'">',
    );
  }
</script>
<!--
  Conditionally either load the light or the dark stylesheet. The matching file
  will be downloaded with `highest`, the non-matching file with `lowest`
  priority. If the browser doesn't support `prefers-color-scheme`, the media
  query is unknown and the files are downloaded with `lowest` priority (but
  above I already force `highest` priority for my default light experience).
-->
<link rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)" />
<link
  rel="stylesheet"
  href="/light.css"
  media="(prefers-color-scheme: light)"
/>
<!-- The main stylesheet -->
<link rel="stylesheet" href="/style.css" />
```

### 스타일시트 아키텍처

저는 [CSS 변수](https://developer.mozilla.org/docs/Web/CSS/var)를 최대한 활용합니다. 이렇게 하면 일반 `style.css`가 상당히 일반적이 될 수 있으며 모든 라이트 모드 또는 다크 모드 사용자 지정이 다른 두 파일인 `dark.css` 및 `light.css`에서 이루어집니다. 아래에서 실제 스타일의 일부를 볼 수 있지만 전체적인 아이디어를 전달하기에는 충분합니다. 기본적으로 *dark-on-light* 및 *light-on-dark* 기준 테마를 생성하는 두 개의 변수 `-⁠-⁠color` 및 `-⁠-⁠background-color`를 선언합니다.

```css
/* light.css: 👉 dark-on-light */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
}
```

```css
/* dark.css: 👉 light-on-dark */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
}
```

이 `style.css`에서는 `body { … }` 규칙에 이러한 변수를 사용합니다. 이러한 변수는 HTML에서 `<html>` 요소를 나타내고 특이성이 더 높다는 점을 빼고 `html` 선택기와 동일한 [`:root` CSS pseudo-class](https://developer.mozilla.org/docs/Web/CSS/:root) 선택기에서 정의되므로 아래로 캐스케이드되어 제 경우에 글로벌 CSS 변수를 선언하는 역할을 하게 됩니다.

```css
/* style.css */
:root {
  color-scheme: light dark;
}

body {
  color: var(--color);
  background-color: var(--background-color);
}
```

위의 코드 샘플에서 공백으로 구분된 값인 `light dark`를 포함한 [`color-scheme`](https://drafts.csswg.org/css-color-adjust-1/#propdef-color-scheme) 속성을 발견했을 것입니다.

이것은 내 앱이 지원하는 색상 테마를 브라우저에 알려주고 사용자 에이전트 스타일시트의 특수 형태를 활성화할 수 있도록 합니다. 그 결과 예를 들어 브라우저가 어두운 배경과 밝은 텍스트로 양식 필드를 렌더링하도록 하거나 스크롤 막대를 조정하거나 테마 인식 하이라이트 색상을 지원하는 데 도움을 줍니다. `color-scheme`의 정확한 세부 정보는 [CSS 색상 조정 모듈 레벨 1](https://drafts.csswg.org/css-color-adjust-1/)에 지정되어 있습니다.

{% Aside 'note' %} 🌒 [`color-scheme`이 실제로 하는 일](/color-scheme/)에 대해 자세히 읽어보세요. {% endAside %}

무엇보다도 내 사이트에서 중요한 내용에 대한 CSS 변수를 정의하는 것이 관건입니다. 의미적으로 스타일을 구성하면 다크 모드로 작업할 때 많은 도움이 됩니다. 예를 들어, `-⁠-⁠highlight-yellow` 대신 `-⁠-⁠accent-color` 변수를 호출하는 것이 좋은데, "yellow"는 실제로 다크 모드에서 노란색이 아닐 수 있고 그 반대의 경우도 마찬가지이기 때문입니다. 다음은 내 예에서 사용되는 다른 일부 변수들의 예입니다.

```css
/* dark.css */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
  --link-color: rgb(0, 188, 212);
  --main-headline-color: rgb(233, 30, 99);
  --accent-background-color: rgb(0, 188, 212);
  --accent-color: rgb(5, 5, 5);
}
```

```css
/* light.css */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
  --link-color: rgb(0, 0, 238);
  --main-headline-color: rgb(0, 0, 192);
  --accent-background-color: rgb(0, 0, 238);
  --accent-color: rgb(250, 250, 250);
}
```

### 전체 예

다음 [Glitch](https://dark-mode-baseline.glitch.me/) 임베드에서 위의 개념을 실제로 적용한 완전한 예제를 볼 수 있습니다. 해당하는 특정한 [운영 체제 설정](#activating-dark-mode-in-the-operating-system)에서 다크 모드를 전환하고 페이지가 어떻게 반응하는지 확인해 보세요.

<div style="height: 900px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://glitch.com/embed/#!/embed/dark-mode-baseline?path=style.css&amp;previewSize=100&amp;attributionHidden=true'   } %}</div>

### 로딩의 영향

이 예제를 사용해보면 미디어 쿼리를 통해 제가 `dark.css`와 `light.css`를 로드하는 이유를 알 수 있습니다. 다크 모드를 전환하고 페이지를 다시 로드해 보세요. 현재 일치하지 않는 특정 스타일시트가 여전히 로드되지만 우선순위가 가장 낮으므로 현재 사이트에서 필요한 리소스와 경합하지 않습니다.

{% Aside 'note' %} 😲 [브라우저가 일치하지 않는 미디어 쿼리로 스타일시트를 다운로드하는 이유](https://blog.tomayac.com/2018/11/08/why-browsers-download-stylesheets-with-non-matching-media-queries-180513)에 대해 읽어보세요. {% endAside %}

<figure>{% Img src="image/admin/flTdLliru6GmqqlOKjNx.png", alt="라이트 모드에서 다크 모드 CSS가 가장 낮은 우선순위로 로드되는 방식을 보여주는 네트워크 로드 다이어그램", width="800", height="417" %}<figcaption>라이트 모드의 사이트는 다크 모드 CSS를 가장 낮은 우선 순위로 로드합니다.</figcaption></figure>

<figure>{% Img src="image/admin/IDs6Le0VBhHu9QEDdxL6.png", alt="다크 모드에서 라이트 모드 CSS가 가장 낮은 우선 순위로 로드되는 방식을 보여주는 네트워크 로드 다이어그램", width="800", height="417" %}<figcaption>다크 모드의 사이트는 라이트 모드 CSS를 가장 낮은 우선 순위로 로드합니다.</figcaption></figure>

<figure>{% Img src="image/admin/zJqu5k3TIgcZf1OHWWIq.png", alt="기본 라이트 모드에서 다크 모드 CSS가 가장 낮은 우선 순위로 로드되는 방식을 보여주는 네트워크 로드 다이어그램", width="800", height="417" %}<figcaption> <code>prefers-color-scheme</code>을 지원하지 않는 브라우저에서 기본 라이트 모드의 사이트가 다크 모드 CSS를 가장 낮은 우선 순위로 로드합니다.</figcaption></figure>

### 다크 모드 변경에 대한 반응

다른 미디어 쿼리 변경과 마찬가지로 다크 모드 변경은 JavaScript를 통해 구독할 수 있습니다. 예를 들어 이것을 사용하여 페이지의 [파비콘](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#provide_great_icons_tiles)을 동적으로 변경하거나 Chrome에서 URL 표시줄의 색상을 결정하는 [`<meta name="theme-color">`](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera)를 변경할 수 있습니다. 위의 [전체 예제](#full-example)는 이러한 내용을 실제로 보여줍니다. 테마 색상과 파비콘 변경 사항을 보려면 [별도의 탭에서 데모](https://dark-mode-baseline.glitch.me/)를 여세요.

```js
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addListener((e) => {
    const darkModeOn = e.matches;
    console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
  });
```

Chromium 93 및 Safari 15부터 `meta` 테마 색상 요소의 `media` 특성을 사용하여 미디어 쿼리를 기반으로 색상을 조정할 수 있습니다. 일치하는 첫 번째 색상이 선택됩니다. 예를 들어 라이트 모드에 대한 색상과 다크 모드에 대한 색상을 각기 다르게 가질 수 있습니다. 작성 당시를 기준으로, 매니페스트에서는 이를 정의할 수 없습니다. [w3c/manifest#975 GitHub 문제](https://github.com/w3c/manifest/issues/975)를 참조하세요.

```html
<meta
  name="theme-color"
  media="(prefers-color-scheme: light)"
  content="white"
/>
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

## 다크 모드 디버깅 및 테스트

### DevTools에서 `prefers-color-scheme` 에뮬레이션

전체 운영 체제의 색 구성표를 전환하는 것은 매우 성가신 일이 될 수 있으므로, Chrome DevTools를 사용하여 현재 표시되는 탭에만 영향을 미치는 방식으로 사용자가 선호하는 색 구성표를 에뮬레이션할 수 있습니다. [명령 메뉴](https://developer.chrome.com/docs/devtools/command-menu/)를 열고 `Rendering` 입력을 시작하고 `Show Rendering` 명령을 실행한 다음, **CSS 미디어 요소 prefers-color-scheme 에뮬레이션** 옵션을 변경합니다.

<figure>   {% Img src="image/admin/RIq2z6Ja1zSzfNTHic5z.png", alt="A Chrome DevTools의 렌더링 탭에 있는 'CSS 미디어 요소 prefers-color-scheme 에뮬레이션' 옵션을 보여주는 스크린샷", width="800", height="552" %}</figure>

### Puppeteer로 `prefers-color-scheme` 스크린샷 만들기

[Puppeteer](https://github.com/GoogleChrome/puppeteer/)는 [DevTools 프로토콜](https://chromedevtools.github.io/devtools-protocol/)을 통해 Chrome 또는 Chromium을 제어하는 고급 API를 제공하는 Node.js 라이브러리입니다. [`dark-mode-screenshot`](https://www.npmjs.com/package/dark-mode-screenshot)을 사용하여 다크 모드와 라이트 모드 모두에서 페이지의 스크린샷을 만들 수 있는 Puppeteer 스크립트를 제공합니다. 이 스크립트를 일회성으로 실행하거나 CI(지속적 통합) 테스트 세트의 일부로 만들 수 있습니다.

```bash
npx dark-mode-screenshot --url https://googlechromelabs.github.io/dark-mode-toggle/demo/ --output screenshot --fullPage --pause 750
```

## 다크 모드 모범 사례

### 순수한 흰색은 피할 것

여기서 순수하게 흰색이 사용되지 않았다는 점을 알아차린 분들도 있을 겁니다. 주변의 어두운 콘텐츠로 빛이 번지는 것을 방지하기 위해 저는 약간 더 어두운 흰색을 선택합니다. `rgb(250, 250, 250)` 정도면 좋습니다.

### 사진 이미지 다시 채색 및 어둡게 만들기

아래 두 스크린샷을 비교해 보면 핵심 테마가 *다크 온 라이트*에서 *라이트 온 다크*로 변경되었을 뿐만 아니라 영웅 이미지도 약간 다르게 보이는 것을 알 수 있습니다. 저의 [사용자 연구](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)에 따르면 설문 응한 대다수의 사람들이 다크 모드가 활성화되어 있을 때 약간 덜 생생하고 덜 밝은 이미지를 선호하는 것으로 나타났습니다. 저는 이것을 *다시 채색한다*고 부릅니다.

<div class="switcher">
  <figure>{% Img src="image/admin/qzzYCKNSwoJr9BBEQlR7.png", alt="다크 모드에서 약간 더 어두워진 영웅 이미지", width="800", height="618" %}<figcaption> 영웅 이미지가 다크 모드에서 약간 더 어두워졌습니다.</figcaption></figure>
  <figure>{% Img src="image/admin/41RbLRZ5wzkoVnIRJkNl.png", alt="라이트 모드의 일반 영웅 이미지.", width="800", height="618" %}<figcaption> 라이트 모드의 일반 영웅 이미지.</figcaption></figure>
</div>

저의 이미지에서 CSS 필터를 통해 다시 채색할 수 있습니다. 이를 위해 URL에 `.svg`가 없는 모든 이미지와 일치하는 CSS 선택기를 사용합니다. 벡터 그래픽(아이콘)을 내 이미지(사진)와 다르게 다시 채색 처리할 수 있다는 것이 주된 개념이며 이에 대해서는 [다음 단락](#vector-graphics-and-icons)에서 좀 더 이야기하겠습니다. 나중에 유연하게 필터를 변경할 수 있도록 [CSS 변수](https://developer.mozilla.org/docs/Web/CSS/var)를 다시 사용하는 것에 주목하세요.

{% Aside 'note' %} 🎨 [다크 모드를 사용한 다시 채색 방식에 관한 사용자 연구](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)에 대해 자세히 읽어보세요. {% endAside %}

다시 채색하는 처리는 다크 모드에서만 필요하므로, 즉 `dark.css`가 활성일 때만 필요하므로 `light.css`에는 이에 상응하는 규칙이 없습니다.

```css
/* dark.css */
--image-filter: grayscale(50%);

img:not([src*=".svg"]) {
  filter: var(--image-filter);
}
```

#### JavaScript로 다크 모드 다시 채색 강도 사용자 정의

모든 사람이 같은 것은 아니며 사람마다 필요한 다크 모드가 다릅니다. 위에서 설명한 다시 채색 방식을 이용함으로써 저는 그레이스케일 강도를 [JavaScript를 통해 변경](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties#Values_in_JavaScript)할 수 있는 사용자 기본 설정으로 쉽게 만들 수 있으며 값을 `0%`로 설정하여 다시 채색을 완전히 비활성화할 수도 있습니다. [`document.documentElement`](https://developer.mozilla.org/docs/Web/API/Document/documentElement)는 문서의 루트 요소에 대한 참조를 제공합니다. 즉, 이것은 [`:root` CSS 의사 클래스](https://developer.mozilla.org/docs/Web/CSS/:root)로 참조할 수 있는 동일한 요소입니다.

```js
const filter = 'grayscale(70%)';
document.documentElement.style.setProperty('--image-filter', value);
```

### 벡터 그래픽 및 아이콘 반전시키기

제 경우에 `<img>` 요소를 통해 참조하는 아이콘으로 사용되는 벡터 그래픽의 경우, 상이한 다시 채색 방법을 사용합니다. [연구](https://dl.acm.org/citation.cfm?id=2982168) 결과에 따르면 사람들은 사진 반전을 좋아하지 않지만 대부분의 아이콘에서는 효과가 좋습니다. 다시, CSS 변수를 사용하여 일반 및 [`:hover`](https://developer.mozilla.org/docs/Web/CSS/:hover) 상태에서 반전의 양을 결정합니다.

<div class="switcher">
  <figure>{% Img src="image/admin/JGYFpAPi4233HrEKTQZp.png", alt="다크 모드에서 아이콘이 반전됩니다.", width="744", height="48" %}<figcaption> 다크 모드에서 아이콘이 반전됩니다.</figcaption></figure>
  <figure>{% Img src="image/admin/W8AWbuqWthI6CfFsYunk.png", alt="라이트 모드의 일반 아이콘", width="744", height="48" %}<figcaption> 라이트 모드의 일반 아이콘.</figcaption></figure>
</div>

`dark.css`에서만 아이콘을 반전시키고 `light.css`에서는 반전시키지 않은 방식, 그리고 사용자가 선택한 모드에 따라 아이콘이 약간 더 어둡거나 밝게 나타나도록 하기 위해 두 경우에 `:hover`가 다른 반전 강도를 얻는 방식에 주목하세요.

```css
/* dark.css */
--icon-filter: invert(100%);
--icon-filter_hover: invert(40%);

img[src*=".svg"] {
  filter: var(--icon-filter);
}
```

```css
/* light.css */
--icon-filter_hover: invert(60%);
```

```css
/* style.css */
img[src*=".svg"]:hover {
  filter: var(--icon-filter_hover);
}
```

### 인라인 SVG에 `currentColor` 사용

*인라인* SVG 이미지의 경우 [반전 필터를 사용](#invert-vector-graphics-and-icons)하는 대신, 요소의 `color` 속성 값을 나타내는 [`currentColor`](https://developer.mozilla.org/docs/Web/CSS/color_value#currentColor_keyword) CSS 키워드를 활용할 수 있습니다. 이를 통해 기본적으로 `color` 값을 받지 않는 속성에서 이 값을 사용할 수 있습니다. 편리하게도 `currentColor`가 SVG [`fill` 또는 `stroke` 특성](https://developer.mozilla.org/docs/Web/SVG/Tutorial/Fills_and_Strokes#Fill_and_Stroke_Attributes)의 값으로 사용되면 대신 색상 속성의 상속된 값에서 이 값을 가져옵니다. 더 좋은 점: [`<svg><use href="…"></svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/use)에서도 작동하므로 별도의 리소스를 가질 수 있고 `currentColor`는 컨텍스트에서 계속 적용됩니다. 이것은 *인라인* 또는 `<use href="…">` SVG에만 작동하며 이미지의 `src`로 참조되거나 CSS를 통해 참조되는 SVG에는 작동하지 않습니다. 아래 데모에서 이것이 적용된 모습을 볼 수 있습니다.

```html/2
<!-- Some inline SVG -->
<svg xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
>
  […]
</svg>
```

<div style="height: 950px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://glitch.com/embed/#!/embed/dark-mode-currentcolor?path=light.css&amp;previewSize=100',     title: 'dark-mode-currentcolor on Glitch'   } %}</div>

### 모드 간 부드러운 전환

`color`와 `background-color`가 모두 [애니메이션 가능한 CSS 속성](https://www.quackit.com/css/css3/animations/animatable_properties/)이라는 사실 덕분에 다크 모드에서 라이트 모드, 또는 그 반대로 부드럽게 전환할 수 있습니다. 두 속성에 대해 두 개의 `transition`만 선언하여 애니메이션을 만들 수 있습니다. 아래 예는 전반적인 아이디어를 보여주며 [데모](https://dark-mode-baseline.glitch.me/)에서 라이브로 체험할 수 있습니다.

```css
body {
  --duration: 0.5s;
   --timing: ease;

  color: var(--color);
  background-color: var(--background-color);

  transition:
    color var(--duration) var(--timing),
    background-color var(--duration) var(--timing);
}
```

### 다크 모드로 아트 디렉션

일반적으로 로딩 성능상의 이유로 `<link>` 요소의 `media` 속성에서 `prefers-color-scheme`만으로 작업할 것을 권장하지만(스타일시트의 인라인 대신) HTML 코드에서 인라인으로 직접 `prefers-color-scheme`을 사용해야 할 때가 있습니다. 아트 디렉션이 이러한 경우에 해당합니다. 웹에서 아트 디렉션은 페이지의 전반적인 시각적 모양과 페이지가 시각적으로 소통하고, 분위기를 자극하고, 특징을 부각시키고, 대상 청중에게 심리적으로 호소하는 방식을 다룹니다.

다크 모드의 경우, 특정 모드에서 어떤 이미지가 가장 좋은지, 그리고 [이미지 다시 채색](#photographic-images)이 충분히 좋지 *않을* 수 있는지 여부를 결정하는 것은 디자이너의 판단에 달려 있습니다. `<picture>` 요소와 함께 사용하면 표시할 이미지의 `<source>`가 `media` 특성에 종속적이 될 수 있습니다. 아래 예에는 다크 모드의 경우 서반구를 표시하고 라이트 모드의 경우 동반구를 표시하거나, 기본 설정이 지정되지 않은 경우 다른 모든 경우에 기본적으로 동반구를 표시합니다. 이것은 물론 순전히 설명을 위한 것입니다. 장치에서 직접 다크 모드를 전환하여 차이를 확인해 보세요.

```html
<picture>
  <source srcset="western.webp" media="(prefers-color-scheme: dark)">
  <source srcset="eastern.webp" media="(prefers-color-scheme: light)">
  <img src="eastern.webp">
</picture>
```

<div style="height: 600px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://glitch.com/embed/#!/embed/dark-mode-picture?path=index.html&amp;previewSize=100',     title: 'dark-mode-picture on Glitch'   } %}</div>

### 다크 모드, 그러나 옵트아웃 추가

위의 [왜 다크 모드인가?](#why-dark-mode) 섹션에서 언급했듯이 다크 모드는 대부분의 사용자에게 미학적인 선택입니다. 결과적으로 일부 사용자는 실제로 운영 체제 UI를 어둡게 유지하고 싶지만 웹 페이지는 원래 보던 익숙한 방식으로 보는 것을 선호할 수 있습니다. 좋은 패턴은 처음에는 브라우저가 `prefers-color-scheme`을 통해 보내는 신호를 따르지만 선택적으로 사용자가 시스템 수준 설정을 재정의할 수 있도록 하는 것입니다.

#### `<dark-mode-toggle>` 맞춤 요소

물론 이를 위한 코드를 직접 생성할 수도 있지만 이 목적에 맞게 제가 만든 기성 사용자 정의 요소(웹 구성 요소)를 사용할 수도 있습니다. 이 요소는 [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle)라고 하며 완전히 사용자 정의할 수 있는 토글(다크 모드: 켜기/끄기) 또는 테마 전환기(테마: 라이트/다크)를 페이지에 추가시킵니다. 아래의 데모는 실제 이 요소가 사용된 모습을 보여줍니다(이런, [위의](https://dark-mode-picture.glitch.me/) [다른](https://dark-mode-baseline.glitch.me/) 모든 [예](https://dark-mode-currentcolor.glitch.me/)에서도 🤫 조용히 숨겨 놓았군요).

```html
<dark-mode-toggle
    legend="Theme Switcher"
    appearance="switch"
    dark="Dark"
    light="Light"
    remember="Remember this"
></dark-mode-toggle>
```

<div class="switcher">
  <figure>     {% Img src="image/admin/Xy3uus69HnrkRPO4EuRu.png", alt="라이트 모드에서 {dark-mode-toggle0}", width="140", height="76" %}     <figcaption>       라이트 모드에서 <code>&lt;dark-mode-toggle&gt;</code>.     </figcaption>   {/dark-mode-toggle0}</figure>
  <figure>     {% Img src="image/admin/glRVRJpQ9hMip6MbqY9N.png", alt="라이트 모드에서 {dark-mode-toggle0}.", width="140", height="76" %}     <figcaption>       다크 모드에서 <code>&lt;dark-mode-toggle&gt;</code>.     </figcaption>   {/dark-mode-toggle0}</figure>
</div>

아래 데모에서 오른쪽 상단 모서리에 있는 다크 모드 컨트롤을 클릭하거나 탭해 보세요. 세 번째와 네 번째 컨트롤에서 확인란을 선택하면 페이지를 새로 고치더라도 모드 선택이 기억된다는 것을 알 수 있습니다. 이를 통해 방문자는 운영 체제를 다크 모드로 유지하면서 사이트는 라이트 모드로 유지할 수 있습니다(그 반대도 마찬가지).

<div style="height: 800px; width: 100%;">   {% IFrame {     allow: 'geolocation; microphone; camera; midi; vr; encrypted-media',     src: 'https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html'   } %}</div>

## 결론

다크 모드를 지원하고 작업하는 것은 디자인을 재미 있고 새롭게 창조하는 길을 열어줍니다. 일부 방문자에게는 사이트를 처리할 수 없는 것과 행복한 사용자가 되는 것의 차이가 될 수 있습니다. 몇 가지 함정이 있고 신중한 테스트가 확실히 요구되지만 다크 모드는 확실히 모든 사용자에 대한 관심을 보여줄 좋은 기회입니다. 이 게시글에서 언급한 모범 사례와 [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) 사용자 지정 요소와 같은 헬퍼를 통해 자신감을 가지고 멋진 다크 모드 경험을 만들어낼 수 있을 것으로 생각합니다. 이 게시물이 도움이 되었거나 자작품이 있다면, 또는 개선을 위한 제안이 있으면 [Twitter에서 알려주세요.](https://twitter.com/tomayac) 읽어 주셔서 감사합니다! 🌒

## 관련된 링크

`prefers-color-scheme` 미디어 쿼리 리소스:

- [Chrome Platform 현황 페이지](https://chromestatus.com/feature/5109758977638400)
- [Chromium 버그](https://crbug.com/889087)
- [미디어 쿼리 레벨 5 사양](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)

`color-scheme` 메타 태그 및 CSS 속성 리소스:

- [`color-scheme` CSS 속성 및 메타 태그](/color-scheme/)
- [Chrome Platform 현황 페이지](https://chromestatus.com/feature/5330651267989504)
- [Chromium 버그](http://crbug.com/925935)
- [CSS 색상 조정 모듈 레벨 1 사양](https://drafts.csswg.org/css-color-adjust-1/)
- [메타 태그 및 CSS 속성에 대한 CSS WG GitHub 이슈](https://github.com/w3c/csswg-drafts/issues/3299)
- [메타 태그에 대한 HTML WHATWG GitHub 이슈](https://github.com/whatwg/html/issues/4504)

일반 다크 모드 링크:

- [Material Design—다크 테마](https://material.io/design/color/dark-theme.html)
- [Web Inspector의 다크 모드](https://webkit.org/blog/8892/dark-mode-in-web-inspector/)
- [WebKit의 다크 모드 지원](https://webkit.org/blog/8840/dark-mode-support-in-webkit/)
- [Apple Human Interface 가이드라인—다크 모드](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/)

이 게시물에 대한 배경 연구 자료:

- [다크 모드의 "supported-color-schemes"가 실제로 하는 역할은? 🤔](https://medium.com/dev-channel/what-does-dark-modes-supported-color-schemes-actually-do-69c2eacdfa1d)
- [어둠이 있게 하라! 🌚 아마도…](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)
- [다크 모드를 위한 다시 채색](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)

## 감사의 말

`prefers-color-scheme` 미디어 기능, `color-scheme` CSS 속성 및 관련 메타 태그는 👏 [Rune Lillesveen](https://twitter.com/runeli)이 구현했습니다. Rune은 [CSS 색상 조정 모듈 레벨 1](https://drafts.csswg.org/css-color-adjust-1/) 사양의 공동 편집자로 참여했습니다. 이 글을 검토해준 [Lukasz Zbylut](https://www.linkedin.com/in/lukasz-zbylut/), [Rowan Merewood](https://twitter.com/rowan_m), [Chirag Desai](https://www.linkedin.com/in/chiragd/) 및 [Rob Dodson](https://twitter.com/rob_dodson)에게 감사드립니다. [로딩 전략](#loading-strategy)은 [Jake Archibald](https://twitter.com/jaffathecake)의 아이디어입니다. [Emilio Cobos Álvarez](https://twitter.com/ecbos_)는 저에게 올바른 `prefers-color-scheme` 감지 방법을 알려 주었습니다. 참조된 SVG 및 `currentColor`에 대한 팁은 [Timothy Hatcher](https://twitter.com/xeenon)가 제공한 것입니다. 마지막으로, 이 기사의 권장 사항에 초석이 된 다양한 사용자 연구를 위해 힘써준 많은 익명 참가자에게 감사드립니다. [Nathan Anderson](https://unsplash.com/photos/kujXUuh1X0o)에서 영웅 이미지를 제공했습니다.
