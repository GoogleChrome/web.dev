---
layout: post
title: CSS 축소
authors:
  - demianrenzulli
description: 브라우저가 스타일을 처리하는 방식에 영향을 주지 않고 성능을 향상시키기 위해 CSS 파일을 축소하는 방법을 알아봅니다.
date: 2019-05-02
tags:
  - performance
---

CSS 파일에는 주석, 화이트 공백 및 들여쓰기와 같은 불필요한 문자가 포함될 수 있습니다. 프로덕션에서는 브라우저가 스타일을 처리하는 방식에 영향을 주지 않으면서 파일 크기를 줄이기 위해 이러한 문자를 안전하게 제거할 수 있습니다. 이 기술을 **축소**라고 합니다.

## 축소되지 않은 CSS 로드하기

다음 CSS 블록을 살펴보세요.

```css
body {
  font-family: "Benton Sans", "Helvetica Neue", helvetica, arial, sans-serif;
  margin: 2em;
}

/* all titles need to have the same font, color and background */
h1 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}

h2 {
  font-style: italic;
  color: #373fff;
  background-color: #000000;
}
```

이 콘텐츠는 읽기 쉬운데, 필요한 것보다 더 큰 파일을 생성해야 합니다.

- 들여쓰기를 위해 공백을 사용하고 주석이 포함되어 있습니다. 주석은 브라우저에서 무시되므로 제거할 수 있습니다.
- `<h1>` 및 `<h2>` 요소는 스타일이 동일합니다. "`h1 {...} h2 {...}`"와 같이 이들을 별도로 선언하는 대신 "`h1, h2{...}`"로 표현할 수 있습니다.
- **background-color**, `#000000`은 `#000`으로 표현할 수 있습니다.

이러한 변경을 수행한 후에는 동일한 스타일의 더 간결한 버전을 얻을 수 있습니다.

```css
body{font-family:"Benton Sans","Helvetica Neue",helvetica,arial,sans-serif;margin:2em}h1,h2{font-style:italic;color:#373fff;background-color:#000}
```

아마도 이런 CSS를 작성하고 싶지는 않을 것입니다. 대신 평소와 같이 CSS를 작성하고 빌드 프로세스에 축소 단계를 추가할 수 있습니다. 이 가이드에서는 널리 사용되는 빌드 도구인 [webpack](https://webpack.js.org/)을 사용하여 이를 수행하는 방법을 알아봅니다.

## 측정

다른 가이드인 [Fav Kitties](https://fav-kitties-animated.glitch.me/)에서 사용한 사이트에 CSS 축소를 적용합니다. 이 사이트 버전은 멋진 CSS 라이브러리인 [animate.css](https://github.com/daneden/animate.css)를 사용하여 사용자가 고양이 😺에 투표할 때 다양한 페이지 요소에 애니메이션을 적용합니다.

첫 번째 단계로 이 파일을 축소한 후 어떤 기회가 있는지 이해해야 합니다.

1. [측정 페이지](/measure)를 엽니다.
2. URL: `https://fav-kitties-animated.glitch.me`를 입력하고 **Run Audit(감사 실행)**을 클릭합니다.
3. **View report(보고서 보기)**를 클릭합니다.
4. **Performance(성능)**를 클릭하고 **Opportunities(기회)** 섹션으로 이동합니다.

결과 보고서는 **animate.css** 파일에서 최대 **16KB**를 절약할 수 있음을 보여줍니다.

{% Img src="image/admin/RFMk5OMAIvOlkUZJTsh4.png", alt="Lighthouse: CSS 축소 기회", width="800", height="172", class="screenshot" %}

이제 CSS의 내용을 검사합니다.

1. Chrome에서 [Fav Kitties 사이트](https://fav-kitties-animated.glitch.me/)를 엽니다. (Glitch 서버가 처음 응답하는 데 시간이 걸릴 수 있습니다.) {% Instruction 'devtools-network', 'ol' %}
2. **CSS** 필터를 클릭합니다.
3. **Disable cache(캐시 비활성화)** 확인란을 선택합니다. {% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/WgneNAyftk8jneyXxMih.png", alt="DevTools CSS 최적화되지 않은 추적", width="800", height="138" %}

페이지는 각각 **1.9KB**와 **76.2KB**인 두 CSS 파일을 요청합니다.

1. **animate.css**를 클릭합니다.
2. **Response(응답)** 탭을 클릭하여 파일 내용을 확인합니다.

스타일시트에는 화이트 공백 및 들여쓰기 문자가 포함되어 있습니다.

{% Img src="image/admin/UEB5Xxe5IHhGtMx3XfKD.png", alt="DevTools CSS 최적화되지 않은 응답", width="800", height="286" %}

다음으로, 이러한 파일을 축소하기 위해 빌드 프로세스에 몇 가지 webpack 플러그인을 추가합니다.

{% Aside 'note' %} **참고:** 이전 Lighthouse 보고서에는 `animate.css`만 축소에 대한 기회로 나열됩니다. `style.css`를 축소하면 일부 바이트도 절약되지만 Lighthouse에서 상당한 절약 효과라고 여기기에는 충분하지 않습니다. 그러나 CSS를 축소하는 것은 일반적인 모범 사례입니다. 따라서 모든 CSS 파일을 축소하는 것이 좋습니다. {% endAside %}

## Webpack을 사용한 CSS 축소

최적화를 시작하기 전에 [Fav Kitties 사이트](https://glitch.com/edit/#!/fav-kitties-animated?path=webpack.config.js:1:0%5D)의 빌드 프로세스가 어떻게 작동하는지 이해해 보겠습니다.

{% Glitch { id: 'fav-kitties-animated', path: 'webpack.config.js', previewSize: 0 } %}

기본적으로 webpack이 생성하는 결과적인 JS 번들은 인라인된 CSS 파일의 내용을 포함합니다. 우리는 별도의 CSS 파일을 유지하려고 하므로 두 가지 보완 플러그인을 사용합니다.

- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)은 빌드 프로세스의 단계 중 하나로 각 스타일 시트를 자체 파일로 추출합니다.
- [webpack-fix-style-only-entries](https://github.com/fqborges/webpack-fix-style-only-entries)는 **webpack-config.js**에 나열된 각 CSS 파일에 대해 추가 JS 파일의 생성을 방지하기 위해 wepback 4의 문제를 수정하는 데 사용됩니다.

이제 프로젝트에서 몇 가지 사항을 변경합니다.

1. [Glitch에서 Fav Kitties 프로젝트](https://glitch.com/~fav-kitties-animated)를 엽니다. {% Instruction 'source', 'ol' %} {% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

결과적인 CSS를 축소하려면 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)을 사용합니다.

1. Glitch 콘솔에서 `npm install --save-dev optimize-css-assets-webpack-plugin`을 실행합니다.
2. `refresh`를 실행하여 변경 사항이 Glitch 편집기와 동기화되도록 합니다.

다음으로, Glitch 편집기로 돌아가 **webpack.config.js** 파일을 열고 다음과 같이 수정합니다.

파일 시작 부분에 모듈을 로드합니다.

```js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
```

그런 다음 플러그인의 인스턴스를 **plugins** 배열에 전달합니다.

```js
  plugins: [
    new HtmlWebpackPlugin({template: "./src/index.html"}),
    new MiniCssExtractPlugin({filename: "[name].css"}),
    new FixStyleOnlyEntriesPlugin(),
    new OptimizeCSSAssetsPlugin({})
  ]
```

변경 후 프로젝트 재빌드가 트리거됩니다. 결과적인 **webpack.config.js**의 모습은 다음과 같습니다.

{% Glitch { id: 'fav-kitties-animated-min', path: 'webpack.config.js', previewSize: 0 } %}

다음으로, 성능 도구를 사용하여 이 최적화의 결과를 확인합니다.

## 확인

{% Instruction 'preview' %}

이전 단계에서 길을 잃은 경우 [여기](https://fav-kitties-animated-min.glitch.me/)를 클릭하여 최적화된 버전의 사이트를 열 수 있습니다.

파일의 크기와 내용을 검사하려면:

{% Instruction 'devtools-network', 'ol' %}

1. **CSS** 필터를 클릭합니다.
2. **Disable cache(캐시 비활성화)** 확인란이 아직 선택되지 않은 경우 선택합니다. {% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/id5kWwB3NilmVPWPTM59.png", alt="DevTools CSS 최적화되지 않은 응답", width="800", height="130" %}

이러한 파일을 검사하고 새 버전에 어떤 화이트 공백도 없는 것을 확인할 수 있습니다. 두 파일 모두 훨씬 작습니다. 특히 [animate.css](http://fav-kitties-animated-min.glitch.me/animate.css)는 **~26%** 감소하여 **~20KB**가 절약되었습니다!

마지막 단계:

1. [측정 페이지](/measure)를 엽니다.
2. 최적화된 사이트의 URL을 입력합니다.
3. **View report(보고서 보기)**를 클릭합니다.
4. **Performance(성능)**를 클릭하고 **Opportunities(기회)** 섹션을 찾습니다.

보고서에 "CSS 축소"가 더 이상 "기회"로 표시되지 않으며 이제 "감사 통과" 섹션으로 이동되었습니다.

{% Img src="image/admin/zegn2qIHYYK58w1GhgYd.png", alt="Lighthouse가 최적화된 페이지 감사를 통과했습니다.", width="800", height="163" %}

CSS 파일은 [렌더링을 차단하는 리소스](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources)이므로 대용량 CSS 파일을 사용하는 사이트에 축소를 적용하면 [첫 콘텐츠풀 페인트](/fcp/)와 같은 메트릭에서 개선을 확인할 수 있습니다.

## 다음 단계 및 리소스

이 가이드에서는 webpack을 이용한 CSS 축소에 대해 다루었지만, [Gulp](https://gulpjs.com/)에 대한 [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) 또는 [Grunt](https://gruntjs.com/)에 대한 [grunt-contrib-cssmin](https://www.npmjs.com/package/grunt-contrib-cssmin)와 같이 다른 빌드 도구에도 같은 접근 방식을 따를 수 있습니다.

축소는 다른 유형의 파일에도 적용할 수 있습니다. [네트워크 페이로드 축소 및 압축 가이드](/fast/reduce-network-payloads-using-text-compression)를 확인하여 JS를 축소하는 도구와 압축과 같은 보완 기술에 대해 자세히 알아보세요.
