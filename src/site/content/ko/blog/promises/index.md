---
title: 'JavaScript Promises: 소개'
subhead: Promise는 지연 및 비동기 계산을 단순화합니다. Promise는 아직 완료되지 않은 작업을 나타냅니다.
description: Promise는 지연 및 비동기 계산을 단순화합니다. Promise는 아직 완료되지 않은 작업을 나타냅니다.
date: 2013-12-16
updated: 2021-01-18
tags:
  - javascript
authors:
  - jakearchibald
feedback:
  - api
---

개발자 여러분, 웹 개발의 역사에서 중요한 순간에 대비하십시오.

<em>[드럼롤 시작]</em>

JavaScript에 Promise가 도착했습니다!

<em>[불꽃이 터지고, 위에서 반짝이는 종이 비가 내리고, 군중이 열광합니다]</em>

이 시점에서 여러분은 다음 범주 중 하나에 속합니다.

- 사람들이 여러분 주위에서 환호하고 있지만, 여러분은 왜 야단들인지 잘 모릅니다. 아마도 여러분은 "Promise"가 무엇인지 확실히 모를 수도 있습니다. 어깨를 으쓱해 보지만 반짝이는 종이의 무게가 어깨를 짓누릅니다. 그렇다면 걱정하지 마십시오. 제가 왜 이 일에 관심을 가져야 하는지 알아내는 데 오랜 시간이 걸렸습니다. 아마도 여러분은 [처음부터](#whats-all-the-fuss-about) 시작하고 싶을 것입니다.
- 여러분은 공중에 주먹을 날립니다! 시간 맞나요? 이전에 이러한 Promise 기능을 사용한 적이 있지만 모든 구현에 약간 다른 API가 있다는 것이 귀찮습니다. 공식 JavaScript 버전에 대한 API는 무엇입니까? 아마도 [용어](#promise-terminology)부터 시작하고 싶을 것입니다.
- 여러분은 이미 이것을 알고 있었고 이것이 마치 새로운 것인 것처럼 펄쩍펄쩍 뛰는 사람들을 비웃을 것입니다. 잠시 자신의 우월성을 만끽했으면 [API 참조](#promise-api-reference) 페이지로 바로 이동하세요.

## 이런 호들갑은 어디서 오는 것일까요? {: #whats-all-the-fuss-about }

JavaScript는 단일 스레드입니다. 즉, 두 비트의 스크립트를 동시에 실행할 수 없습니다. 차례로 실행해야 하는 것이죠. 브라우저에서 JavaScript는 브라우저마다 차이가 있는 많은 요소들과 스레드를 공유합니다. 그러나 일반적으로 JavaScript는 페인팅, 스타일 업데이트 및 사용자 작업 처리(예: 텍스트 강조 표시 및 양식 컨트롤과의 상호 작용)와 동일한 대기열에 있습니다. 이러한 것들 중 하나에서 이루어지는 작업으로 인해 다른 작업들이 지연됩니다.

인간으로서 여러분은 멀티스레드입니다. 여러 손가락으로 입력할 수 있고 운전하면서 대화할 수 있습니다. 우리가 처리해야 하는 유일한 차단 기능은 재채기입니다. 재채기하는 동안에는 현재의 모든 활동을 일시 중단해야 하니까요. 특히 운전을 하면서 대화하려고 할 때는 상당히 짜증스럽습니다. 재채기하는 코드를 작성하고 싶지는 않을 것입니다.

이 문제를 해결하기 위해 아마도 이벤트와 콜백을 사용했을 것입니다. 다음과 같은 이벤트가 있습니다.

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // woo yey image loaded
});

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

이것은 전혀 재채기가 아닙니다. 이미지를 얻고 몇 개의 리스너를 추가하면 JavaScript는 해당 리스너 중 하나가 호출될 때까지 실행을 중지할 수 있습니다.

불행히도 위의 예에서는 이벤트를 수신 대기하기 전에 이벤트가 발생했을 수 있으므로 이미지의 "complete" 속성을 사용하여 이 문제를 해결해야 합니다.

```js
var img1 = document.querySelector('.img-1');

function loaded() {
  // woo yey image loaded
}

if (img1.complete) {
  loaded();
}
else {
  img1.addEventListener('load', loaded);
}

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

이 코드는 우리가 수신 대기할 기회를 얻기 전에 오류가 발생한 이미지를 포착하지 못합니다. 불행히도 DOM으로는 그렇게 할 수 있는 방법이 없습니다. 또한 하나의 이미지를 로드하고 있습니다. 여러 이미지가 로드되는 경우에 이를 알고 싶다면 상황이 훨씬 더 복잡해집니다.

## 이벤트가 항상 최선의 방법은 아닙니다

이벤트는 `keyup`, `touchstart` 등과 같이 동일한 객체에서 여러 번 발생할 수 있는 상황에서는 매우 좋습니다. 이러한 이벤트에서는 리스너를 연결하기 전에 발생한 상황에 크게 신경 쓰지 않습니다. 그러나 비동기 성공/실패와 관련해서는 이상적으로 다음과 같은 코드가 필요합니다.

```js
img1.callThisIfLoadedOrWhenLoaded(function() {
  // loaded
}).orIfFailedCallThis(function() {
  // failed
});

// and…
whenAllTheseHaveLoaded([img1, img2]).callThis(function() {
  // all loaded
}).orIfSomeFailedCallThis(function() {
  // one or more failed
});
```

이것이 Promise가 하는 역할이지만 명명하기가 더 좋습니다. HTML 이미지 요소에 Promise를 반환하는 "ready" 메서드가 있다면 다음과 같이 할 수 있습니다.

```js
img1.ready()
.then(function() {
  // loaded
}, function() {
  // failed
});

// and…
Promise.all([img1.ready(), img2.ready()])
.then(function() {
  // all loaded
}, function() {
  // one or more failed
});
```

가장 기본적인 Promise는 다음을 제외하고는 이벤트 리스너와 비슷합니다.

- Promise는 한 번만 성공하거나 실패할 수 있습니다. 두 번 성공하거나 실패할 수 없으며 성공에서 실패로 또는 그 반대로 전환할 수도 없습니다.
- Promise가 성공하거나 실패하고 나중에 성공/실패 콜백을 추가하면 이벤트가 더 일찍 발생했더라도 올바른 콜백이 호출됩니다.

이것은 비동기 성공/실패에 매우 유용한데, 무언가를 사용할 수 있게 된 정확한 시간보다는 결과에 반응하는 데 더 관심이 있기 때문입니다.

## Promise 용어 {: #promise-terminology }

[Domenic Denicola](https://twitter.com/domenic)가 이 기사의 첫 초안을 검토하고 용어 사용에 대해 저에게 "F" 점수를 주었습니다. 그는 나를 붙잡아두고 [States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)를 100번이나 외우라고 강요하고 제 부모님에게 우려스러운 편지를 썼습니다. 그럼에도 불구하고 여전히 많은 용어가 혼동되지만 기본 사항은 다음과 같습니다.

Promise는 다음과 같을 수 있습니다.

- **처리됨** - Promise와 관련된 작업이 성공했습니다.
- **거부됨** - Promise와 관련된 작업이 실패했습니다.
- **보류 중** - 아직 처리 또는 거부되지 않았습니다.
- **해결됨** - 처리 또는 거부되었습니다.

[사양](https://www.ecma-international.org/ecma-262/#sec-promise-objects)에서도 `then` 메서드가 있다는 점에서 Promise과 유사한 객체를 설명하기 위해 **thenable**이라는 용어를 사용합니다. 이 용어는 전 잉글랜드 축구 감독인 [Terry Venables](https://en.wikipedia.org/wiki/Terry_Venables)를 생각나게 하므로 최대한 사용을 자제하겠습니다.

## JavaScript에 Promise가 도착했습니다!

Promise는 다음과 같은 라이브러리 형태로 한동안 사용되었습니다.

- [Q](https://github.com/kriskowal/q)
- [when](https://github.com/cujojs/when)
- [WinJS](https://msdn.microsoft.com/library/windows/apps/br211867.aspx)
- [RSVP.js](https://github.com/tildeio/rsvp.js)

위의 라이브러리와 JavaScript Promise는 [Promises/A+](https://github.com/promises-aplus/promises-spec)라고 하는 표준화된 공통 동작을 공유합니다. jQuery 사용자라면 이와 유사하게 [Deferreds](https://api.jquery.com/category/deferred-object/)라는 것을 가지고 있을 것입니다. 그러나 Deferreds는 Promise/A+를 따르지 않으므로 [미묘하게 다르고 유용성이 떨어](https://thewayofcode.wordpress.com/tag/jquery-deferred-broken/)지므로 주의하세요. jQuery에도 [Promise 유형](https://api.jquery.com/Types/#Promise)이 있지만 이것은 Deferred에 포함된 요소이며 동일한 문제를 가지고 있습니다.

Promise의 구현은 표준화된 동작을 따르지만 전체 API는 다릅니다. JavaScript Promise는 API에서 RSVP.js와 유사합니다. Promise를 만드는 방법은 다음과 같습니다.

```js
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

Promise 생성자는 하나의 인수, 두 개의 매개변수가 있는 콜백(resolve 및 reject)을 사용합니다. 콜백 내에서 비동기화와 같은 작업을 수행한 다음 모든 것이 정상이면 resolve를 호출하고 그렇지 않으면 reject를 호출합니다.

구식의 일반 JavaScript에서 `throw`와 마찬가지로 Error 객체로 거부하는 것이 일반적이지만 필수는 아닙니다. Error 객체의 이점은 스택 추적을 캡처하여 디버깅 도구를 더 유용하게 만든다는 것입니다.

이 Promise를 사용하는 방법은 다음과 같습니다.

```js
promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```

`then()`은 두 개의 인수, 성공 사례를 위한 하나의 콜백과 실패 사례를 위한 또 다른 콜백을 사용합니다. 둘 모두 선택 사항이므로 성공 또는 실패 사례에 대해서만 콜백을 추가할 수 있습니다.

JavaScript Promise는 DOM에서 "Futures"로 시작했다가 "Promises"로 이름이 바뀌었고 마침내 JavaScript로 들어왔습니다. DOM이 아닌 JavaScript에서 이를 사용하는 것이 좋은데, Node.js와 같은 브라우저가 아닌 JS 컨텍스트에서 사용할 수 있기 때문입니다(코어 API에서 이를 사용하는지 여부는 또 다른 문제임).

JavaScript 기능이지만 DOM은 이를 두려움 없이 사용합니다. 실제로, 비동기 성공/실패 메서드가 있는 모든 새로운 DOM API는 Promise를 사용합니다. [Quota Management](https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html#idl-def-StorageQuota), [Font Load Events](http://dev.w3.org/csswg/css-font-loading/#font-face-set-ready), [ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/cf459d473ae09f6994e8539113d277cbd2bce939/service_worker.ts#L17), [Web MIDI](https://webaudio.github.io/web-midi-api/#widl-Navigator-requestMIDIAccess-Promise-MIDIOptions-options), [Streams](https://github.com/whatwg/streams#basereadablestream) 등에서 이미 그렇게 되고 있습니다.

## 브라우저 지원 및 폴리필

현재, 브라우저에서 이미 Promise가 구현되고 있습니다.

Chrome 32, Opera 19, Firefox 29, Safari 8 및 Microsoft Edge부터 기본적으로 Promise가 활성화됩니다.

완전한 Promise 구현이 없는 브라우저가 사양을 준수하도록 하거나 다른 브라우저와 Node.js에 Promise를 추가하려면 [polyfill](https://github.com/jakearchibald/ES6-Promises#readme)(2k gzipped)을 확인하세요.

## 다른 라이브러리와의 호환성

JavaScript Promises API는 `then()`가 있는 모든 요소를 Promise와 유사한 것으로 취급하므로(또는 Promise 영역의 표현으로 *sigh*에서 `thenable`), Q Promise를 반환하는 라이브러리를 사용하는 경우에 이는 문제가 없으며 새로운 JavaScript Promise에서 잘 작동합니다.

언급했듯이 jQuery의 Deferreds는 그다지 …도움이 되지 않습니다. 다행스럽게도 이를 표준 Promise로 캐스트할 수 있으며, 가능한 한 빨리 그렇게 하는 것이 좋습니다.

```js
var jsPromise = Promise.resolve($.ajax('/whatever.json'))
```

여기서 jQuery의 `$.ajax`는 Deferred를 반환합니다. `then()` 메서드가 있기 때문에 `Promise.resolve()`는 이를 JavaScript Promise로 변환할 수 있습니다. 그러나 때로 deferreds는 콜백에 여러 인수를 전달하는데, 예를 들면 다음과 같습니다.

```js
var jqDeferred = $.ajax('/whatever.json');

jqDeferred.then(function(response, statusText, xhrObj) {
  // ...
}, function(xhrObj, textStatus, err) {
  // ...
})
```

반면 JS Promise는 첫 번째를 제외한 모든 것을 무시합니다.

```js
jsPromise.then(function(response) {
  // ...
}, function(xhrObj) {
  // ...
})
```

다행스럽게도 이것이 일반적으로 원하는 것이거나 최소한 원하는 것에 접근할 수 있게 해줍니다. 또한 jQuery는 Error 객체를 거부로 전달하는 규칙을 따르지 않습니다.

## 복잡한 비동기 코드가 더 쉬워졌습니다

이제, 코딩을 해보겠습니다. 다음을 원한다고 가정합니다.

1. 로딩을 나타내기 위해 스피너를 시작합니다.
2. 각 챕터의 제목과 URL을 제공하는 스토리에 대해 일부 JSON을 가져옵니다.
3. 페이지에 제목을 추가합니다.
4. 각 챕터를 가져옵니다.
5. 페이지에 스토리를 추가합니다.
6. 스피너를 중지합니다.

… 그리고 도중에 문제가 발생하면 사용자에게 알립니다. 그 시점에서 스피너도 중단시켜야 할 것입니다. 그렇지 않으면 회전을 계속 보느라 현기증이 나고 다른 UI와 충돌할 것입니다.

물론 [HTML 역할을 하는 것이 더 빠르기 때문에](https://jakearchibald.com/2013/progressive-enhancement-is-faster/) 스토리를 전달하기 위해 JavaScript를 사용하지 않을 것입니다. 그러나 이 패턴은 API를 다룰 때 꽤 일반적입니다. 즉, 여러 데이터를 가져온 다음 모두 끝나면 특정 작업을 수행합니다.

먼저 네트워크에서 데이터 가져오기를 처리해 보겠습니다.

## XMLHttpRequest의 Promise 처리

이전 API는 이전 버전과 호환되는 방식으로 가능한 경우 Promise를 사용하도록 업데이트됩니다. `XMLHttpRequest`가 주요 후보지만 그 동안 GET 요청을 만드는 간단한 함수를 작성해 보겠습니다.

```js
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}
```

이제 사용해보겠습니다.

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
})
```

이제 `XMLHttpRequest`를 수동으로 입력하지 않고 HTTP 요청을 수행할 수 있습니다. 단어들이 붙어 있어 짜증을 일으키는 `XMLHttpRequest`를 덜 볼수록 삶은 더 행복해집니다.

## 체인 연결

`then()`이 이야기의 끝이 아니므로 `then`을 함께 연결하여 값을 변환하거나 추가 비동기 작업을 차례로 실행할 수 있습니다.

### 값 변환

단순히 새 값을 반환하여 값을 변환할 수 있습니다.

```js
var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
})
```

실용적인 예를 위해 다음으로 돌아가 보겠습니다.

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
})
```

응답은 JSON이지만 현재 일반 텍스트로 받고 있습니다. JSON [`responseType`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest#responseType)을 사용하도록 get 함수를 변경할 수 있지만 Promise 영역에서도 이를 해결할 수 있습니다.

```js
get('story.json').then(function(response) {
  return JSON.parse(response);
}).then(function(response) {
  console.log("Yey JSON!", response);
})
```

`JSON.parse()`는 단일 인수를 취하고 변환된 값을 반환하므로 바로가기를 만들 수 있습니다.

```js
get('story.json').then(JSON.parse).then(function(response) {
  console.log("Yey JSON!", response);
})
```

실제로 `getJSON()` 함수를 정말 쉽게 만들 수 있습니다.

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

`getJSON()`은 여전히 URL을 가져온 다음 응답을 JSON으로 구문 분석하는 Promise를 반환합니다.

### 비동기 작업 대기열

`then`을 연결하여 비동기 작업을 순차적으로 실행할 수도 있습니다.

`then()` 콜백에서 무언가를 반환하는 것은 약간의 마법과 같습니다. 값을 반환하면 다음 `then()`이 해당 값으로 호출됩니다. 그러나 Promise와 같은 것을 반환하면 다음 `then()`가 여기에 대기하며 해당 Promise가 (성공/실패)를 처리할 때만 호출됩니다. 예를 들면 다음과 같습니다.

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  console.log("Got chapter 1!", chapter1);
})
```

여기서는 `story.json`에 대해 요청할 일단의 URL을 제공하는 비동기 요청을 만들고 그 중 첫 번째를 요청합니다. 바로 이 때 Promise가 단순한 콜백 패턴에서 두드러지기 시작합니다.

챕터를 가져오는 바로가기 메서드를 만들 수도 있습니다.

```js
var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  })
}

// and using it is simple:
getChapter(0).then(function(chapter) {
  console.log(chapter);
  return getChapter(1);
}).then(function(chapter) {
  console.log(chapter);
})
```

`getChapter`가 호출될 때까지 `story.json`을 다운로드하지 않지만 다음 번에 `getChapter`가 호출될 때 스토리 Promise를 재사용하여 `story.json`이 한 번만 가져와지도록 합니다.  이게 바로 Promise죠!

## 오류 처리

앞서 보았듯이 `then()`은 성공에 대한 인수와 실패에 대한 인수(또는 Promise 영역의 표현으로 처리 및 거부)의 두 가지 인수를 취합니다.

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
})
```

`catch()`를 사용할 수도 있습니다.

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
})
```

`catch()`에는 특별한 것이 없으며 `then(undefined, func)`에 대한 장식 정도이지만 더 읽기 쉽습니다. 위의 두 코드 예제는 동일하게 동작하지 않습니다. 후자는 다음과 동일합니다.

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).then(undefined, function(error) {
  console.log("Failed!", error);
})
```

그 차이는 미묘하지만 대단히 유용합니다. Promise 거부는 거부 콜백(또는 동등하므로 `catch()`)을 사용하여 다음 `then()`으로 건너뜁니다. `then(func1, func2)`를 사용하면 `func1` 또는 `func2`가 호출되고 둘 모두 호출되지 않습니다. 그러나 `then(func1).catch(func2)`를 사용하면 `func1`이 거부되는 경우에 둘 모두 호출되는데, 체인에서 개별적인 단계이기 때문입니다. 다음을 수행하세요.

```js
asyncThing1().then(function() {
  return asyncThing2();
}).then(function() {
  return asyncThing3();
}).catch(function(err) {
  return asyncRecovery1();
}).then(function() {
  return asyncThing4();
}, function(err) {
  return asyncRecovery2();
}).catch(function(err) {
  console.log("Don't worry about it");
}).then(function() {
  console.log("All done!");
})
```

위의 흐름은 일반 JavaScript try/catch와 매우 유사하며 "try" 내에서 발생하는 오류는 즉시 `catch()` 블록으로 이동합니다. 다음은 위의 순서도입니다(저는 순서도를 좋아합니다).

<div style="position: relative; padding-top: 93%;">
  <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden"
   src="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/simQvoUExWisIW0XxToH.svg" | imgix }}" frameborder="0" allowtransparency="true"></iframe>
</div>

처리되는 Promise의 경우 파란색 선을 따르고, 거부되는 Promise의 경우 빨간색 선을 따릅니다.

### JavaScript 예외 및 Promise

거부는 Promise가 명시적으로 거부될 때 발생하지만 생성자 콜백에서 오류가 발생하는 경우에도 암시적으로 발생합니다.

```js
var jsonPromise = new Promise(function(resolve, reject) {
  // JSON.parse throws an error if you feed it some
  // invalid JSON, so this implicitly rejects:
  resolve(JSON.parse("This ain't JSON"));
});

jsonPromise.then(function(data) {
  // This never happens:
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

이것은 Promise 생성자 콜백 내에서 모든 Promise 관련 작업을 수행하는 것이 유용하다는 것을 의미합니다. 오류가 자동으로 포착되어 거부되니까요.

`then()` 콜백에서 발생한 오류도 마찬가지입니다.

```js
get('/').then(JSON.parse).then(function() {
  // This never happens, '/' is an HTML page, not JSON
  // so JSON.parse throws
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

### 실제 오류 처리

스토리와 챕터에서 catch를 사용하여 사용자에게 오류를 표시할 수 있습니다.

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Failed to show chapter");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

`story.chapterUrls[0]` 가져오기가 실패하면(예: http 500 또는 사용자가 오프라인 상태임) 응답을 JSON으로 구문 분석하려고 시도하는 `getJSON()`의 콜백을 포함하여 이어지는 모든 성공 콜백을 건너뛰고 페이지에 chapter1.html을 추가하는 콜백도 건너뜁니다. 결과적으로 이전 작업 중 하나라도 실패하면 "챕터 표시 실패"가 페이지에 추가됩니다.

JavaScript의 try/catch와 마찬가지로 오류가 포착되고 후속 코드가 계속되므로 스피너가 항상 숨겨지게 되는데, 이것이 우리가 원하는 것입니다. 위의 내용은 다음의 비차단 비동기 버전이 됩니다.

```js
try {
  var story = getJSONSync('story.json');
  var chapter1 = getJSONSync(story.chapterUrls[0]);
  addHtmlToPage(chapter1.html);
}
catch (e) {
  addTextToPage("Failed to show chapter");
}
document.querySelector('.spinner').style.display = 'none'
```

오류로부터 복구하지 않고 단순히 로깅 목적으로 `catch()`를 원할 수 있습니다. 이렇게 하려면 오류를 다시 발생시키세요. `getJSON()` 메서드에서 그렇게 할 수 있습니다:

```js
function getJSON(url) {
  return get(url).then(JSON.parse).catch(function(err) {
    console.log("getJSON failed for", url, err);
    throw err;
  });
}
```

그래서 한 챕터를 가져올 수 있었지만 우리는 모든 것을 원합니다. 그렇게 해보겠습니다.

## 병렬 처리 및 시퀀싱: 두 가지 장점을 모두 활용

비동기를 생각하는 것은 쉽지 않습니다. 원하는 대로 잘 되지 않으면 코드가 동기식인 것처럼 작성해 보세요. 이 경우 다음과 같습니다.

```js
try {
  var story = getJSONSync('story.json');
  addHtmlToPage(story.heading);

  story.chapterUrls.forEach(function(chapterUrl) {
    var chapter = getJSONSync(chapterUrl);
    addHtmlToPage(chapter.html);
  });

  addTextToPage("All done");
}
catch (err) {
  addTextToPage("Argh, broken: " + err.message);
}

document.querySelector('.spinner').style.display = 'none'
```

{% Glitch { id: 'promises-sync-example', height: 480 } %}

제대로 작동합니다! 그러나 이것은 동기식이며 다운로드되는 동안 브라우저가 잠깁니다. 이 작업을 비동기식으로 만들기 위해 `then()`을 사용하여 작업이 차례로 일어나게 합니다.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // TODO: for each url in story.chapterUrls, fetch & display
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

그러나 챕터 URL을 반복하고 순서대로 가져오려면 어떻게 할 수 있을까요? 이것은 **작동하지 않습니다**:

```js
story.chapterUrls.forEach(function(chapterUrl) {
  // Fetch chapter
  getJSON(chapterUrl).then(function(chapter) {
    // and add it to the page
    addHtmlToPage(chapter.html);
  });
})
```

`forEach`는 비동기를 인식하지 않으므로 어떤 순서로든 다운로드되는 순서로 챕터가 표시됩니다. 이것이 기본적으로 Pulp Fiction이 작성된 방식이지만 여기서는 Pulp Fiction이 아니므로 수정하겠습니다.

### 시퀀스 만들기

`chapterUrls` 배열을 Promise의 시퀀스로 바꾸려는 것이 우리가 하려는 것입니다. 이를 위해 `then()`을 사용할 수 있습니다.

```js
// Start off with a promise that always resolves
var sequence = Promise.resolve();

// Loop through our chapter urls
story.chapterUrls.forEach(function(chapterUrl) {
  // Add these actions to the end of the sequence
  sequence = sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
})
```

`Promise.resolve()`를 본 것은 이번이 처음입니다. 이것은 사용자가 제공하는 어떤 값이든 확인하는 Promise를 생성합니다. 여기에 `Promise`의 인스턴스를 전달하면 간단히 반환됩니다(**참고:** 이것은 일부 구현이 아직 따르지 않는 사양의 변경 사항입니다). Promise와 같은 것에 이를 전달하면(`then()` 메서드가 있음) 동일한 방식으로 처리/거부되는 실제 `Promise`가 만들어집니다. 다른 값(예: `Promise.resolve('Hello')`)을 전달하면 해당 값으로 처리되는 Promise가 생성됩니다. 위와 같이 값 없이 호출하면 "undefined"로 처리됩니다.

`Promise.reject(val)`도 있는데, 이는 사용자가 제공하는(또는 정의되지 않은) 값으로 거부되는 Promise를 생성합니다.

[`array.reduce`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)를 사용하여 위의 코드를 정리할 수 있습니다.

```js
// Loop through our chapter urls
story.chapterUrls.reduce(function(sequence, chapterUrl) {
  // Add these actions to the end of the sequence
  return sequence.then(function() {
    return getJSON(chapterUrl);
  }).then(function(chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve())
```

이것은 이전 예제와 동일하지만 별도의 "sequence" 변수가 필요하지 않습니다. 우리의 reduce 콜백은 배열의 각 항목에 대해 호출됩니다. "sequence"는 처음에는 `Promise.resolve()`이지만 나머지 호출에 대해서는 "sequence"가 이전 호출에서 반환된 내용이 됩니다. `array.reduce`는 배열을 단일 값으로 낮추는 데 정말 유용하며, 이 경우에는 이것이 Promise입니다.

모두 하나로 정리해 보겠습니다.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  return story.chapterUrls.reduce(function(sequence, chapterUrl) {
    // Once the last chapter's promise is done…
    return sequence.then(function() {
      // …fetch the next chapter
      return getJSON(chapterUrl);
    }).then(function(chapter) {
      // and add it to the page
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  // And we're all done!
  addTextToPage("All done");
}).catch(function(err) {
  // Catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  // Always hide the spinner
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-example', height: 480 } %}

여기에 동기화 버전의 완전히 비동기화된 버전이 있습니다. 하지만 우리는 더 잘할 수 있습니다. 현재 페이지가 다음과 같이 다운로드되고 있습니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise1.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

브라우저는 한 번에 여러 항목을 다운로드하는 데 능숙하므로 챕터를 차례로 다운로드하면 성능이 저하됩니다. 우리가 원하는 것은 모두 동시에 다운로드한 다음 모두 완료되면 처리하는 것입니다. 다행스럽게도 이를 위한 API가 있습니다.

```js
Promise.all(arrayOfPromises).then(function(arrayOfResults) {
  //...
})
```

`Promise.all`은 Promise의 배열을 취하고 모두 성공적으로 완료될 때 처리하는 Promise를 생성합니다. 전달한 Promise와 동일한 순서로 결과 배열(Promise가 처리되는 대상에 상관없이)을 얻습니다.

```js
getJSON('story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Take an array of promises and wait on them all
  return Promise.all(
    // Map our array of chapter urls to
    // an array of chapter json promises
    story.chapterUrls.map(getJSON)
  );
}).then(function(chapters) {
  // Now we have the chapters jsons in order! Loop through…
  chapters.forEach(function(chapter) {
    // …and add to the page
    addHtmlToPage(chapter.html);
  });
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened so far
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-all-example', height: 480 } %}

연결에 따라 하나씩 로드하는 것보다 몇 초 더 빠를 수 있으며 첫 번째 시도보다 코드가 적습니다. 챕터는 어떤 순서로든 다운로드할 수 있지만 올바른 순서로 화면에 나타납니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise2.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

그러나 여전히 인지된 성능을 향상시킬 수 있습니다. 챕터 1이 도착하면 이를 페이지에 추가해야 합니다. 이렇게 하면 나머지 챕터가 도착하기 전에 사용자가 읽기를 시작할 수 있습니다. 챕터 3이 도착하면 이를 페이지에 추가하지 않습니다. 왜냐하면 사용자가 챕터 2가 누락된 것을 인식하지 못할 수도 있기 때문입니다. 챕터 2가 도착하면 챕터 2와 3을 추가하는 식으로 진행할 수 있습니다.

이를 위해 동시에 모든 챕터에 대한 JSON을 가져온 다음 문서에 추가할 시퀀스를 생성합니다.

```js
getJSON('story.json')
.then(function(story) {
  addHtmlToPage(story.heading);

  // Map our array of chapter urls to
  // an array of chapter json promises.
  // This makes sure they all download in parallel.
  return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
      // Use reduce to chain the promises together,
      // adding content to the page for each chapter
      return sequence
      .then(function() {
        // Wait for everything in the sequence so far,
        // then wait for this chapter to arrive.
        return chapterPromise;
      }).then(function(chapter) {
        addHtmlToPage(chapter.html);
      });
    }, Promise.resolve());
}).then(function() {
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
})
```

{% Glitch { id: 'promises-async-best-example', height: 480 } %}

이렇게 우리는 두 가지의 장점을 모두 얻었습니다! 모든 콘텐츠를 전달하는 데 동일한 시간이 걸리지만 사용자는 첫 번째 콘텐츠를 더 빨리 받습니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/promises/promise3.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

이 간단한 예에서는 모든 챕터가 거의 같은 시간에 도착하지만 한 번에 하나씩 표시할 때의 이점은 더 많고 더 큰 챕터에서 커집니다.

[Node.js 스타일 콜백이나 이벤트](https://gist.github.com/jakearchibald/0e652d95c07442f205ce)로 위의 작업을 수행하면 코드가 약 두 배가 되지만 더 중요한 것은 따라하기가 쉽지 않다는 것입니다. 그러나 이것이 Promise에 대한 이야기의 끝이 아닙니다. 다른 ES6 기능과 결합될 때 훨씬 더 쉬워집니다.

## 보너스 라운드: 확장된 기능

이 글을 처음 작성한 이후로 Promise의 활용 가능성이 크게 확장되었습니다. Chrome 55 이후로 비동기 함수는 Promise 기반 코드가 동기적인 것처럼 작성될 수 있게 해주면서도 메인 스레드를 차단하지 않습니다. 이에 대한 자세한 내용은 [제가 작성한 비동기 함수 문서](/async-functions)를 참조하세요. 주요 브라우저에서 Promise 및 비동기 함수 모두가 광범위하게 지원됩니다. 자세한 내용은 MDN의 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) 및 [비동기 함수](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function) 참조에서 찾을 수 있습니다.

이 글을 교정하고 수정/추천을 해주신 Anne van Kesteren, Domenic Denicola, Tom Ashworth, Remy Sharp, Addy Osmani, Arthur Evans, Yutaka Hirano에게 깊은 감사를 드립니다.

또한 기사의 [여러 부분](https://github.com/html5rocks/www.html5rocks.com/pull/921/files)을 [업데이트해주신 Mathias Bynens](https://mathiasbynens.be/)에게도 감사드립니다.
