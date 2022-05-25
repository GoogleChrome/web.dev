---
layout: post
title: Next.js에서 동적 가져오기를 사용한 코드 분할
authors:
  - mihajlija
subhead: |2-

  코드 분할 및 스마트 로딩 전략으로 Next.js 앱 속도를 높이는 방법.
date: 2019-11-08
feedback:
  - api
---

## 학습 내용

이 게시물은 다양한 유형의 [코드 분할](/reduce-javascript-payloads-with-code-splitting/)과 동적 가져오기를 사용하여 Next.js 앱 속도를 높이는 방법을 설명합니다.

## 경로 기반 및 구성 요소 기반 코드 분할

기본적으로 Next.js는 JavaScript를 각 경로에 대해 별도의 청크로 분할합니다. 사용자가 애플리케이션을 로드하면 Next.js는 초기 경로에 필요한 코드만 전송합니다. 사용자가 애플리케이션을 탐색할 때 다른 경로와 연결된 청크를 가져옵니다. 경로 기반 코드 분할 기능은 한 번에 구문을 분석하고 컴파일해야 하는 스크립트의 양을 최소화하므로 페이지 로드 시간이 훨씬 빨라집니다.

경로 기반 코드 분할이 좋은 기본값이지만 구성 요소 수준에서 코드 분할을 사용하여 로드 프로세스를 추가로 최적화할 수 있습니다. 앱에 큰 구성 요소가 있는 경우 별도의 청크로 분할하는 것이 좋습니다. 이렇게 하면 중요하지 않거나 특정 사용자 상호 작용(예: 버튼 클릭)에서만 렌더링되는 큰 구성 요소는 지연 로드될 수 있습니다.

Next.js는 JavaScript 모듈(React 구성 요소 포함)을 동적으로 가져오고 각 가져오기를 별도의 청크로 로드할 수 있는 [동적 `import()`](https://v8.dev/features/dynamic-import) 기능을 지원합니다. 이렇게 하면 구성 요소 수준의 코드 분할이 가능하고 사용자가 보고 있는 사이트 부분에 필요한 코드만 다운로드하도록 리소스 로드를 제어할 수 있습니다. Next.js에서 이러한 구성 요소는 기본적으로 [SSR(서버 측 렌더링)](/rendering-on-the-web/)입니다.

## 동적 가져오기 실행

이 게시물에는 하나의 버튼이 있는 간단한 페이지로 구성된 샘플 앱의 여러 버전이 포함되어 있습니다. 버튼을 클릭하면 귀여운 강아지가 화면에 표시됩니다. 앱의 각 버전을 살펴보면서 동적 가져오기가 [정적 가져오기](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)와 어떻게 다른지 그리고 이를 사용하는 방법에 대해 알 수 있습니다.

앱의 첫 번째 버전에서 강아지는 `components/Puppy.js`에 있습니다. 앱은 페이지에 강아지를 표시하기 위해 정적 가져오기 설명문을 사용하여 `index.js`에서 `Puppy` 구성 요소를 가져옵니다.

```js
import Puppy from "../components/Puppy";
```

{% Glitch { id: 'static-import', path: 'index.js', previewSize: 0, height: 480 } %}

Next.js가 앱을 번들로 묶는 방법을 살펴보려면 DevTools에서 네트워크 추적을 검사하세요.

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

{% Instruction 'reload-page', 'ol' %}

페이지 로드 시 `Puppy.js` 구성 요소를 포함하여 필요한 모든 코드는 `index.js`로 번들로 묶입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6KWlTYFhoIEIGqnuMwlh.png", alt="index.js, app.js, webpack.js, main.js, 0.js 6가지 JavaScript 파일 및 dll(동적 링크 라이브러리) 파일을 표시하는 DevTools 네트워크 탭.", width="800", height="665" %}</figure>

**Click me** 버튼을 누르면 강아지 JPEG에 대한 요청만 **네트워크** 탭에 추가됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7MkXVqnqfIbW74VV48kB.png", alt="6가지 JavaScript 파일과 이미지 하나를 표시하는 버튼 클릭 이후에 표시되는 DevTools 네트워크 탭.", width="800", height="665" %}</figure>

이러한 접근 방식의 단점은 사용자가 강아지를 보기 위해 버튼을 클릭하지 않더라도 `index.js`에 포함되어 있기 때문에 `Puppy` 구성 요소를 로드해야 한다는 것입니다. 이 간단한 예에서는 문제가 되지 않지만 실제 적용 시 필요할 경우에만 중요한 구성 요소를 로드하는 것이 상당한 개선으로 이어지는 경우가 종종 있습니다.

이제 정적 가져오기가 동적 가져오기로 대체된 두 번째 앱 버전을 살펴보도록 하겠습니다. Next.js에는 Next의 모든 구성 요소에 대해 동적 가져오기를 사용할 수 있는 `next/dynamic`이 포함되어 있습니다.

```js/1,5/0
import Puppy from "../components/Puppy";
import dynamic from "next/dynamic";

// ...

const Puppy = dynamic(import("../components/Puppy"));
```

{% Glitch { id: 'dynamic-import-nextjs', path: 'pages/index.js:29:10', height: 480 } %}

첫 번째 예의 단계에 따라 네트워크 추적을 검사합니다.

앱을 처음 로드하면 `index.js`만 다운로드됩니다. `Puppy` 구성 요소에 대한 코드가 포함되어 있지 않기 때문에 0.5KB 더 작습니다(37.9KB에서 37.4KB로 감소).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K7Ii3bxUkb37LrZjjWT1.png", alt="동일한 6가지 JavaScript 파일을 표시하는 DevTools 네트워크, 예외적으로 index.js는 현재 0.5KB 더 작음.", width="800", height="665" %}</figure>

`Puppy` 구성 요소는 이제 버튼을 누를 때만 로드되는 별도의 청크 `1.js`에 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DfVDv5poQmwXwOKmnvd.png", alt="추가적인 1.js 파일과 파일 목록 하단에 추가된 이미를 표시하는 버튼 클릭 이후에 표시되는 DevTools 네트워크 탭.", width="800", height="665" %}</figure>

{% Aside %} 기본적으로, Next.js는 이러한 동적 청크 *number*.js에 이름을 지정합니다. 여기에서 *number*는 1부터 시작합니다. {% endAside %}

실제 적용 시, 구성 요소가 [훨씬 더 큰](https://bundlephobia.com/result?p=moment@2.24.0) 경우가 많으며, 구성 요소를 지연 로드하면 초기 JavaScript 페이로드를 수백 킬로바이트까지 줄일 수 있습니다.

## 사용자 지정 로딩 표시기로 동적 가져오기

리소스를 지연 로드할 때 지연이 있는 경우에 대비하여 로드 표시기를 제공하는 것이 좋습니다. Next.js에서, `dynamic()` 함수에 추가 인수를 제공하여 이러한 작업을 수행할 수 있습니다.

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  loading: () => <p>Loading...</p>
});
```

{% Glitch { id: 'dynamic-import-loading', path: 'pages/index.js:7:27', height: 480 } %}

로딩 표시기가 실행 중인지 확인하려면 DevTools에서 느린 네트워크 연결을 시뮬레이션하요.

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

1. **Throttling(스로틀링)** 드롭다운 목록에서 **Fast 3G(고속 3G)**를 선택합니다.

2. **클릭 미** 버튼을 누릅니다.

이제 버튼을 클릭하면 구성 요소를 로드하는 데 시간이 걸리고 그 동안 앱이 "로드 중…" 메시지를 표시합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tjlpmwolBVp1jh948Fln.png", alt="\"로드 중...\" 텍스트가 있는 어두운 화면.", width="800", height="663" %}</figure>

## SSR 없이 동적 가져오기

클라이언트 측에서만 구성 요소를 렌더링해야 하는 경우(예: 채팅 위젯) `ssr` 옵션을 `false`로 설정하여 이러한 작업을 수행할 수 있습니다.

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  ssr: false,
});
```

{% Glitch { id: 'dynamic-import-no-ssr', path: 'pages/index.js:5:0', height: 480 } %}

## 결론

동적 가져오기를 지원하는 Next.js는 JavaScript 페이로드를 최소화하고 애플리케이션 로드 시간을 개선할 수 있는 구성 요소 수준 코드 분할 기능을 제공합니다. 모든 구성 요소는 기본적으로 서버 측에서 렌더링되며 필요할 때마다 이 옵션을 비활성화할 수 있습니다.
