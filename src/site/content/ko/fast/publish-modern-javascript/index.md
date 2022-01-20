---
layout: post
title: 더 빠른 애플리케이션을 위한 최신 JavaScript 배포, 제공 및 설치
subhead: 최신 JavaScript 의존성 및 결과물을 중심으로 성능을 개선합니다.
hero: image/admin/UQbMiPKbXL1EDjtWsLju.jpg
authors:
  - houssein
  - developit
description: 최신 JavaScript는 트랜스파일 된 ES5에 비해 크기 및 성능 향상을 제공하여 95%의 웹 브라우저에서 지원됩니다. 최신 JavaScript 결과물을 활성화하면 애플리케이션에 이러한 이점이 있지만 그 효과는 이미 ES5로 트랜스파일 된 의존성으로 인해 제한됩니다. 이 가이드는 최신 패키지를 npm으로 배포하는 방법, 최신 JavaScript 패키지를 설치하고 최적으로 번들링하는 방법에 관해 설명합니다.
date: 2020-12-10
updated: 2020-12-16
codelabs:
  - codelab-serve-modern-code
tags:
  - performance
  - blog
---

브라우저의 90% 이상이 최신 JavaScript를 실행할 수 있지만 널리 퍼져있는 레거시 JavaScript는 오늘날 웹에서 성능 문제를 일으키는 가장 큰 원인 중 하나입니다. [EStimator.dev](http://estimator.dev/)는 최신 JavaScript 문법을 제공하여 사이트가 크기와 성능을 얼마나 향상할 수 있는지 계산하는 간단한 웹 기반 도구입니다.

<figure data-size="full">{% Img src="image/admin/FHHnXqdjdsC6PNSSnnC4.png", alt="EStimator.dev 분석은 최신 JavaScript로 웹사이트가 9% 더 빨라질 수 있다는 것을 보여줍니다.", width="800", height="785" %}<figcaption> EStimator.dev </figcaption></figure>

오늘날 웹은 레거시 JavaScript로 인해 제한되며 **ES2017** 문법을 사용하여 웹 페이지 또는 패키지를 작성, 배포 및 제공하는 것만큼 성능을 향상시키는 단일 최적화 방식은 없습니다.

## 최신 자바스크립트

최신 JavaScript는 특정 버전의 ECMAScript 사양으로 작성된 코드가 아니라 모든 최신 브라우저에서 지원되는 문법이 특징입니다. Chrome, Edge, Firefox 및 Safari와 같은 최신 웹 브라우저는 [브라우저 시장의 90%](https://www.caniuse.com/usage-table) 이상을 차지하고 동일한 기본 렌더링 엔진에 의존하는 다른 브라우저가 추가로 5%를 차지합니다. 이는 전 세계 웹 트래픽의 95%가 다음을 포함한 지난 10년 동안 가장 널리 사용된 JavaScript 언어 기능을 지원하는 브라우저에서 발생한다는 것을 의미합니다.

- 수업(ES2015)
- 화살표 함수(ES2015)
- 제너레이터 (ES2015)
- 블록 스코핑 (ES2015)
- 디스트럭처링 (ES2015)
- Rest 및 Spread 매개 변수(ES2015)
- 객체 축약(ES2015)
- Async/await (ES2017)

최신 버전의 언어 사양에 있는 기능은 일반적으로 최신 브라우저에서 일관되게 지원되지 않습니다. 예를 들어, 많은 ES2020 및 ES2021 기능은 여전히 주요 브라우저인 브라우저 시장의 70%에서만 지원되지만 이러한 기능에 직접 의존하는 것은 충분히 안전하지는 않습니다. 즉, "최신" JavaScript는 변하긴 하지만 ES2017은[일반적으로 사용되는 대부분의 최신 문법 기능을 포함하는 동시에](https://dev.to/garylchew/bringing-modern-javascript-to-libraries-432c) 가장 광범위한 브라우저 호환성을 제공합니다. 즉, **ES2017은 오늘날 최신 문법에 가장 근접합니다**.

## 레거시 JavaScript

레거시 JavaScript는 특히 위에 언급한 모든 언어 기능을 사용하지 않는 코드입니다. 개발자 대부분은 최신 문법을 사용하여 소스 코드를 작성하지만, 브라우저 지원 향상을 위해 모든 것을 레거시 문법으로 컴파일합니다. 레거시 문법으로 컴파일하면 브라우저 지원 범위가 늘어나지만, 효과는 종종 우리가 생각하는 것보다 작습니다. 많은 경우 상당한 비용이 발생하는 데 반해 지원은 약 95%에서 98%로 증가합니다.

- 레거시 JavaScript는 일반적으로 동등한 최신 코드보다 크기가 약 20% 더 크고 속도는 느립니다. 도구의 결함과 잘못된 구성은 종종 이 격차를 더욱 넓힙니다.

- 설치된 라이브러리는 일반적인 프로덕션 JavaScript 코드의 90%를 차지합니다. 라이브러리 코드는 최신 코드를 배포하여 방지할 수 있는 폴리필 및 복제된 헬퍼 함수로 인해 더 높은 레거시 JavaScript 오버헤드를 발생시킵니다.

## npm의 최신 JavaScript

최근 Node.js는 [패키지의 진입점](https://nodejs.org/api/packages.html#packages_package_entry_points)을 정의하기 위해  `"exports"` 필드를 표준화했습니다.

```json
{
  "exports": "./index.js"
}
```

`"exports"` 필드에서 참조하는 모듈은 ES2019를 지원하는 12.8 이상의 Node 버전을 의미합니다. 이는 `"exports"` 필드를 사용하여 참조되는 모든 모듈이 *최신 JavaScript로 작성*될 수 있다는 것을 의미합니다. 패키지 사용자는 `"exports"` 필드가 있는 모듈에 최신 코드가 포함되어 있고 필요한 경우 트랜스파일해야 한다고 간주해야 합니다.

### 최신 코드 전용

최신 코드가 포함된 패키지를 배포하고 소비자가 이를 의존성으로 사용할 때 소비자가 트랜스파일을 처리하도록 하려면 `"exports"` 필드만 사용하세요.

```json
{
  "name": "foo",
  "exports": "./modern.js"
}
```

{% Aside 'caution' %} 이 접근 방식은 *권장되지 않습니다*. 완벽한 세상에서, 모든 개발자는 이미 모든 의존성( `node_modules` )을 필요한 문법으로 트랜스파일하도록 빌드 시스템을 구성했을 것입니다. 그러나 현재는 그렇지 않으며 최신 구문만 사용하여 패키지를 배포하면 레거시 브라우저를 통해 액세스할 수 있는 애플리케이션에서 패키지를 사용할 수 없습니다. {% endAside %}

### 레거시 폴백이 있는 최신 코드

최신 코드를 사용하고 레거시 브라우저에 대한 ES5 + CommonJS 폴백도 포함하는 패키지를 배포하려면 `"exports"` 필드를 `"main"`와 함께 사용합니다.

```json
{
  "name": "foo",
  "exports": "./modern.js",
  "main": "./legacy.cjs"
}
```

### 레거시 폴백 및 ESM 번들러 최적화가 포함된 최신 코드

폴백 CommonJS 진입점을 정의하는 것 외에도 `"module"` 필드는 유사한 레거시 대체 번들을 지정하는 데 사용할 수 있습니다. JavaScript 모듈 문법(`import` 및 `export`)을 사용합니다.

```json
{
  "name": "foo",
  "exports": "./modern.js",
  "main": "./legacy.cjs",
  "module": "./module.js"
}
```

webpack 및 Rollup과 같은 많은 번들러는 이 필드에 의존하여 모듈 기능을 활용하고 [트리 쉐이킹을](/commonjs-larger-bundles/#how-does-commonjs-affect-your-final-bundle-size) 가능하게 합니다. `import`/`export` 문법을 제외한 최신 코드를 포함하지 않는 레거시 번들이므로 이 접근 방식을 사용하여 번들링에 최적화된 레거시 폴백과 함께 최신 코드를 제공합니다.

## 애플리케이션의 최신 JavaScript

서드파티 의존성은 웹 애플리케이션에서 일반적인 프로덕션용 JavaScript 코드의 대부분을 구성합니다. npm 의존성은 역사적으로 레거시 ES5 구문으로 배포되었지만 더 이상 안전하지 않으며 의속성 업데이트로 인해 애플리케이션에서 브라우저 지원이 중단될 위험이 있습니다.

최신 JavaScript를 배포하는 npm 패키지의 수가 증가함에 따라 빌드 도구가 이를 처리하도록 설정되어 있는지 확인하는 것이 중요합니다. 사용하고 있는 npm 패키지 중 일부가 이미 최신 언어 기능을 사용하고 있을 가능성이 큽니다. 이전 브라우저에서 애플리케이션을 중단하지 않고 npm의 최신 코드를 사용할 수 있는 여러 옵션이 있지만 일반적인 아이디어는 빌드 시스템이 의존성을 소스 코드와 동일한 문법을 사용한 코드로 트랜스파일하도록 하는 것입니다.

## webpack

webpack 5부터는 번들 및 모듈용 코드를 생성할 때 webpack이 사용할 구문을 구성할 수 있습니다. 이것은 코드나 종속성을 트랜스파일하지 않으며 webpack에 의해 생성된 "glue" 코드에만 영향을 미칩니다. 브라우저 지원 대상을 지정하려면 프로젝트에 [browserslist 구성](https://github.com/browserslist/browserslist#readme)을 추가하거나 webpack 구성에서 직접 수행하세요.

```js
module.exports = {
  target: ['web', 'es2017'],
};
```

최신 ES 모듈 환경을 대상으로 할 때 불필요한 래퍼 기능을 생략하는 최적화된 번들을 생성하도록 webpack을 구성하는 것도 가능합니다. 이는 또한 `<script type="module">`을 사용하여 코드 분할 번들을 로드하도록 webpack을 구성합니다.

```js
module.exports = {
  target: ['web', 'es2017'],
  output: {
    module: true,
  },
  experiments: {
    outputModule: true,
  },
};
```

Optimize Plugin 및 BabelEsmPlugin과 같은 레거시 브라우저를 계속 지원하면서 최신 JavaScript를 컴파일 및 제공할 수 있는 많은 webpack 플러그인이 있습니다.

### Optimize Plugin

[Optimize Plugin](https://github.com/developit/optimize-plugin)은 개별 소스 파일 대신 최종 번들 코드를 최신 JavaScript에서 JavaScript로 변환하는 webpack 플러그인입니다. 이것은 webpck 구성이 다중 출력 결과물이나 문법에 대한 특별한 분기 없이 모든 것이 최신 JavaScript라고 가정할 수 있도록 하는 자체적으로 포함된 설정입니다.

Optimize Plugin은 개별 모듈 대신 번들에서 작동하므로 애플리케이션의 코드와 의존성을 동일하게 처리합니다. 이렇게 하면 코드가 번들로 제공되고 올바른 문법으로 트랜스파일되기 때문에 npm의 최신 JavaScript 의존성을 안전하게 사용할 수 있습니다. 또한 이는 최신 및 레거시 브라우저에 대해 별도의 번들을 생성하는 동시에 두 가지 컴파일 단계를 포함하는 기존 솔루션보다 빠를 수 있습니다. 두 세트의 번들은[module/nomodule 패턴](/serve-modern-code-to-modern-browsers/)을 사용하여 로드되도록 설계되었습니다.

```js
// webpack.config.js
const OptimizePlugin = require('optimize-plugin');

module.exports = {
  // ...
  plugins: [new OptimizePlugin()],
};
```

`Optimize Plugin` 은 일반적으로 최신 코드와 레거시 코드를 별도로 번들로 제공하는 사용자 지정 webpack 구성보다 더 빠르고 효율적일 수 있습니다. 또한 [Babel](https://babeljs.io/) 실행을 처리하고 최신 및 레거시 출력에 대해 별도의 최적 설정으로 [Terser](https://terser.org/)를 사용하여 번들을 축소합니다. 마지막으로 생성된 레거시 번들에 필요한 폴리필이 전용 스크립트로 추출되어 최신 브라우저에서 중복되거나 불필요하게 로드되지 않습니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-publish-modern-javascript/transpile-before-after.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-publish-modern-javascript/transpile-before-after.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>비교: 소스 모듈을 두 번 트랜스파일하는 것과 생성된 번들을 트랜스파일하는 것.</figcaption></figure>

### BabelEsmPlugin

[BabelEsmPlugin](https://github.com/prateekbh/babel-esm-plugin)}은 {a1@babel/preset-env 와 함께 작동하여 기존 번들의 최신 버전을 생성하여 최신 브라우저에 덜 변환된 코드를 제공하는 webpack 플러그인입니다. [이것은 Next.js](https://nextjs.org/) 및 [Preact CLI](https://preactjs.com/cli/) 에서 사용되는 가장 인기 있는 완성된 모듈/노모듈용 솔루션입니다.

```js
// webpack.config.js
const BabelEsmPlugin = require('babel-esm-plugin');

module.exports = {
  //...
  module: {
    rules: [
      // 기존 babel-loader 구성:
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [new BabelEsmPlugin()],
};
```

`BabelEsmPlugin`은 애플리케이션의 두 가지 크게 분리된 빌드를 실행하기 때문에 광범위한 webpack 구성을 지원합니다. 두 번 컴파일하면 대규모 응용 프로그램의 경우 약간의 추가 시간이 걸릴 수 있지만 이 기술을 사용하면 `BabelEsmPlugin`이 기존 webpack 구성에 원활하게 통합되고 사용 가능한 가장 편리한 옵션 중 하나가 됩니다.

### node_modules를 트랜스파일하도록 babel-loader 구성

이전의 두 플러그인을 사용하지 않고 `babel-loader`를 사용하는 경우 최신 JavaScript npm 모듈을 사용하려면 중요한 단계가 필요합니다. 두 개의 개별 `babel-loader` 구성을 정의하는 것은 `node_modules` 에 있는 최신 언어 기능을 ES2017로 자동 컴파일하는 동시에 프로젝트 구성에 정의된 Babel 플러그인 및 사전 설정으로 퍼스트 파티 코드를 트랜스파일할 수 있습니다. 이것은 모듈/노모듈 설정을 위한 최신 및 레거시 번들을 생성하지 않지만 이전 브라우저를 중단하지 않고 최신 JavaScript가 포함된 npm 패키지를 설치하고 사용할 수 있도록 합니다.

[webpack-plugin-modern-npm](https://www.npmjs.com/package/webpack-plugin-modern-npm)은 이 기술을 사용하여 `package.json`의 `"exports"` 필드가 있는 npm 의존성을 컴파일합니다. 여기에는 다음과 같은 최신 문법이 포함될 수 있기 때문입니다.

```js
// webpack.config.js
const ModernNpmPlugin = require('webpack-plugin-modern-npm');

module.exports = {
  plugins: [
    // node_modules에서 발견된 최신 문법을 자동 트랜스파일
    new ModernNpmPlugin(),
  ],
};
```

또는 모듈이 resolve 될 때 `package.json`의 `"exports"` 필드를 확인하여 webpack 구성에서 기술을 수동으로 구현할 수 있습니다. 간결함을 위해 캐싱을 생략하면 사용자 정의 구현은 다음과 같을 수 있습니다.

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // 퍼스트 파티 코드 트랜스파일:
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // 최신 문법으로 작성된 의존성 모듈 트랜스파일:
      {
        test: /\.js$/i,
        include(file) {
          let dir = file.match(/^.*[/\\]node_modules[/\\](@.*?[/\\])?.*?[/\\]/);
          try {
            return dir && !!require(dir[0] + 'package.json').exports;
          } catch (e) {}
        },
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

이 접근 방식을 사용할 때는 minifier가 최신 구문을 지원하는지 확인해야 합니다. [Terser](https://github.com/terser/terser#minify-options) 와 [uglify-es](https://github.com/mishoo/UglifyJS/tree/harmony#minify-options)에는 압축 및 포매팅 중 ES2017 문법을 보존하고 경우에 따라 생성하기 위해 `{ecma: 2017}`을 지정하는 옵션이 있습니다.

## Rollup

롤업은 단일 빌드의 일부로 여러 번들 세트를 생성하기 위한 기본 제공 지원을 가지고 있으며 기본적으로 최신 코드를 생성합니다. 결과적으로 이미 사용하고 있을 가능성이 있는 공식 플러그인으로 최신 및 레거시 번들을 생성하도록 롤업을 구성할 수 있습니다.

### @rollup/plugin-babel

Rollup을 사용하는 경우 [`getBabelOutputPlugin()` 메서드](https://github.com/rollup/plugins/tree/master/packages/babel#running-babel-on-the-generated-code) (Rollup의 [공식 Babel 플러그인](https://github.com/rollup/plugins/tree/master/packages/babel) 제공)는 개별 소스 모듈이 아닌 생성된 번들의 코드를 변환합니다. Rollup은 각각 고유한 플러그인이 있는 단일 빌드의 일부로 여러 번들 세트를 생성하는 기능이 기본적으로 있습니다. 각각 다른 다음과 같은 Babel 출력 플러그인 구성을 통해 전달하여 최신 및 레거시 번들을 생성하기 위해 이를 사용할 수 있습니다.

```js
// rollup.config.js
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    // 최신 번들:
    {
      format: 'es',
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {esmodules: true},
                bugfixes: true,
                loose: true,
              },
            ],
          ],
        }),
      ],
    },
    // 레거시(ES5) 번들:
    {
      format: 'amd',
      entryFileNames: '[name].legacy.js',
      chunkFileNames: '[name]-[hash].legacy.js',
      plugins: [
        getBabelOutputPlugin({
          presets: ['@babel/preset-env'],
        }),
      ],
    },
  ],
};
```

## 추가 빌드 도구

Rollup과 Webpack은 고도로 구성 가능합니다. 즉, 일반적으로 각 프로젝트는 의존성 모듈에서 최신 JavaScript 문법을 사용하도록 구성을 업데이트해야 합니다. [Parcel](https://parceljs.org/), [Snowpack](https://www.snowpack.dev/), [Vite](https://github.com/vitejs/vite) 및 [WMR](https://github.com/preactjs/wmr)과 같이 구성보다 규칙과 기본값을 선호하는 더 높은 수준의 빌드 도구도 있습니다. 이러한 도구의 대부분은 npm 의존성 모듈이 최신 문법을 포함할 수 있다고 가정하고 프로덕션용으로 빌드할 때 적절한 구문 수준으로 트랜스파일합니다.

webpack 및 Rollup을 위한 전용 플러그인 외에도 레거시 폴백이 있는 최신 JavaScript 번들은 [devolution](https://github.com/theKashey/devolution)을 사용하여 모든 프로젝트에 추가할 수 있습니다. Devolution은 빌드 시스템의 출력 결과물을 변환하여 레거시 JavaScript 변형을 생성하여 번들링 및 변환이 최신 출력물을 가정할 수 있도록 하는 독립 실행형 도구입니다.

## 결론

[EStimator.dev](http://estimator.dev/)는 대다수의 사용자를 위해 최신 JavaScript 코드로 전환하는 것이 얼마나 큰 영향을 미칠 수 있는지 쉽게 평가할 수 있는 방법을 제공하도록 제작되었습니다. 오늘날 ES2017은 최신 문법에 가장 가깝고 npm, Babel, webpack 및 Rollup과 같은 도구를 통해 이 문법을 사용하여 빌드 시스템을 구성하고 패키지를 작성할 수 있습니다. 이 게시물은 여러 접근 방식을 다루며 사용 사례에 가장 적합한 옵션을 사용해야 합니다.

{% YouTube 'cLxNdLK--yI' %}

<br>
