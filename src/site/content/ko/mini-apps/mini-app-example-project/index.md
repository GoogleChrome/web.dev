---
layout: post
title: 예시 프로젝트에 미니앱 프로그래밍 방법론 적용하기
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  "미니앱 방식으로 프로그래밍하는 방법"을 따르는 예시 프로젝트에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 앱 도메인

[미니앱 방식으로 프로그래밍](/mini-app-programming-way/)을 웹앱에서 확인하기 위해 단순하지만 완전한 앱 아이디어가 생각났어요.

[고강도 인터벌 트레이닝](https://en.wikipedia.org/wiki/High-intensity_interval_training) (HIIT)은 고강도 무산소 운동과 휴식 운동이 짧게 반복되는 심폐 운동 전략이에요.
[The Body Coach TV](https://www.youtube.com/user/thebodycoach1)의 이 [30분 온라인 세션](https://www.youtube.com/watch?v=tXOZS3AKKOw)처럼 많은 HIIT 운동이 HIIT 타이머를 이용해요.

<div class="w-columns">
  <figure>
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tUl2jNm2bFqGBAFF5s63.png", alt="HIIT training online session with green high intensity timer.", width="800", height="450" %}
    <figcaption>
      운동기.
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMUgX3WJ4ZfQX38zHP75.png", alt="HIIT training online session with red low intensity timer.", width="800", height="450" %}
    <figcaption>
      휴식기.
    </figcaption>
  </figure>
</div>

## HIIT 타이머 예제 앱

이 챕터를 위해 다양한 타이머를 관리하고 고강도와 저강도 운동 간격을 조정하고 하나의 운동 세션을 선택할 수 있는 간단한 HIIT 운동 타이머 앱을 만들었어요.
반응형 앱이며 내비게이션 바, 탭 바, 그리고 3개의 페이지로 이루어져 있어요.

- **운동:** 운동할 때 메인 페이지. 사용자가 타이머를 고를 수 있고, 운동 세트, 운동 시간, 휴식 시간 3개의 진척도 링을 확인할 수 있어요.
- **타이머:** 이미 존재하는 타이머를 관리하고 새 타이머를 만들 수 있어요.
- **설정:** 소리 효과나 음성 안내를 켜고 끄거나 언어와 테마를 설정할 수 있어요.

아래 스크린샷들로 앱의 느낌을 확인해보세요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9RYkQ17tlEy79NlAIFfP.svg", alt="HIIT Time example app in portrait mode.", width="800", height="450" %}
  <figcaption>
    세로 모드에서 HIIT Time의 운동 탭.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SNHMWFvHtCYHEfC9SHPl.svg", alt="HIIT Time example app in landscape mode.", width="800", height="450" %}
  <figcaption>
    가로 모드에서 HIIT Time의 운동 탭.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/f7uqTk1PNMVaHob7FDzA.svg", alt="HIIT Time example app showing management of a timer.", width="800", height="450" %}
  <figcaption>
    HIIT Time의 타이머 관리.
  </figcaption>
</figure>

## 앱 구조

위에서 언급되었듯이, 앱은 내비게이션 바, 탭 바, 그리고 3개의 페이지로 구성되어 있고 그리드 구조로 배치되어 있어요.
내비게이션 바와 탭 바는 iframe이며, 그 사이에 `<div>` 컨테이너가 있어요.
3개의 페이지 또한 iframe으로 구성되어 있어요.
3개의 페이지 중 하나는 항상 화면에 나타나며, 탭 바의 선택에 따라 달라져요.
마지막 iframe은 `about:blank`를 포인팅하고 있는데, 이는 동적으로 생성되는 인앱 페이지를 서빙하는 용도로 활용돼요.
이는 이미 존재하는 타이머를 변경하거나 새로운 타이머를 생성하기 위해 필요해요.
저는 이 패턴을 멀티페이지 싱글페이지 애플리케이션이라고 불러요 (Multi-Page Single-Page App, MPSPA).

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rv14TNs1kU0bpW5kv5bq.png", alt="Chrome DevTools view of the HTML structure of the app showing that it consists of six iframes: one for the navbar, one for the tabbar, and three grouped ones for each page of the app, with a final placeholder iframe for dynamic pages.", width="800", height="244" %}
  <figcaption>
    앱은 6개의 iframe으로 이루어져 있어요.
  </figcaption>
</figure>

## 컴포넌트 기반 lit-html 마크업

각 페이지의 구조는 런타임에 동적으로 연산되는 [lit-html](https://lit-html.polymer-project.org/) 스캐폴드로 구성돼요.
lit-html은 JavaScript를 위한 효율적이고, 표현력 있고, 확장성 있는 HTML 템플리팅 라이브러리에요.
HTML 파일 안에 바로 사용할 수 있어 결과 중심적으로 프로그래밍할 수 있어요.
최종 결과물이 어떻게 생겼을지 생각하며 템플릿을 작성하면,
lit-html이 데이터와 뷰의 간극을 메꾸고 이벤트 리스너들을 연결해줘요.
이 앱은 [Shoelace](https://shoelace.style/)의 [`<sl-progress-ring>`](https://shoelace.style/components/progress-ring)나
직접 구현한 `<human-duration>` 같은 커스텀 엘리먼트 등의 써드파티 요소를 차용했어요.
커스텀 엘리먼트는 선언적 API를 가지고 있기에 (예를 들어, 진척도 링의 `percentage` 속성처럼요),
아래에서 확인할 수 있듯이 lit-html과 함께 잘 동작해요.

```html
<div>
  <button class="start" @click="${eventHandlers.start}" type="button">
    ${strings.START}
  </button>
  <button class="pause" @click="${eventHandlers.pause}" type="button">
    ${strings.PAUSE}
  </button>
  <button class="reset" @click="${eventHandlers.reset}" type="button">
    ${strings.RESET}
  </button>
</div>

<div class="progress-rings">
  <sl-progress-ring
    class="sets"
    percentage="${Math.floor(data.sets/data.activeTimer.sets*100)}"
  >
    <div class="progress-ring-caption">
      <span>${strings.SETS}</span>
      <span>${data.sets}</span>
    </div>
  </sl-progress-ring>
</div>
```

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Toz6JmkCQVt7WLscSnlP.png", alt="Three buttons and a progress ring.", width="300", height="244" %}
  <figcaption>
    위의 마크업 페이지가 렌더된 모습.
  </figcaption>
</figure>

## 프로그래밍 모델

모든 페이지는 상응하는 `Page` 클래스가 있어 lit-html 마크업에 데이터와 이벤트 핸들러를 제공해서 페이지를 동작하도록 만들어요.
이 클래스는 `onShow()`, `onHide()`, `onLoad()`, 그리고 `onUnload()`와 같은 라이프사이클 메소드도 제공해요.
페이지는 또한 선택적인 페이지별 상태와 전역 상태를 공유하기 위한 데이터 저장소에 대한 접근 권한도 가지고 있어요.
모든 문자열은 중앙에서 관리되어 국제화 또한 내장되어 있어요.
라우팅은 iframe의 visibility를 변경하고 동적으로 생성되는 페이지는 placeholder iframe의 `src` 속성값을 변경하는 것이 전부라, 브라우저에 의해서 관리돼요.
아래 예시는 동적으로 생성된 페이지를 닫는 예시예요.

```js
import Page from '../page.js';

const page = new Page({
  eventHandlers: {
    back: (e) => {
      e.preventDefault();
      window.top.history.back();
    },
  },
});
```

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y82LVHSxUVAehgQlDbsb.png", alt="In-app page realized as an iframe.", width="500", height="272" %}
  <figcaption>
    내비게이션은 iframe에서 iframe으로 일어나요.
  </figcaption>
</figure>

## 스타일링

페이지의 스타일링은 각 페이지마다 개별 CSS로 이루어져요.
즉, 이는 화면 요소들을 직접적으로 요소 이름을 통해서 접근할 수 있으며,
다른 페이지들과 충돌이 일어나지 않는다는 것을 뜻해요.
글로벌 스타일 또한 페이지에 추가되어 `font-family`나 `box-sizing` 같은 요소들을 중복할 필요가 없어요.
여기에 테마와 다크모드 옵션 또한 지정할 수 있어요.
아래 리스트로 설정 페이지와 그리드의 다양한 형태 요소를 정의하고 있어요.

```css
main {
  max-width: 600px;
}

form {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  margin-block-end: 1rem;
}

label {
  text-align: end;
  grid-column: 1 / 2;
}

input,
select {
  grid-column: 2 / 3;
}
```

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/z3Op4O7OM5NQ1zz8Uah8.png", alt="HIIT Time app preferences page showing a form in grid layout.", width="500", height="312" %}
  <figcaption>
    각 페이지는 그 단독 세상이에요. 스타일링은 요소 이름으로 직접 할 수 있어요.
  </figcaption>
</figure>

## 스크린 켜짐 잠금

운동 도중에 화면이 꺼지면 안돼요.
지원되는 브라우저에서 HIIT Time은 [Screen Wake Lock](/wake-lock/) 기능을 통해 화면이 켜진 상태를 유지해요.
아래 코드를 통해 어떻게 이루어지는지 확인해보세요.

```js
if ('wakeLock' in navigator) {
  const requestWakeLock = async () => {
    try {
      page.shared.wakeLock = await navigator.wakeLock.request('screen');
      page.shared.wakeLock.addEventListener('release', () => {
        // Nothing.
      });
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };
  // Request a screen wake lock…
  await requestWakeLock();
  // …and re-request it when the page becomes visible.
  document.addEventListener('visibilitychange', async () => {
    if (
      page.shared.wakeLock !== null &&
      document.visibilityState === 'visible'
    ) {
      await requestWakeLock();
    }
  });
}
```

## 어플리케이션 테스트

HIIT Time 어플리케이션은 [GitHub](https://github.com/tomayac/hiit-time)에서 확인하실 수 있어요.
[데모](https://tomayac.github.io/hiit-time/)를 새 창에서 확인해보거나,
아래 모바일 기기를 모방하는 iframe에서 직접 확인해보세요.

<iframe src="https://tomayac.github.io/hiit-time/#workout" width="411" height="731" loading="lazy" frameborder="0" allow="screen-wake-lock"></iframe>

{% Aside 'success' %}
마지막으로 미니앱에 대한 [결론](/mini-app-conclusion)을 살펴볼거예요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
