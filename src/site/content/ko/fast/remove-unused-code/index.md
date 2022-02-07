---
layout: post
title: 사용하지 않는 코드 제거
subhead: npm을 사용하면 프로젝트에 코드를 쉽게 추가할 수 있습니다. 그렇지만 이런 추가적인 바이트를 모두 활용하고 계십니까?
authors:
  - houssein
date: 2018-11-05
description: npm과 같은 레지스트리는 누구나 쉽게 다운로드하여 50만 개 이상의 공개 패키지를 사용할 수 있게 하여 JavaScript 세계를 더 나은 방향으로 변화시켰습니다. 그러나 우리는 종종 완전히 활용하지 않는 라이브러리를 포함합니다. 이 문제를 고치기 위해 번들을 분석하여 사용하지 않는 코드를 감지하세요.
codelabs:
  - codelab-remove-unused-code
tags:
  - performance
---

[npm](https://docs.npmjs.com/getting-started/what-is-npm)과 같은 레지스트리는 누구나 쉽게 다운로드하여 *50만 개* 이상의 공개 패키지를 사용할 수 있게 하여 JavaScript 세계를 더 나은 방향으로 변화시켰습니다. 그러나 우리는 종종 완전히 활용하지 않는 라이브러리를 포함합니다. 이 문제를 고치기 위해 **번들을 분석**하여 사용되지 않는 코드를 감지하세요. 그리고 **사용하지 않고** **필요하지 않은** 라이브러리를 삭제하세요.

## 번들 분석

DevTools를 사용하면 모든 네트워크 요청의 크기를 쉽게 확인할 수 있습니다. {% Instruction 'devtools-network', 'ol' %} {% Instruction 'disable-cache', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Img src="image/admin/aq6QZj5p4KTuaWnUJnLC.png", alt="번들 요청이 있는 네트워크 패널", width="800", height="169" %}

DevTools의 [Coverage](https://developer.chrome.com/docs/devtools/coverage/) 탭은 애플리케이션에서 얼마나 많은 CSS 및 JS 코드가 사용되지 않았는지 알려줍니다.

{% Img src="image/admin/xlPdOMaeykJhYqGcaMJr.png", alt="DevTools의 코드 적용 범위", width="800", height="562" %}

Node CLI를 통해 전체 Lighthouse 구성을 지정하면 "사용되지 않은 JavaScript" 감사를 사용하여 애플리케이션과 함께 제공되는 사용되지 않은 코드의 양을 추적할 수도 있습니다.

{% Img src="image/admin/tdC0d65gEIiHZy6eyo82.png", alt="Lighthouse 미사용 JS 감사", width="800", height="347" %}

[webpack](https://webpack.js.org/)을 번들러로 사용하는 경우 [Webpack 번들 분석기](https://github.com/webpack-contrib/webpack-bundle-analyzer)가 번들을 구성하는 요소를 조사하는 데 도움이 됩니다. 다른 플러그인과 마찬가지로 webpack 구성 파일에 플러그인을 포함합니다.

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new BundleAnalyzerPlugin()
  ]
}
```

webpack은 일반적으로 단일 페이지 애플리케이션을 빌드하는 데 사용되지만 [Parcel](https://parceljs.org/) 및 [Rollup](https://rollupjs.org/guide/en)과 같은 다른 번들러에도 번들을 분석하는 데 사용할 수 있는 시각화 도구가 있습니다.

이 플러그인이 포함된 애플리케이션을 다시 로드하면 전체 번들의 확대/축소 가능한 트리맵이 표시됩니다.

{% Img src="image/admin/pLAHEtl5C011wTk2IJij.png", alt="Webpack 번들 분석기", width="800", height="468" %}

이 시각화를 사용하면 번들의 어느 부분이 다른 부분보다 큰지 검사할 수 있을 뿐만 아니라 가져오는 모든 라이브러리에 대한 더 나은 아이디어를 얻을 수 있습니다. 이것은 사용하지 않거나 불필요한 라이브러리를 사용하고 있는지 식별하는 데 도움이 될 수 있습니다.

## 사용하지 않는 라이브러리 제거

이전 트리맵 이미지에는 단일 `@firebase` 도메인 내에 꽤 많은 패키지가 있습니다. 웹사이트에 Firebase 데이터베이스 구성요소만 필요한 경우 가져오기를 업데이트하여 해당 라이브러리를 가져옵니다.

```js/1-2/0
import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
```

이 프로세스는 대규모 응용 프로그램의 경우 훨씬 더 복잡하다는 점이 매우 중요합니다.

어디에도 사용되지 않는다고 확신하는 신비해 보이는 패키지의 경우 한 걸음 뒤로 물러나서 최상위 종속성 중 어느 것이 이를 사용하고 있는지 확인하십시오. 필요한 구성 요소만 가져올 수 있는 방법을 찾으십시오. 라이브러리를 사용하지 않는 경우 제거하십시오. 초기 페이지 로드에 라이브러리가 필요하지 않은 경우 [지연 로드가](/reduce-javascript-payloads-with-code-splitting) 가능한지 고려하십시오.

webpack을 사용하는 경우 [인기 있는 라이브러리에서 사용하지 않는 코드를 자동으로 제거하는 플러그인 목록](https://github.com/GoogleChromeLabs/webpack-libs-optimizations)을 확인하세요.

{% Aside 'codelab' %} [사용하지 않는 코드를 제거합니다.](/codelab-remove-unused-code) {% endAside %}

## 불필요한 라이브러리 제거

모든 라이브러리를 부품으로 쉽게 분류하고 선택적으로 가져올 수 있는 것은 아닙니다. 이러한 시나리오에서는 라이브러리를 완전히 제거할 수 있는지 고려하십시오. 맞춤형 솔루션을 구축하거나 더 가벼운 대안을 활용하는 것은 항상 고려할 가치가 있는 옵션이어야 합니다. 그러나 응용 프로그램에서 라이브러리를 완전히 제거하기 전에 이러한 노력 중 하나에 필요한 복잡성과 노력을 저울질하는 것이 중요합니다.
