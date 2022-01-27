---
layout: post
title: "`measureUserAgentSpecificMemory()`를 사용하여 웹 페이지의 총 메모리 사용량 모니터링"
subhead: |2

  회귀를 감지하기 위해 프로덕션에서 웹 페이지의 메모리 사용량을 측정하는 방법을 알아보세요.
description: |2

  회귀를 감지하기 위해 프로덕션에서 웹 페이지의 메모리 사용량을 측정하는 방법을 알아보세요.
updated: 2020-10-19
date: 2020-04-13
authors:
  - ulan
hero: image/admin/Ne2U4cUtHG6bJ0YeIkt5.jpg
alt: |2

  녹색 RAM 스틱. Unsplash에 있는 Harrison Broadbent의 사진.
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113"
tags:
  - blog
  - memory
  - javascript
feedback:
  - api
---

{% Aside 'caution' %}

**업데이트**

**2021년 4월 23일**: out-of-process iframe에 대한 참고 사항으로 상태를 업데이트하고 API의 범위를 명확히 했습니다.

**2021년 1월 20일**: `performance.measureMemory`가 `performance.measureUserAgentSpecificMemory`로 이름이 변경되고 기본적으로 [사용 오리진 간 격리](/coop-coep) 웹 페이지에 대해 Chrome 89에서 활성화됩니다. 결과 형식도 Origin Trial 버전에 비해 약간 [변경되었습니다.](https://github.com/WICG/performance-measure-memory/blob/master/ORIGIN_TRIAL.md#result-differences) {% endAside %}

브라우저는 웹 페이지의 메모리를 자동으로 관리합니다. 웹 페이지가 객체를 생성할 때마다 브라우저는 객체를 저장하기 위해 "후드 아래" 메모리 청크를 할당합니다. 메모리는 유한한 리소스이기 때문에 브라우저는 객체가 더 이상 필요하지 않은 때를 감지하고 기본 메모리 청크를 해제하기 위해 가비지 수집을 수행합니다. 하지만 탐지는 완벽하지 않으며, 완벽한 탐지는 불가능한 작업임이 [입증](https://en.wikipedia.org/wiki/Halting_problem)되었습니다. 따라서 브라우저는 "객체에 도달할 수 있음"이라는 개념으로 "객체가 필요합니다"라는 개념을 근사합니다. 웹 페이지가 해당 변수와 도달 가능한 다른 객체의 필드를 통해 객체에 도달할 수 없는 경우 브라우저는 객체를 안전하게 회수할 수 있습니다. 이 두 개념의 차이로 인해 다음 예제와 같이 메모리 누수가 발생합니다.

```javascript
const object = { a: new Array(1000), b: new Array(2000) };
setInterval(() => console.log(object.a), 1000);
```

여기서 더 큰 배열 `b`는 더 이상 필요하지 않지만 콜백에서 `object.b`를 통해 여전히 연결할 수 있기 때문에 브라우저는 이를 회수하지 않습니다. 따라서 더 큰 배열의 메모리가 누출됩니다.

메모리 누수는 [웹에서 만연](https://docs.google.com/presentation/d/14uV5jrJ0aPs0Hd0Ehu3JPV8IBGc3U8gU6daLAqj6NrM/edit#slide=id.p)합니다. 이벤트 리스너 등록 취소를 잊어버리거나, 실수로 iframe에서 객체를 캡처하거나, 작업자를 닫지 않거나, 객체를 배열에 누적하는 등의 방식으로 이벤트 리스너를 쉽게 도입할 수 있습니다. 웹 페이지에 메모리 누수가 있는 경우 시간이 지남에 따라 메모리 사용량이 증가하고 웹 페이지가 느리고 사용자에게 부풀려 보입니다.

이 문제를 해결하는 첫 번째 단계는 측정입니다. 새로운 [`performance.measureUserAgentSpecificMemory()` API](https://github.com/WICG/performance-measure-memory)를 통해 개발자는 프로덕션에서 웹 페이지의 메모리 사용량을 측정하여 로컬 테스트를 통과하는 메모리 누수를 감지할 수 있습니다.

## `performance.measureUserAgentSpecificMemory()`는 기존 `performance.memory` API와 어떻게 다릅니까? {: #legacy-api }

기존의 비표준 `performance.memory` API에 익숙하다면 새 API와 어떻게 다른지 궁금할 것입니다. 주요 차이점은 이전 API는 JavaScript 힙의 크기를 반환하는 반면 새 API는 웹 페이지에서 사용하는 메모리를 추정한다는 것입니다. 이 차이는 Chrome이 여러 웹 페이지(또는 동일한 웹 페이지의 여러 인스턴스)와 동일한 힙을 공유할 때 중요합니다. 이 경우 기존 API의 결과가 임의로 해제될 수 있습니다. 구 API는 "힙"과 같은 구현별 용어로 정의되어 있기 때문에 표준화하는 것은 희망이 없습니다.

또 다른 차이점은 새 API가 가비지 수집 중에 메모리 측정을 수행한다는 것입니다. 이렇게 하면 결과의 노이즈가 줄어들지만 결과가 생성될 때까지 시간이 걸릴 수 있습니다. 다른 브라우저는 가비지 수집에 의존하지 않고 새 API를 구현하기로 결정할 수 있습니다.

## 제안된 사용 사례 {: #use-cases }

웹 페이지의 메모리 사용량은 이벤트, 사용자 작업 및 가비지 컬렉션의 타이밍에 따라 다릅니다. 이것이 메모리 측정 API가 프로덕션에서 메모리 사용 데이터를 집계하기 위한 이유입니다. 개별 호출의 결과는 덜 유용합니다. 사용 사례 예시:

- 새로운 메모리 누수를 포착하기 위해 웹 페이지의 새 버전을 롤아웃하는 동안 회귀 감지.
- 새로운 기능을 A/B 테스트하여 메모리 영향을 평가하고 메모리 누수를 감지합니다.
- 메모리 누수의 유무를 확인하기 위해 세션 기간과 메모리 사용량을 연관시킵니다.
- 메모리 사용량을 사용자 메트릭과 연관시켜 메모리 사용량의 전반적인 영향을 이해합니다.

## 브라우저 호환성 {: #compatibility }

현재 API는 원본 평가판으로 Chrome 83에서만 지원됩니다. API의 결과는 구현에 따라 크게 달라집니다. 브라우저는 메모리에서 객체를 표현하는 방식과 메모리 사용량을 추정하는 방식이 다르기 때문입니다. 적절한 계산이 너무 비싸거나 실행 불가능한 경우 브라우저는 일부 메모리 영역을 계산에서 제외할 수 있습니다. 따라서 브라우저 간에 결과를 비교할 수 없습니다. 동일한 브라우저에 대한 결과를 비교하는 것은 의미가 있습니다.

## 현재 상태 {: #status }

<div><table>
    <thead>
      <tr>
        <th>단계</th>
        <th>상태</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1. 설명자 만들기</td>
        <td><a href="https://github.com/WICG/performance-measure-memory">완료</a></td>
      </tr>
      <tr>
        <td>2. 사양의 초기 초안 작성</td>
        <td><a href="https://wicg.github.io/performance-measure-memory/">완료</a></td>
      </tr>
      <tr>
        <td>3. 피드백 수집 및 디자인 반복</td>
        <td><a href="#feedback">진행 중</a></td>
      </tr>
      <tr>
        <td>4. 오리진 트라이얼</td>
        <td><a href="https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113">완료</a></td>
      </tr>
      <tr>
        <td>5. 출시</td>
        <td>Chrome 89에서 기본적으로 활성화됨</td>
      </tr>
    </tbody>
</table></div>

## `performance.measureUserAgentSpecificMemory()` 사용 {: 사용 }

### about://flags를 통해 활성화

오리진 평가판 토큰 없이 `performance.measureUserAgentSpecificMemory()`를 실험하려면 `about://flags` `#experimental-web-platform-features` 플래그를 활성화하십시오.

### 특징 감지

실행 환경이 교차 출처 정보 누출 방지를 위한 보안 요구 사항을 충족하지 않는 경우 `performance.measureUserAgentSpecificMemory()` 기능이 [SecurityError](https://developer.mozilla.org/docs/Web/API/DOMException#exception-SecurityError)와 함께 실패할 수 있습니다. Chrome에서 원본 평가판을 사용하는 동안 API를 사용하려면 [사이트 격리](https://developers.google.com/web/updates/2018/07/site-isolation)가 활성화되어 있어야 합니다. API가 제공되면 [교차 출처 격리](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated)에 의존합니다. [웹 페이지는 COOP+COEP 헤더](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)를 설정하여 교차 출처 격리를 선택할 수 있습니다.

```javascript
if (performance.measureUserAgentSpecificMemory) {
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.log('The context is not secure.');
    } else {
      throw error;
    }
  }
  console.log(result);
}
```

### 로컬 테스트

Chrome은 가비지 수집 중에 메모리 측정을 수행합니다. 즉, API가 결과 약속을 즉시 확인하지 않고 대신 다음 가비지 수집을 기다립니다. API는 현재 20초로 설정된 시간 초과 후 가비지 수집을 강제 실행합니다. `--enable-blink-features='ForceEagerMeasureMemory'` 명령줄 플래그로 Chrome을 시작하면 시간 초과가 0으로 줄어들고 로컬 디버깅 및 테스트에 유용합니다.

## 예시

API의 권장 사용법은 전체 웹 페이지의 메모리 사용량을 샘플링하고 그 결과를 집계 및 분석을 위해 서버로 보내는 글로벌 메모리 모니터를 정의하는 것입니다. 가장 간단한 방법은 예를 들어 `M` 분마다 주기적으로 샘플링하는 것입니다. 그러나 메모리 피크가 샘플 간에 발생할 수 있기 때문에 데이터에 바이어스가 발생합니다. 다음 예제는 샘플이 임의의 시점[(데모](https://performance-measure-memory.glitch.me/), [소스](https://glitch.com/edit/#!/performance-measure-memory?path=script.js:1:0))에서 발생할 가능성이 동일하게 보장하는 [푸아송 프로세스](https://en.wikipedia.org/wiki/Poisson_point_process)를 사용하여 편향되지 않은 메모리 측정을 수행하는 방법을 보여줍니다.

먼저 무작위 간격으로 `setTimeout()`을 사용하여 다음 메모리 측정을 예약하는 함수를 정의합니다. 이 함수는 메인 창에서 페이지 로드 후에 호출되어야 합니다.

```javascript
function scheduleMeasurement() {
  if (!performance.measureUserAgentSpecificMemory) {
    console.log(
      'performance.measureUserAgentSpecificMemory() is not available.',
    );
    return;
  }
  const interval = measurementInterval();
  console.log(
    'Scheduling memory measurement in ' +
      Math.round(interval / 1000) +
      ' seconds.',
  );
  setTimeout(performMeasurement, interval);
}

// Start measurements after page load on the main window.
window.onload = function () {
  scheduleMeasurement();
};
```

`measurementInterval()` 함수는 평균적으로 5분마다 하나의 측정이 있도록 임의의 간격을 밀리초 단위로 계산합니다. 함수 이면의 수학에 관심이 있는 경우 [지수 분포](https://en.wikipedia.org/wiki/Exponential_distribution#Computational_methods)를 참조하세요.

```javascript
function measurementInterval() {
  const MEAN_INTERVAL_IN_MS = 5 * 60 * 1000;
  return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS;
}
```

마지막으로 async `performMeasurement()` 함수는 API를 호출하고 결과를 기록하고 다음 측정을 예약합니다.

```javascript
async function performMeasurement() {
  // 1. Invoke performance.measureUserAgentSpecificMemory().
  let result;
  try {
    result = await performance.measureUserAgentSpecificMemory();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.log('The context is not secure.');
      return;
    }
    // Rethrow other errors.
    throw error;
  }
  // 2. Record the result.
  console.log('Memory usage:', result);
  // 3. Schedule the next measurement.
  scheduleMeasurement();
}
```

결과는 다음과 같을 수 있습니다.

```javascript
// Console output:
{
  bytes: 60_000_000,
  breakdown: [
    {
      bytes: 40_000_000,
      attribution: [
        {
          url: "https://foo.com",
          scope: "Window",
        },
      ]
      types: ["JS"]
    },
    {
      bytes: 0,
      attribution: [],
      types: []
    },
    {
      bytes: 20_000_000,
      attribution: [
        {
          url: "https://foo.com/iframe",
          container: {
            id: "iframe-id-attribute",
            src: "redirect.html?target=iframe.html",
          },
        },
      ],
      types: ["JS"]
    },
  ]
}
```

총 메모리 사용량 추정치는 `bytes` 필드에 반환됩니다. 바이트 값이 [숫자 구분자 구문](https://v8.dev/features/numeric-separators)을 사용하고 있습니다. 이 값은 구현에 따라 크게 달라지며 여러 브라우저에서 비교할 수 없습니다. 동일한 브라우저의 다른 버전 간에도 변경될 수 있습니다. 원본 평가판 동안 값에는 기본 창과 모든 **동일 사이트** iframe 및 관련 창의 JavaScript 메모리 사용량이 포함됩니다. API가 제공되면 이 값은 현재 프로세스의 모든 iframe, 관련 창 및 웹 작업자의 JavaScript 및 DOM 메모리를 설명합니다. [API는 사이트 격리](https://www.chromium.org/Home/chromium-security/site-isolation)가 활성화된 경우 [교차 사이트 out-of-process iframe](https://www.chromium.org/developers/design-documents/oop-iframes)의 메모리를 측정하지 않습니다.

`breakdown` 목록은 사용된 메모리에 대한 추가 정보를 제공합니다. 각 항목은 메모리의 일부를 설명하고 URL로 식별되는 일련의 창, iframe 및 작업자에 대한 속성을 지정합니다. `types` 필드는 메모리와 관련된 구현별 메모리 유형을 나열합니다.

모든 목록을 일반적인 방식으로 처리하고 특정 브라우저를 기반으로 가정을 하드코딩하지 않는 것이 중요합니다. 예를 들어, 일부 브라우저는 빈 `breakdown` 또는 빈 `attribution`을 반환할 수 있습니다. 다른 브라우저는 이러한 항목 중 메모리를 소유한 항목을 구별할 수 없음을 나타내는 `attribution`은 여러 항목을 반환할 수 있습니다.

## 피드백 {: #feedback }

[Web Performance Community Group](https://www.w3.org/community/webperfs/) 및 Chrome 팀은 `performance.measureUserAgentSpecificMemory()`에 대한 생각과 경험을 듣고 싶습니다.

### API 디자인에 대해 알려주세요

API에 대해 예상대로 작동하지 않는 것이 있습니까? 아니면 아이디어를 구현하는 데 필요한 속성이 누락되었습니까? [performance.measureUserAgentSpecificMemory() GitHub 리포지토리](https://github.com/WICG/performance-measure-memory/issues)에 사양 문제를 제출하거나 기존 문제에 대한 생각을 추가하세요.

### 구현 문제 보고

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요? [new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EPerformanceAPIs)에서 버그를 신고하세요. 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고 **구성 요소**를 `Blink>PerformanceAPIs`로 설정해야 합니다. [Glitch](https://glitch.com/)는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

### 지원 표시

`performance.measureUserAgentSpecificMemory()`를 사용할 계획입니까? 공개 지원은 Chrome 팀이 기능의 우선 순위를 지정하고 다른 브라우저 공급업체에서 기능을 지원하는 것이 얼마나 중요한지 보여주는 데 도움이 됩니다. [@ChromiumDev](https://twitter.com/chromiumdev)로 트윗을 보내어 사용 위치와 방법을 알려주세요.

## 유용한 링크 {: #helpful }

- [설명자](https://github.com/WICG/performance-measure-memory)
- [데모](https://performance-measure-memory.glitch.me/) | [데모 소스](https://glitch.com/edit/#!/performance-measure-memory?path=script.js:1:0)
- [오리진 트라이얼](https://developers.chrome.com/origintrials/#/view_trial/1281274093986906113)
- [추적 버그](https://bugs.chromium.org/p/chromium/issues/detail?id=1049093)
- [ChromeStatus.com 항목](https://www.chromestatus.com/feature/5685965186138112)

## 감사의 말

API 설계 검토를 담당한 Domenic Denicola, Yoav Weiss, Mathias Bynens와 Chrome에서 코드 검토를 담당한 Dominik Inführ, Hannes Payer, Kentaro Hara, Michael Lippautz에게 큰 감사를 드립니다. 또한 API를 크게 개선한 귀중한 사용자 피드백을 제공한 Per Parker, Philipp Weis, Olga Belomestnykh, Matthew Bolohan 및 Neil Mckay에게도 감사드립니다.

[Unsplash](https://unsplash.com)에 있는 [Harrison Broadbent의](https://unsplash.com/@harrisonbroadbent) [영웅 이미지](https://unsplash.com/photos/5tLfQGURzHM)
