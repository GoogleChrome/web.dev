---
layou: post
title: 'Cache API: 빠른 가이드'
subhead: Cache API를 사용하여 애플리케이션 데이터를 오프라인에서 사용할 수 있도록 하는 방법을 알아보세요.
authors:
  - petelepage
description: Cache API를 사용하여 애플리케이션 데이터를 오프라인에서 사용할 수 있도록 하는 방법을 알아보세요.
date: 2017-10-03
updated: 2020-04-27
tags:
  - blog
  - progressive-web-apps
feedback:
  - api
---

[Cache API](https://developer.mozilla.org/docs/Web/API/Cache)는 네트워크 요청 및 해당 응답을 저장하고 검색하는 시스템입니다. 이는 애플리케이션을 실행하는 과정에서 생성되는 일반 요청 및 응답일 수도 있고, 나중에 사용하기 위한 데이터를 저장하는 목적으로만 생성될 수도 있습니다.

Cache API는 서비스 워커가 네트워크 요청을 캐시할 수 있도록 하여 네트워크 속도나 가용성과 관계없이 빠른 응답을 제공할 수 있도록 만들어졌습니다. 그러나 API는 일반적인 저장 메커니즘으로도 사용할 수 있습니다.

## 어디에서 사용할 수 있나요?

[Cache API는 모든 최신 브라우저](https://caniuse.com/#feat=mdn-api_cache) 에서 사용할 수 있습니다. 글로벌 `caches` 속성을 통해 노출되므로 간단한 기능 감지로 API의 존재 여부를 테스트할 수 있습니다.

```js
const cacheAvailable = 'caches' in self;
```

Cache API는 창, 아이프레임, 워커 또는 서비스 워커에서 액세스할 수 있습니다.

## 저장할 수 있는 것

캐시는 각각 HTTP 요청 및 응답을 나타내는 [`Request`](https://developer.mozilla.org/docs/Web/API/Request) 및 [`Response`](https://developer.mozilla.org/docs/Web/API/Response) 개체 쌍만 저장합니다. 그러나 요청 및 응답에는 HTTP를 통해 전송할 수 있는 모든 종류의 데이터가 포함될 수 있습니다.

### 얼마나 저장할 수 있나요?

간단히 말해서, **많이 저장할 수 있으며** 적어도 수백 MB, 경우에 따라 수 GB 이상까지도 될 수 있습니다. 브라우저 구현은 다를 수 있지만 사용 가능한 저장 공간의 양은 일반적으로 장치에서 사용 가능한 저장 공간의 양에 따라 결정됩니다.

## 캐시 생성 및 열기

캐시를 열려면 `caches.open(name)` 메서드를 사용하여 캐시 이름을 단일 매개변수로 전달합니다. 명명된 캐시가 없으면 생성됩니다. 이 메서드는 `Cache` 개체로 처리되는 `Promise`를 반환합니다.

```js
const cache = await caches.open('my-cache');
// 캐시로 뭔가를 합니다...
```

## 캐시에 추가

캐시에 항목을 추가하는 세 가지 방법인 `add` , `addAll` 및 `put`이 있습니다. 세 가지 방법 모두 `Promise`로 반환합니다.

### `cache.add`

첫째로, `cache.add()`가 있습니다. `Request` 또는 URL( `string` ) 중 하나의 매개변수를 사용합니다. 네트워크에 요청하고 응답을 캐시에 저장합니다. 가져오기에 실패하거나 응답의 상태 코드가 200번대가 아니면 아무것도 저장되지 않고 `Promise`는 거부됩니다. CORS 모드가 아닌 교차 출처 요청은 `status`를 `0`으로 반환하기 때문에 저장할 수 없다는 점을 참고해 주세요. 그러한 요청은 `put`으로만 저장할 수 있습니다.

```js
// 서버에서 data.json을 검색하고 응답을 저장합니다.
cache.add(new Request('/data.json'));

// 서버에서 data.json을 검색하고 응답을 저장합니다.
cache.add('/data.json');
```

### `cache.addAll`

다음으로 `cache.addAll()`이 있습니다. `add()`와 유사하게 작동하지만, `Request` 객체 또는 URL( `string`s)의 배열을 사용합니다. 이는 단일 요청이 캐시에 저장되지 않은 경우 `Promise`에서 거부된다는 점을 제외하고 각 개별 요청에 대해 `cache.add` 를 호출하는 것과 유사하게 작동합니다.

```js
const urls = ['/weather/today.json', '/weather/tomorrow.json'];
cache.addAll(urls);
```

이러한 각 경우에 새 항목은 일치하는 기존 항목을 덮어씁니다. 이는 [검색](#retrieving) 섹션에서 설명한 것과 동일한 일치 규칙을 사용합니다.

### `cache.put`

마지막으로, 네트워크로부터의 응답을 저장하거나 자신의 `Response`를 생성 및 저장할 수 있는 `cache.put()`이 있습니다. 두 개의 매개변수를 사용합니다. 첫 번째는 `Request` 객체 또는 URL( `string`)일 수 있습니다. 두 번째는 네트워크 또는 코드에서 생성된 `Response`여야 합니다.

```js
// 서버에서 data.json을 검색하고 응답을 저장합니다.
cache.put('/data.json');

// test.json에 데힌 항목을 생성하고 새로 생성된 응답을 저장합니다.
cache.put('/test.json', new Response('{"foo": "bar"}'));

// 제3자 사이트에서 data.json을 검색하고 응답을 저장합니다.
cache.put('https://example.com/data.json');
```

`put()` 메서드는 `add()` 또는 `addAll()` 보다 더 유연하며 CORS가 아닌 응답이나 응답의 상태 코드가 200번대에 있지 않은 다른 응답을 저장할 수 있습니다. 이는 동일한 요청에 대한 이전 응답을 덮어씁니다.

#### 요청 객체 생성

저장 중인 것의 URL을 사용하여 `Request` 객체를 생성합니다.

```js
const request = new Request('/my-data-store/item-id');
```

#### Response 개체 작업

`Response` `Blob` , `ArrayBuffer` , `FormData` 개체 및 문자열을 비롯한 다양한 유형의 데이터를 허용합니다.

```js
const imageBlob = new Blob([data], {type: 'image/jpeg'});
const imageResponse = new Response(imageBlob);
const stringResponse = new Response('Hello world');
```

적절한 헤더를 설정하여 `Response`의 MIME 유형을 설정할 수 있습니다.

```js
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const jsonResponse = new Response('{}', options);
```

`Response` 을 검색하여 본문에 액세스하려는 경우 사용할 수 있는 몇 가지 도우미 메서드가 있습니다. 각각은 다른 유형의 값으로 처리하는 `Promise`를 반환합니다.

<table>
  <thead>
    <th>메서드</th>
    <th>설명</th>
  </thead>
  <tbody>
    <tr>
      <td><code>arrayBuffer</code></td>
      <td>바이트로 직렬화된 본문을 포함하는<code>ArrayBuffer</code>를 반환합니다.</td>
    </tr>
    <tr>
      <td><code>blob</code></td>
      <td>
<code>Blob</code>을 반환합니다. <code>Response</code>가 <code>Blob</code>으로 생성된 경우 새 <code>Blob</code>은 유형이 동일합니다. 그 외에는 <code>Response</code>의<code>Content-Type</code>이 사용됩니다.</td>
    </tr>
    <tr>
      <td><code>text</code></td>
      <td>본문의 바이트를 UTF-8로 인코딩된 문자열로 해석합니다.</td>
    </tr>
    <tr>
      <td><code>json</code></td>
      <td>본문의 바이트를 UTF-8로 인코딩된 문자열로 해석한 다음 JSON으로 구문 분석을 시도합니다. 결과 개체를 반환하거나 문자열을 JSON으로 구문 분석할 수 없는 경우 <code>TypeError</code>가 발생합니다.</td>
    </tr>
    <tr>
      <td><code>formData</code></td>
      <td>         Interprets the bytes of the body as an HTML form, encoded either as         <code>multipart/form-data</code> or         <code>application/x-www-form-urlencoded</code>. Returns a         <a href="https://developer.mozilla.org/docs/Web/API/FormData">FormData</a>         object, or throws a <code>TypeError</code> if the data cannot be parsed.</td>
    </tr>
    <tr>
      <td><code>body</code></td>
      <td>         Returns a <a href="https://developer.mozilla.org/docs/Web/API/ReadableStream">ReadableStream</a>         for the body data.</td>
    </tr>
  </tbody>
</table>

예시

```js
const response = new Response('Hello world');
const buffer = await response.arrayBuffer();
console.log(new Uint8Array(buffer));
// Uint8Array(11) [72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
```

## 캐시에서 검색 {: #retrieving }

캐시에서 항목을 찾으려면 `match` 메서드를 사용할 수 있습니다.

```js
const response = await cache.match(request);
console.log(request, response);
```

`request`가 문자열인 경우 브라우저는 `new Request(request)`를 호출하여 이를 `Request`로 변환합니다. 이 함수는 일치하는 항목이 발견되면 `Response`를 처리하는 `Promise`를 반환하거나 그렇지 않으면 `undefined`를 반환합니다.

두 `Request`가 일치하는지 확인하기 위해 브라우저는 URL만 사용하지 않습니다. 쿼리 문자열, `Vary` 헤더 또는 HTTP 메서드(`GET`, `POST` , `PUT` 등)가 다른 두 요청은 서로 다른 것으로 간주됩니다.

옵션 객체를 두 번째 매개변수로 전달하여 이러한 사항 중 일부 또는 전부를 무시할 수 있습니다.

```js
const options = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true
};

const response = await cache.match(request, options);
// 응답으로 뭔가를 합니다.
```

캐시된 요청이 두 개 이상 일치하면 먼저 생성된 요청이 반환됩니다. *모두* 일치하는 응답을 검색하려고 하는 경우 `cache.matchAll()`을 사용할 수 있습니다.

```js
const options = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true
};

const responses = await cache.matchAll(request, options);
console.log(`There are ${responses.length} matching responses.`);
```

각 캐시에 대해 `cache.match()`를 호출하는 대신`caches.match()`를 사용하여 단축키로 모든 캐시를 한 번에 검색할 수 있습니다.

## 검색

Cache API는 `Response` 개체에 대해 일치하는 항목을 제외하고 요청이나 응답을 검색하는 방법을 제공하지 않습니다. 그러나 필터링을 사용하거나 인덱스를 생성하여 맞춤 검색을 구현할 수 있습니다.

### 필터링

맞춤 검색을 구현하는 한 가지 방법은 모든 항목을 반복하고 원하는 항목으로 필터링하는 것입니다. URL이 `.png`로 끝나는 모든 항목을 찾고 싶다고 가정해 봅시다.

```js
async function findImages() {
  // 이 원본으로부터 모든 캐시의 리스트를 가져옵니다.
  const cacheNames = await caches.keys();
  const result = [];

  for (const name of cacheNames) {
    // 캐시를 엽니다.
    const cache = await caches.open(name);

    // 항목의 리스트를 얻습니다. 각 항목은 Request 객체입니다.
    for (const request of await cache.keys()) {
      // 요청 URL이 일치하면, 결과에 응답을 추가합니다.
      if (request.url.endsWith('.png')) {
        result.push(await cache.match(request));
      }
    }
  }

  return result;
}
```

이 방법으로 `Request` 및 `Response` 개체의 속성을 사용하여 항목을 필터링할 수 있습니다. 대규모 데이터 집합을 검색하는 경우 속도가 느립니다.

### 인덱스 생성

맞춤 검색을 구현하는 다른 방법은 검색할 수 있는 항목의 별도 인덱스를 유지하고 인덱스를 IndexedDB에 저장하는 것입니다. IndexedDB는 이러한 작업을 위해 설계되었기 때문에 항목이 많을수록 성능이 훨씬 좋습니다.

`Request`의 URL을 검색 가능한 속성과 함께 저장하면 검색 후 올바른 캐시 항목을 쉽게 검색할 수 있습니다.

## 항목 삭제

캐시에서 항목을 삭제하려면:

```js
cache.delete(request);
```

여기서 요청은 `Request` 또는 URL 문자열일 수 있습니다. 이 메서드는 또한 동일한 URL에 대한 여러`Request`/`Response` 쌍을 삭제할 수 있도록 하는 `cache.match`으로 동일한 옵션 객체를 사용합니다.

```js
cache.delete('/example/file.txt', {ignoreVary: true, ignoreSearch: true});
```

## 캐시 삭제

캐시를 삭제하려면 `caches.delete(name)`를 호출하세요. 이 함수는 캐시가 존재했거나 삭제된 경우 `true`, 그렇지 않은 경우 `false`로 처리되는 `Promise`를 반환합니다.

## 감사합니다

WebFundamentals에 처음 발행된 이 기사의 원본 버전을 작성한 Mat Scales에게 감사드립니다.
