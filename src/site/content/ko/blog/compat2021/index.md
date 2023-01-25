---
layout: post
title: 'Compat 2021: 웹에서 5가지 주요 호환성 문제 제거'
subhead: |-
  Google은 웹 개발자를 위한 다음과 같은 상위 5가지 브라우저 호환성 문제를 해결하기 위해 다른 브라우저 공급업체 및 업계 파트너와 협력하고 있습니다.
  CSS flexbox, CSS 그리드, `position:sticky`, `aspect-ratio` 및 CSS 변환.
description: "Google이 어떻게 웹 개발자를 위한 다음과 같은 상위 5가지 브라우저 호환성 문제를 해결하기 위해 다른 브라우저 공급업체 및 업계 파트너와 협력하고 있는지 알아보세요. CSS flexbox, CSS 그리드, `position:sticky`, `aspect-ratio` 및 CSS 변환."
authors:
  - robertnyman
  - foolip
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/KQ5oNcLGKdBSuUM8pFPx.jpeg
alt: 조각이 빠진 퍼즐입니다.
date: 2021-03-22
updated: 2021-11-16
tags:
  - blog
  - css
---

Google은 다른 브라우저 공급업체 및 업계 파트너와 협력하여 웹 개발자가 겪는 상위 5가지 브라우저 호환성 문제를 해결하고 있습니다. 초점 영역은 CSS flexbox, CSS Grid, `position: sticky`, `aspect-ratio` 및 CSS 변환입니다. 참여 방법을 확인하고 [팔로우하여 기여 방법](#contribute)을 알아보세요.

## 배경

웹에서의 호환성은 항상 개발자에게 큰 도전이었습니다. 지난 몇 년 동안 Google과 Mozilla 및 Microsoft를 포함한 기타 파트너는 상황을 개선하기 위한 작업 및 우선순위 지정을 추진하고 웹 개발자의 가장 큰 고충에 대해 자세히 알아보기 시작했습니다. 이 프로젝트는 [Google의 개발자 만족도](/developer-satisfaction)(DevSAT) 작업과 연결되어 있으며 2019년에 [MDN DNA(개발자 요구 평가) 설문조사](https://insights.developer.mozilla.org/)가 만들어졌으며 2020년 [MDN 브라우저 호환성 보고서 2020](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)에 제시된 심층 연구로 인해 더욱 큰 규모로 시작되었습니다. [CSS 현황](https://stateofcss.com/) 및 [JS 현황](https://stateofjs.com/) 설문조사와 같은 다양한 채널에서 추가 연구가 수행되었습니다.

2021년의 목표는 5가지 핵심 초점 영역에서 브라우저 호환성 문제를 제거하여 개발자가 이를 신뢰할 수 있는 기반으로 자신 있게 구축할 수 있도록 하는 것입니다. 이 노력을 [**#Compat 2021**](https://twitter.com/search?q=%23compat2021&src=typed_query&f=live)이라고 합니다.

## 집중할 대상 선택

기본적으로 모든 웹 플랫폼에 브라우저 호환성 문제가 있지만 이 프로젝트의 초점은 가장 문제가 많은 소수의 영역에 초점을 맞추고 있습니다.

호환성 프로젝트는 우선 순위를 정할 영역에 영향을 미치는 여러 기준을 사용하며 그 중 일부는 다음과 같습니다.

- 기능 사용. 예를 들어, flexbox는 모든 페이지 보기의 [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692)에서 사용되며 [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)에서 채택이 크게 증가하고 있습니다.

- 버그 수( [Chromium](https://bugs.chromium.org/p/chromium/issues/list), [Gecko](https://bugzilla.mozilla.org/describecomponents.cgi), [WebKit](https://bugs.webkit.org/) ) 및 Chromium의 경우 해당 버그에 별이 몇 개 있습니다.

- 조사 결과:

    - [MDN DNA 설문 조사](https://insights.developer.mozilla.org/)
    - [MDN 브라우저 호환성 보고서](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
    - 가장 잘 알려지고 사용되는 기능의 [CSS 현황](https://2020.stateofcss.com/en-US/features/)

- [web-platform-tests](https://github.com/web-platform-tests/wpt#the-web-platform-tests-project)의 테스트 결과. 예를 들어 [wpt.fyi의 flexbox](https://wpt.fyi/results/css/css-flexbox)입니다.

- 가장 많이 검색된 기능을 [사용할 수 있습니까?](https://caniuse.com/)

## 2021년 5대 중점 분야

2020년에 Chromium은 2020년에 [Chromium의 브라우저 호환성 개선](https://blog.chromium.org/2020/06/improving-chromiums-browser.html)에 설명된 주요 영역을 다루는 작업을 시작했습니다. 2021년, 우리는 더 멀리 나아가기 위한 헌신적인 노력을 시작합니다. Google과 [Microsoft는](https://www.igalia.com/)[Igalia](https://blogs.windows.com/msedgedev/2021/03/22/better-compatibility-compat2021/)와 함께 Chromium의 주요 문제를 해결하기 위해 협력하고 있습니다. Chromium 및 WebKit의 정기적인 기고자이자 임베디드 장치용 공식 WebKit 포트의 유지 관리자인 Igalia는 이러한 호환성 노력에 매우 지원하고 참여했으며 식별된 문제를 해결하고 추적하는 데 도움이 될 것입니다.

다음은 2021년에 수정하기로 약속된 영역입니다.

### CSS flexbox

[CSS flexbox](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout)는 [웹에서 널리 사용](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692)되며 개발자에게는 여전히 몇 가지 주요 과제가 있습니다. 예를 들어 [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=721123)과 [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209983)는 `auto-height` 플렉스 컨테이너에 문제가 있어 이미지 크기가 잘못 조정됩니다.

<div class="switcher">
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/qmKoKHkZga5hgBeiHuBz.png", alt="체스판의 확대 사진입니다.", width="800", height="400" %}<figcaption style="margin-top: auto"> 버그로 인해 이미지 크기가 잘못되었습니다.</figcaption></figure>
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/0ruhCiZKRP9jBhnN70Xh.png", alt="체스판", width="800",height="800" %}<figcaption style="margin-top: auto"> 올바른 크기의 이미지입니다.<br> <a href="https://unsplash.com/photos/ab5OK9mx8do">Alireza Mahmoudi</a>의 사진.</figcaption></figure>
</div>

[Igalia의 flexbox Cats](https://blogs.igalia.com/svillar/2021/01/20/flexbox-cats-a-k-a-fixing-images-in-flexbox/) 블로그 게시물은 더 많은 예를 통해 이러한 문제에 대해 자세히 설명합니다.

#### 우선순위가 높은 이유

- 설문 조사: [MDN 브라우저 호환성 보고서의 주요](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html) 문제, [CSS 현황](https://2020.stateofcss.com/en-US/features/)에서 가장 많이 알려져 있고 사용됨
- 테스트: 모든 브라우저에서 [85% 통과](https://wpt.fyi/results/css/css-flexbox)
- 사용량: 페이지 뷰의 [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692), [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)에서 크게 증가

### CSS 그리드

[CSS 그리드](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout)는 최신 웹 레이아웃을 위한 핵심 빌딩 블록으로, 많은 이전 기술과 해결 방법을 대체합니다. 채택이 증가함에 따라 브라우저 간의 차이가 그것을 피할 이유가 되지 않도록 견고해야 합니다. 부족한 영역 중 하나는 Gecko에서는 지원되지만 [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=759665) 또는 [WebKit](https://bugs.webkit.org/show_bug.cgi?id=204580)에서는 지원되지 않는 그리드 레이아웃을 애니메이션하는 기능입니다. 지원되면 다음과 같은 효과가 가능합니다.

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Ovs6wg9o5AJUG4IIoVvj.mp4", height="400", controls=false, autoplay=true, loop=true, muted=true, playinline=true %}<figcaption> <a href="https://chenhuijing.com/blog/recreating-the-fools-mate-chess-move-with-css-grid/">Chen Hui Jing</a>의 애니메이션 체스 데모.</figcaption></figure>

#### 우선순위가 높은 이유

- 설문 조사: [MDN 브라우저 호환성 보고서 2위](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html) , 잘 알려져 있지만 [CSS 현황](https://2020.stateofcss.com/en-US/features/)에서는 덜 사용됨
- 테스트: 모든 브라우저에서 [75% 통과](https://wpt.fyi/results/css/css-grid)
- 사용량: [8% 및 꾸준히 증가](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693), [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)에서 약간 증가

{% Aside %} [subgrid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid)와 같은 새로운 기능이긴 하지만  개발자에게 중요합니다, 그것은 이 특정 노력의 일부가 아닙니다. 계속하려면 [MDN의 Subgrid 호환성](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid#browser_compatibility)을 참조하세요. {% endAside %}

### CSS 위치: 고정

[고정 위치 지정을](https://developer.mozilla.org/docs/Web/CSS/position#sticky_positioning) 사용하면 콘텐츠가 뷰포트 가장자리에 고정될 수 있으며 일반적으로 뷰포트 상단에 항상 표시되는 헤더에 사용됩니다. 모든 브라우저에서 지원되지만 의도한 대로 작동하지 않는 일반적인 사용 사례가 있습니다. 예를 들어 [고정 테이블 헤더](https://bugs.chromium.org/p/chromium/issues/detail?id=702927)는 Chromium에서 지원되지 않으며 이제는 [플래그 뒤에서 지원](https://bugs.chromium.org/p/chromium/issues/detail?id=958381) 되지만 결과는 브라우저 간에 일관되지 않습니다.

<div class="switcher">
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/DtNtuWCZUNwi7GGSBPvA.png", alt="", width="250", height="350" %}<figcaption> "TablesNG"가 있는 Chromium</figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/hJwLpLeJNfG6kVBUK9Yn.png", alt="", width="250", height="350" %}<figcaption> Gecko</figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/od1YyD2BoBqfrnkzynUK.png", alt="", width="250", height="350" %}<figcaption> WebKit</figcaption></figure>
</div>

Rob Flack의 <a href="https://output.jsbin.com/xunosud">고정 테이블 헤더 데모</a>를 확인하세요.

#### 우선순위가 높은 이유

- 설문 조사: [CSS](https://2020.stateofcss.com/en-US/features/) 현황에서 널리 알려져 있거나 사용 되며 [MDN 브라우저 호환성 보고서](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)에서 여러 번 언급되었습니다.
- 테스트: 모든 브라우저에서 [66% 통과](https://wpt.fyi/results/css/css-position/sticky?label=master&label=experimental&product=chrome&product=firefox&product=safari&aligned&q=%28status%3A%21missing%26status%3A%21pass%26status%3A%21ok%29)
- 사용량: [8%](https://www.chromestatus.com/metrics/feature/timeline/popularity/3354)

### CSS aspect-ratio 속성

새로운 [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) CSS 속성을 사용하면 요소에 대한 일관된 너비 대 높이 비율을 쉽게 유지할 수 있으므로 잘 알려진 다음과 같은 [`padding-top` hack](/aspect-ratio/#the-old-hack-maintaining-aspect-ratio-with-padding-top)이 필요하지 않습니다.

<div class="switcher">{% Compare 'worse', 'Using padding-top' %} ```css .container {width: 100%; padding-top: 56.25%; } ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Using aspect-ratio' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

매우 일반적인 사용 사례이기 때문에 널리 사용될 것으로 예상되며 모든 일반적인 시나리오와 브라우저 전반에서 견고하게 유지되기를 원합니다.

#### 우선순위가 높은 이유

- 설문 조사: 이미 잘 알려져 있지만 [CSS 현황](https://2020.stateofcss.com/en-US/features/)에서는 아직 널리 사용되지 않습니다.
- 테스트: 모든 브라우저에서 [27% 통과](https://wpt.fyi/results/css/css-sizing/aspect-ratio)
- 사용량: [3%](https://www.chromestatus.com/metrics/css/timeline/popularity/657) 및 증가할 것으로 예상됨

### CSS 변환

[CSS 변환](https://developer.mozilla.org/docs/Web/CSS/transform)은 수년 동안 모든 브라우저에서 지원되었으며 웹에서 널리 사용됩니다. 그러나 특히 애니메이션 및 3D 변환과 같이 브라우저 간에 동일하게 작동하지 않는 영역이 여전히 많이 남아 있습니다. 예를 들어 카드 뒤집기 효과는 브라우저 간에 매우 일관성이 없을 수 있습니다.

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/RhyPpk7dUooEobKZ3VOC.mp4", controls=false, autoplay=true, loop=true, muted=true, playinline=true %}<figcaption> Chromium(왼쪽), Gecko(가운데) 및 WebKit(오른쪽)의 카드 뒤집기 효과. <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=1008483#c42">버그 코멘트</a>에서 David Baron의 데모.</figcaption></figure>

#### 우선순위가 높은 이유

- 설문 조사: [CSS 현황](https://2020.stateofcss.com/en-US/features/)에서 매우 잘 알려져 있고 사용됨
- 테스트: 모든 브라우저에서 [55% 통과](https://wpt.fyi/results/css/css-transforms)
- 사용량: [80%](https://www.chromestatus.com/metrics/css/timeline/popularity/446)

## 기여하고 팔로우하는 방법 {: #contribute }

[@ChromiumDev](https://twitter.com/ChromiumDev) 또는 [Compat 2021의 공개 메일링 리스트](https://groups.google.com/g/compat2021)에 게시한 업데이트를 팔로우하고 공유하세요. 확실히 버그가 존재하는지 확인하거나 겪고 있는 문제에 대한 [파일](/how-to-file-a-good-bug/)을 제출하고, 빠진 게 있다면 위의 채널을 통해 연락하세요.

여기 web.dev에 진행 상황에 대한 정기적인 업데이트가 있으며 [Compat 2021 대시보드](https://wpt.fyi/compat2021)에서 각 중점 영역에 대한 진행 상황을 확인할 수도 있습니다.

<figure><p data-md-type="paragraph"><a href="https://wpt.fyi/compat2021">{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/BgX0dnesIhLaFAKyILzk.png", alt="Compat 2021 대시보드", width="800", height="942" %}</a></p>
<figcaption>Compat 2021 대시보드(2021년 11월 16일에 찍은 스크린샷).</figcaption></figure>

안정성과 상호 운용성을 개선하기 위한 브라우저 공급업체 간의 이러한 공동 노력이 웹에서 놀라운 것을 구축하는 데 도움이 되기를 바랍니다!
