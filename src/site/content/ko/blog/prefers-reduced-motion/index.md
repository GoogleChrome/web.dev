---
layout: post
title: 'prefers-reduced-motion: 때로는 움직임이 적을수록 더 많음'
subhead: |2-

  prefers-reduced-motion 미디어 쿼리는 사용자가 요청했는지 여부를 감지합니다.

  운영 체제에서 사용하는 애니메이션이나 모션의 양을 최소화합니다.
authors:
  - thomassteiner
description: prefers-reduced-motion 미디어 쿼리는 시스템이 사용하는 애니메이션이나 모션의 양을 최소화하도록 사용자가 요청했는지 여부를 감지합니다. 이것은 최소화된 애니메이션이 필요하거나 선호하는 사용자를 위한 것입니다. 예를 들어, 전정 장애가 있는 사람들은 종종 애니메이션이 최소한으로 유지되기를 원합니다.
date: 2019-03-11
updated: 2019-12-10
tags:
  - blog
  - media-queries
  - css
hero: image/admin/LI2vYKZwQ98w3MLtUF8V.jpg
alt: 기차에서 여성의 타임랩스
feedback:
  - api
---

모든 사람이 장식용 애니메이션이나 전환을 좋아하는 것은 아니며, 일부 사용자는 시차 스크롤, 확대 효과 등에 직면했을 때 노골적으로 멀미를 경험합니다. Chrome 74는 이러한 기본 설정을 표시한 사용자를 위해 사이트의 모션 축소 변형을 설계할 수 있는 사용자 기본 설정 미디어 쿼리 `prefers-reduced-motion`를 지원합니다.

## 실생활과 웹에서 너무 많은 움직임

다른 날, 나는 아이들과 아이스 스케이팅을 하고 있었습니다. 날씨가 좋았고, 햇빛이 비췄고, 아이스 링크는 사람들로 가득 찼습니다⛸. 단 한가지 문제점은 저는 군중들을 잘 다루지 못한다는 것입니다. 움직이는 표적이 너무 많아서, 저는 어떤 것에 집중하지 못하고, 결국 길을 잃고, 마치 개미집🐜을 쳐다보는 것 같은 시각적 과부하를 느끼게 됩니다.

<figure>{% Img src="image/admin/JA5v1s8gSBk70eJBB8xW.jpg", alt="아이스 스케이트를 타는 사람들의 무리", width="580", height="320" %}<figcaption>실생활에서 시각적 과부하.</figcaption></figure>

때때로 웹에서 동일한 일이 발생할 수 있습니다. 깜박이는 광고, 멋진 시차 효과, 놀라운 공개 애니메이션, 자동 재생 비디오 등으로 *웹은 때때로 상당히 압도적일 수 있습니다*… 다행히도 실생활과 달리 이에 대한 해결책이 있습니다. CSS 미디어 쿼리 `prefers-reduced-motion`을 통해 개발자는 감소된 움직임을 선호하는 사용자를 위해 페이지 변형을 만들 수 있습니다. 여기에는 비디오 자동 재생을 자제하는 것부터 순전히 장식적인 효과를 비활성화하는 것, 특정 사용자를 위한 페이지를 완전히 다시 디자인하는 것까지 모두 포함될 수 있습니다.

기능에 대해 자세히 알아보기 전에 한 걸음 뒤로 물러나서 웹에서 어떤 애니메이션이 사용되는지 생각해 보겠습니다. 원하는 경우 배경 정보를 건너뛰고 [아래의 기술 세부 정보로 바로 이동](#working-with-the-media-query)할 수도 있습니다.

## 웹상의 애니메이션

*애니메이션은 사용자에게 피드백* 을 제공하는 데 자주 사용됩니다. 예를 들어 작업이 수신되어 처리 중임을 알릴 수 있습니다. 예를 들어, 쇼핑 웹사이트에서 제품은 사이트의 오른쪽 상단 모서리에 아이콘으로 표시된 가상 장바구니로 "비행"하도록 애니메이션될 수 있습니다.

또 다른 사용 사례는 사용자의 많은 시간을 차지하고 전체 경험이 더 *빠르게 느껴지도록*하기 위해 스켈레톤 화면, 컨텍스트 메타데이터 및 저품질 이미지 미리보기를 혼합하여 사용하여 [사용자 인식](https://medium.com/dev-channel/hacking-user-perception-to-make-your-websites-and-apps-feel-faster-922636b620e3)을 해킹하는 모션을 사용하는 것과 관련이 있습니다. 아이디어는 사용자에게 다가오는 것에 대한 컨텍스트를 제공하는 동시에 가능한 한 빨리 사물을 로드하는 것입니다.

마지막으로 애니메이션 그라디언트, 시차 스크롤, 배경 비디오 등과 같은 *장식 효과가 있습니다.* 많은 사용자가 이러한 애니메이션을 즐기는 반면 일부 사용자는 산만하거나 느려지는 느낌 때문에 싫어합니다. 최악의 경우 사용자는 실제 경험한 것처럼 멀미에 시달릴 수 있으므로 이러한 사용자에게는 애니메이션을 줄이는 것이 *의학적 필요* 입니다.

## 동작 유발 전정 스펙트럼 장애

일부 사용자는 [애니메이션 콘텐츠에서 주의가 산만하거나 메스꺼움](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)을 경험합니다. 예를 들어, 스크롤링 애니메이션은 스크롤링과 관련된 주요 요소 이외의 요소가 많이 움직일 때 전정 장애를 유발할 수 있습니다. 예를 들어, 시차 스크롤 애니메이션은 배경 요소가 전경 요소와 다른 속도로 움직이기 때문에 전정 장애를 유발할 수 있습니다. 전정(내이) 장애 반응에는 현기증, 메스꺼움 및 편두통이 포함되며 때로는 회복을 위해 침상 안정이 필요합니다.

## 운영 체제에서 동작 제거

많은 운영 체제에는 오랫동안 감소된 동작에 대한 기본 설정을 지정하기 위한 접근성 설정이 있었습니다. 아래 스크린샷은 macOS Mojave의 **모션 감소** 기본 설정과 Android Pie의 **애니메이션 제거** 기본 설정을 보여줍니다. 선택하면 이러한 기본 설정으로 인해 운영 체제에서 앱 실행 애니메이션과 같은 장식 효과를 사용하지 않습니다. 응용 프로그램 자체도 이 설정을 존중하고 불필요한 애니메이션을 모두 제거해야 합니다.

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KwuLNPefeDzUfR17EUtr.png", alt="'움직임 줄이기' 확인란이 선택된 macOS 설정 화면의 스크린샷.", width="398", height="300" %}</figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qed7yE6FKVQ5YXHn0TbJ.png", alt="'애니메이션 제거' 확인란이 선택된 Android 설정 화면의 스크린샷", width="287", height="300" %}</figure>
</div>

## 웹에서 모션 제거

[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/)는 웹에서도 감소된 모션 사용자 기본 설정을 제공합니다. 미디어 쿼리를 통해 작성자는 렌더링되는 문서와 관계없이 사용자 에이전트 또는 디스플레이 장치의 값이나 기능을 테스트하고 쿼리할 수 있습니다. 미디어 쿼리 [`prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion)은 사용하는 애니메이션이나 동작의 양을 최소화하기 위해 사용자가 운영 체제 기본 설정을 설정했는지 감지하는 데 사용됩니다. 두 가지 가능한 값을 사용할 수 있습니다.

- `no-preference`: 사용자가 기본 운영 체제에서 기본 설정을 지정하지 않았음을 나타냅니다. 이 키워드 값은 부울 컨텍스트에서 `false`로 평가됩니다.
- `reduce`: 사용자가 인터페이스가 움직임이나 애니메이션을 최소화해야 함을 나타내는 운영 체제 기본 설정을 지정했음을 나타냅니다. 바람직하지 않은 모든 움직임이 제거되는 지점까지입니다.

## 미디어 쿼리 작업

{% Aside %} [움직임이 적은 미디어 쿼리를 사용할 수 있나요?](https://caniuse.com/#feat=prefers-reduced-motion)를 참조하세요. `prefers-reduced-motion` 지원하는지 알아내십시오. {% endAside %}

모든 미디어 쿼리와 마찬가지로, CSS 컨텍스트와 JavaScript 컨텍스트에서 `prefers-reduced-motion`을 확인할 수 있습니다.

두 가지 모두를 설명하기 위해 사용자가 클릭하기를 원하는 중요한 가입 버튼이 있다고 가정해 보겠습니다. 나는 눈길을 끄는 "진동" 애니메이션을 정의할 수 있지만 훌륭한 웹 시민으로서 나는 애니메이션에 명시적으로 OK인 사용자에게만 재생하지만 애니메이션을 옵트아웃한 사용자일 수 있는 다른 모든 사람은 아닙니다. 미디어 쿼리를 이해하지 못하는 브라우저 사용자.

```css
/*
  If the user has expressed their preference for
  reduced motion, then don't use animations on buttons.
*/
@media (prefers-reduced-motion: reduce) {
  button {
    animation: none;
  }
}

/*
  If the browser understands the media query and the user
  explicitly hasn't set a preference, then use animations on buttons.
*/
@media (prefers-reduced-motion: no-preference) {
  button {
    /* `vibrate` keyframes are defined elsewhere */
    animation: vibrate 0.3s linear infinite both;
  }
}
```

{% Aside %}
`link` 요소 `media` 속성을 통해서만 조건부로 로드하는 별도의 스타일시트에 모든 애니메이션 관련 CSS를 아웃소싱하여 선택 해제된 사용자가 다운로드하지 않도록 할 수 있습니다. 😎 `<link rel="stylesheet" href="animations.css" media="(prefers-reduced-motion: no-preference)">`
{% endAside %}

`prefers-reduced-motion`으로 작업하는 방법을 설명하기 위해 [Web Animations API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API)로 복잡한 애니메이션을 정의했다고 가정해 보겠습니다. CSS 규칙은 사용자 기본 설정이 변경될 때 브라우저에 의해 동적으로 트리거되지만 JavaScript 애니메이션의 경우 변경 사항을 직접 수신한 다음 잠재적으로 실행 중인 애니메이션을 수동으로 중지해야 합니다(또는 사용자가 허용하는 경우 다시 시작해야 함).

```js
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', () => {
  console.log(mediaQuery.media, mediaQuery.matches);
  // Stop JavaScript-based animations.
});
```

실제 미디어 쿼리 주위의 괄호는 필수 사항입니다.

{% Compare 'worse' %}

```js
window.matchMedia('prefers-reduced-motion: reduce')
```

{% endCompare %}

{% Compare 'better' %}

```js
window.matchMedia('(prefers-reduced-motion: reduce)')
```

{% endCompare %}

## 데모

저는 Rogério Vicente의 놀라운 [🐈 HTTP 상태 고양이](https://http.cat/)를 기반으로 작은 데모를 만들었습니다. 먼저 잠시 시간을 내어 농담을 감상해 보세요. 재미있습니다. 기다릴게요. 이제 돌아와서 [데모](https://prefers-reduced-motion.glitch.me)를 소개하겠습니다. 아래로 스크롤하면 각 HTTP 상태 고양이가 오른쪽 또는 왼쪽에서 번갈아 나타납니다. 그것은의 버터는 60 FPS 애니메이션을 부드럽게하지만, 위에서 설명한 바와 같이, 일부 사용자는 `prefers-reduced-motion`를 싫어하거나 동작에 지장을 받을 수 있으므로 데모는 AAA를 존중하도록 프로그래밍되어 있습니다. 이것은 동적으로 작동하므로 사용자는 다시 로드할 필요 없이 즉석에서 기본 설정을 변경할 수 있습니다. 사용자가 감소된 동작을 선호하면 불필요한 공개 애니메이션이 사라지고 일반 스크롤 동작만 남습니다. 아래 스크린캐스트는 작동 중인 데모를 보여줍니다.

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/zWs45QPPI9C8CjF813Zx.mp4", muted=true, playsinline=true, controls=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CQAw3Ee43Dcv0JOsm9fl.png" %}<figcaption> <a href="https://prefers-reduced-motion.glitch.me"><code>prefers-reduced-motion</code> 데모</a> 앱 동영상</figcaption></figure>

## 결론

사용자 기본 설정을 존중하는 것은 최신 웹 사이트의 핵심이며 브라우저는 웹 개발자가 그렇게 할 수 있도록 점점 더 많은 기능을 노출하고 있습니다. 또 다른 시작 예는 사용자가 밝은 색 구성표를 선호하는지 어두운 색 구성표를 선호하는지 감지하는 [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) 내 기사 [Hello Darkness, My Old Friend](/prefers-color-scheme) 🌒 `prefers-color-scheme`에 대한 모든 것을 읽을 수 있습니다.

CSS의 작업 그룹은 [사용자 선호도 미디어 쿼리](https://drafts.csswg.org/mediaqueries-5/#mf-user-preferences) 같은 [`prefers-reduced-transparency`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-transparency)(사용자가 투명성을 감소 선호 한 경우를 검출)을 [`prefers-contrast`](https://drafts.csswg.org/mediaqueries-5/#prefers-contrast)(검출 사용자가 증가 또는 인접 사이의 콘트라스트의 양을 감소시키는 시스템을 요청한 경우 색상) 및 [`inverted-colors`](https://drafts.csswg.org/mediaqueries-5/#inverted)(사용자가 반전된 색상을 선호하는지 감지)를 더 표준화합니다. 👀 이 공간을 주목하세요. Chrome에서 출시되면 확실히 알려드리겠습니다!

## (보너스) 모든 웹사이트에서 강제로 움직임 감소

모든 사이트가 `prefers-reduced-motion`을 사용하는 것은 아니거나 취향에 크게 맞지 않을 수 있습니다. 어떤 이유에서든 모든 웹사이트에서 움직임을 멈추고 싶다면 실제로 할 수 있습니다. 이를 가능하게 하는 한 가지 방법은 방문하는 모든 웹 페이지에 다음 CSS가 포함된 스타일시트를 삽입하는 것입니다. 이를 허용하는 여러 [브라우저 확장 프로그램](https://chrome.google.com/webstore/search/user%20stylesheets?_category=extensions)이 있습니다(사용 위험은 사용자가 감수해야 합니다!).

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
}
```

이것이 작동하는 방식은 위의 CSS가 모든 애니메이션의 지속 시간을 재정의하고 더 이상 눈에 띄지 않을 정도로 짧은 시간으로 전환한다는 것입니다. 일부 웹 사이트는 올바르게 작동하기 위해 실행될 애니메이션에 의존하기 때문에(아마도 특정 단계는 [`animationend` 이벤트](https://developer.mozilla.org/docs/Web/API/HTMLElement/animationend_event)의 발생에 따라 다르기 때문일 수 있음), 더 급진적인 `animation: none !important;` 접근 방식이 작동하지 않습니다. 위의 해킹도 모든 웹사이트에서 성공을 보장하는 것은 아니므로(예: [Web Animations API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API)를 통해 시작된 모션을 중지할 수 없음) 파손을 발견하면 반드시 비활성화하십시오.

## 관련된 링크

- [미디어 쿼리 레벨 5](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion) 사양의 최신 편집자 초안.
- [Chrome 플랫폼 상태](https://www.chromestatus.com/feature/5597964353404928)의 `prefers-reduced-motion`.
- `prefers-reduced-motion` [Chromium 버그](http://crbug.com/722548).
- Blink [게시 구현 의향](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/NZ3c9d4ivA8/BIHFbOj6DAAJ).

## 감사의 말

Chrome에서 `prefers-reduced-motion`을 구현했으며 [Rob Dodson](https://twitter.com/rob_dodson)과 함께 이 글도 검토한 [Stephen McGruer](https://github.com/stephenmcgruer)에게 큰 박수를 보냅니다. Unsplash의 Hannah Cauhepe의 [영웅 이미지](https://unsplash.com/photos/im7Tiw1OY7c).
