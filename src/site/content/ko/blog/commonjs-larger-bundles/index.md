---
title: CommonJS가 번들을 더 크게 만드는 방법
subhead: CommonJS 모듈이 애플리케이션의 트리 쉐이킹에 어떻게 영향을 미치는지 알아보십시오.
authors:
  - mgechev
date: 2020-05-08
updated: 2020-05-26
hero: image/admin/S5JWmwRRW3rEXKwJR0JA.jpg
alt: CommonJS가 번들을 더 크게 만드는 방법
description: |-
  CommonJS 모듈은 JavaScript를 방지하는 매우 동적입니다.
  옵티마이저와 번들은 이에 대해 고급 최적화를 수행합니다.
tags:
  - blog
  - javascript
  - modules
---

이 포스트에서 우리는 CommonJS가 무엇이고 왜 그것이 당신의 JavaScript 번들을 필요 이상으로 크게 만드는지 살펴볼 것입니다.

요약: 번 **들러가 애플리케이션을 성공적으로 최적화할 수 있도록 하려면 CommonJS 모듈에 의존하지 말고 전체 애플리케이션에서 ECMAScript 모듈 구문을 사용하십시오.**

## CommonJS는 무엇입니까?

CommonJS는 JavaScript 모듈에 대한 규칙을 수립한 2009년의 표준입니다. 처음에는 주로 서버 측 응용 프로그램을 위해 웹 브라우저 외부에서 사용하기 위한 것이었습니다.

CommonJS를 사용하면 모듈을 정의하고 모듈에서 함수를 내보내고 다른 모듈로 가져올 수 있습니다. 예를 들어, 정의 아래의 조각 5개 함수 추출 모듈: `add` , `subtract` , `multiply` , `divide` 및 `max`:

```javascript
// utils.js
const { maxBy } = require('lodash-es');
const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

나중에 다른 모듈에서 다음 함수 중 일부 또는 전체를 가져와 사용할 수 있습니다.

```javascript
// index.js
const { add } = require('./utils');
console.log(add(1, 2));
```

`node`로 `index.js`를 호출하면 콘솔에 `3`이 출력됩니다.

2010년대 초 브라우저에 표준화된 모듈 시스템이 없었기 때문에 CommonJS는 JavaScript 클라이언트 측 라이브러리에서도 널리 사용되는 모듈 형식이 되었습니다.

## CommonJS는 최종 번들 크기에 어떤 영향을 줍니까?

서버 측 JavaScript 애플리케이션의 크기는 브라우저에서만큼 중요하지 않기 때문에 CommonJS는 프로덕션 번들 크기를 줄이도록 설계되지 않았습니다. 동시에, [분석](https://v8.dev/blog/cost-of-javascript-2019)에 따르면 JavaScript 번들 크기가 여전히 브라우저 앱을 느리게 만드는 가장 큰 이유입니다.

`webpack`  및 `terser`와 같은 JavaScript 번들 및 미니파이어는 앱 크기를 줄이기 위해 다양한 최적화를 수행합니다. 빌드 시 애플리케이션을 분석하면서 사용하지 않는 소스 코드에서 최대한 제거하려고 합니다.

예를 들어 위의 스니펫에서 최종 번들은 `index.js`에서 가져오는 `utils.js`의 유일한 기호이기 때문에 `add` 함수만 포함해야 합니다.

`webpack` 구성을 사용하여 앱을 빌드해 보겠습니다.

```javascript
const path = require('path');
module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
```

여기에서 프로덕션 모드 최적화를 사용하고 `index.js`를 진입점으로 사용하도록 지정합니다. `webpack`를 호출한 후 [출력](https://github.com/mgechev/commonjs-example/blob/master/commonjs/dist/out.js) 크기를 탐색하면 다음과 같이 표시됩니다.

```shell
$ cd dist && ls -lah
625K Apr 13 13:04 out.js
```

**번들은 625KB** 입니다. 출력을 보는 경우 `utils.js`의 모든 함수와 [`lodash`](https://lodash.com/)**의 많은 모듈을 찾게 됩니다. `index.js`에서 `lodash`를 사용하지 않지만 이는 출력의 일부이므로** 프로덕션 애셋에 많은 추가 가중치를 추가합니다.

이제 모듈 형식을 [ECMAScript 모듈](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)로 변경하고 다시 시도하겠습니다. 이번에는 `utils.js`가 다음과 같이 보일 것입니다.

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

import { maxBy } from 'lodash-es';

export const max = arr => maxBy(arr);
```

그리고 `index.js`는 ECMAScript 모듈 구문을 사용하여 `utils.js`에서 가져옵니다.

```javascript
import { add } from './utils';

console.log(add(1, 2));
```

`webpack` 구성을 사용하여 애플리케이션을 빌드하고 출력 파일을 열 수 있습니다. 이제 다음 [출력](https://github.com/mgechev/commonjs-example/blob/master/esm/dist/out.js)과 함께 **40 bytes** 입니다.

```javascript
(()=>{"use strict";console.log(1+2)})();
```

최종 번들에는 사용하지 않는 `utils.js`의 함수가 포함되어 있지 않으며 `lodash`의 흔적도 없습니다! 또한 `terser`(`webpack`가 사용하는 자바스크립트 미니어)는 `console.log`에서 `add` 함수에 밑줄을 그었습니다.

당신이 물어볼 수 있는 공정한 질문은 **왜 CommonJS를 사용하면 출력 번들이 거의 16,000배 더 커지는가 하는 것입니다**. 물론 이것은 장난감 예제이며 실제로 크기 차이는 그리 크지 않을 수 있지만 CommonJS가 프로덕션 빌드에 상당한 가중치를 추가할 가능성이 있습니다.

**CommonJS 모듈은 ES 모듈보다 훨씬 동적이기 때문에 일반적인 경우에 최적화하기가 더 어렵습니다. 번들러와 미니파이어가 애플리케이션을 성공적으로 최적화할 수 있도록 하려면 CommonJS 모듈에 의존하지 말고 전체 애플리케이션에서 ECMAScript 모듈 구문을 사용하십시오.**

`index.js`에서 ECMAScript 모듈을 사용하더라도 사용 중인 모듈이 CommonJS 모듈이면 앱의 번들 크기가 문제가 됩니다.

## CommonJS가 앱을 더 크게 만드는 이유는 무엇입니까?

이 질문에 답하기 위해 `webpack`에서 `ModuleConcatenationPlugin`의 동작을 살펴본 후 정적 분석 가능성에 대해 논의합니다. 이 플러그인은 모든 모듈의 범위를 하나의 클로저로 연결하고 브라우저에서 코드 실행 시간을 단축합니다. 예를 살펴보겠습니다.

```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```javascript
// index.js
import { add } from './utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

위의 ECMAScript 모듈은 `index.js`에서 가져옵니다. `subtract` 함수도 정의합니다. `webpack` 구성을 사용하여 프로젝트를 빌드할 수 있지만 이번에는 최소화를 비활성화합니다.

```javascript
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
};
```

생성된 출력을 살펴보겠습니다.

```javascript
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./utils.js**
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// CONCATENATED MODULE: ./index.js**
const index_subtract = (a, b) => a - b;**
console.log(add(1, 2));**

/******/ })();
```

위의 출력에서 모든 함수는 동일한 네임스페이스 안에 있습니다. 충돌을 방지하기 위해 webpack은 `index.js`의 `subtract` 함수 이름을 `index_subtract`로 변경했습니다.

축소자가 위의 소스 코드를 처리하면 다음이 수행됩니다.

- 사용하지 않는 함수 `subtract` 및 `index_subtract` 제거
- 모든 주석 및 중복 공백 제거
- `console.log` 호출에서 `add` 함수 본문 인라인

종종 개발자 **는 사용하지 않는 가져오기를 제거하는 것을 tree-shaking**이라고 합니다. Tree-shaking은 webpack이 utils.js에서 가져오는 기호와 `utils.js` 기호를 정적으로(빌드 시) 이해할 수 있었기 때문에 가능했습니다.

이 동작은 CommonJS와 비교하여 **정적으로 더 분석 가능**하기 때문에 **ES 모듈에** 대해 기본적으로 활성화되어 있습니다.

똑같은 예를 보겠습니다. 하지만 이번에는 ES 모듈 대신 CommonJS를 사용하도록 `utils.js`를 변경합니다.

```javascript
// utils.js
const { maxBy } = require('lodash-es');

const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

이 작은 업데이트는 출력을 크게 변경합니다. 이 페이지에 포함하기에는 너무 길어서 일부만 공유했습니다.

```javascript
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

최종 번들에는 번들된 모듈에서 함수 가져오기/내보내기를 담당하는 삽입된 코드인 `webpack` `utils.js` 및 `index.js`의 모든 기호를 동일한 네임스페이스 아래에 배치하는 대신 `__webpack_require__`를 사용하는 `add` 함수가 동적으로 필요합니다.

이것은 CommonJS를 사용하여 임의의 표현식에서 내보내기 이름을 가져올 수 있기 때문에 필요합니다. 예를 들어, 아래 코드는 절대적으로 유효한 구문입니다.

```javascript
module.exports[localStorage.getItem(Math.random())] = () => { … };
```

사용자 브라우저의 컨텍스트에서 런타임에만 사용할 수 있는 정보가 필요하기 때문에 번들러가 내보낸 기호의 이름이 무엇인지 빌드 시간에 알 수 있는 방법이 없습니다.

**이런 식으로 축소기는 `index.js`가 종속성에서 정확히 무엇을 사용하는지 이해할 수 없으므로 트리를 흔들 수 없습니다.** 타사 모듈에서도 정확히 동일한 동작을 관찰할 것입니다. **`node_modules`에서 CommonJS 모듈을 가져오면 빌드 도구 체인이 이를 제대로 최적화할 수 없습니다.**

## CommonJS로 트리 흔들기

CommonJS 모듈은 정의상 동적이기 때문에 분석하기가 훨씬 더 어렵습니다. 예를 들어, ES 모듈의 가져오기 위치는 표현식인 CommonJS와 비교하여 항상 문자열 리터럴입니다.

경우에 따라 사용 중인 라이브러리가 CommonJS를 사용하는 방법에 대한 특정 규칙을 따르는 경우 타사 `webpack` [플러그인](https://github.com/indutny/webpack-common-shake)을 사용하여 빌드 시 사용하지 않는 내보내기를 제거할 수 있습니다. 이 플러그인은 트리 쉐이킹에 대한 지원을 추가하지만 종속성이 CommonJS를 사용할 수 있는 다양한 방법을 모두 다루지는 않습니다. 이것은 ES 모듈과 동일한 보장을 받지 못한다는 것을 의미합니다. `webpack` 동작 외에 빌드 프로세스의 일부로 추가 비용이 추가됩니다.

## 결론

**번들러가 애플리케이션을 성공적으로 최적화할 수 있도록 하려면 CommonJS 모듈에 의존하지 말고 전체 애플리케이션에서 ECMAScript 모듈 구문을 사용하십시오.**

다음은 최적의 경로에 있는지 확인하기 위한 몇 가지 실행 가능한 팁입니다.

- Rollup.js의 [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 플러그인을 사용하고 `modulesOnly` 플래그를 설정하여 ECMAScript 모듈에만 의존하도록 지정합니다.
- [`is-esm`](https://github.com/mgechev/is-esm) 패키지를 사용하여 npm 패키지가 ECMAScript 모듈을 사용하는지 확인하십시오.
- Angular를 사용하는 경우 기본적으로 트리를 흔들 수 없는 모듈에 의존하면 경고가 표시됩니다.
