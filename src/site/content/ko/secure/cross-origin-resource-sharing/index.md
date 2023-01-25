---
layout: post
title: 교차 출처 리소스 공유(CORS)
subhead: 교차 출처 리소스를 안전하게 공유
authors:
  - kosamari
date: 2018-11-05
description: 브라우저의 동일 출처 정책은 다른 출처에서 리소스를 읽는 것을 차단합니다. 이 메커니즘은 악의적인 사이트가 다른 사이트의 데이터를 읽는 것을 방지하지만 합법적인 사용도 방지합니다. 다른 나라의 날씨 데이터를 얻고 싶다면 어떨까요? CORS를 활성화하면 서버가 브라우저에 추가 출처를 사용할 수 있음을 알릴 수 있습니다.
tags:
  - security
---

브라우저의 동일 출처 정책은 다른 출처에서 리소스를 읽는 것을 차단합니다. 이 메커니즘은 악의적인 사이트가 다른 사이트의 데이터를 읽는 것을 방지하지만 합법적인 사용도 방지합니다. 다른 나라의 날씨 데이터를 얻고 싶다면 어떨까요?

최신 웹 애플리케이션에서 애플리케이션은 종종 다른 출처에서 리소스를 가져오려고 합니다. 예를 들어 다른 도메인에서 JSON 데이터를 검색하거나 다른 사이트에서 `<canvas>` 요소로 이미지를 로드하려고 할 수 있습니다.

즉, 누구나 읽을 수 있어야 하는 **공개 리소스**가 있지만 동일 출처 정책이 이를 차단합니다. 개발자는 [JSONP](https://stackoverflow.com/questions/2067472/what-is-jsonp-all-about)과 같은 해결 방법을 사용하고 있지만 **교차 출처 리소스 공유(CORS)**는 이 문제를 표준화된 방식으로 해결합니다.

**CORS**를 활성화하면 서버가 브라우저에 추가 출처를 사용할 수 있음을 알릴 수 있습니다.

## 리소스 요청은 웹에서 어떻게 작동합니까?

<figure data-float="right">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8J6A0Bk5YXdvyoj8HVzs.png", alt="요청 및 응답", width="668", height="327" %}   <figcaption>     그림: 클라이언트 요청과 서버 응답의 예시   </figcaption></figure>

브라우저와 서버는 **Hypertext Transfer Protocol**(HTTP)를 사용하여 네트워크를 통해 데이터를 교환할 수 있습니다. HTTP는 리소스를 가져오는 데 필요한 정보를 포함하여 요청자와 응답자 간의 통신 규칙을 정의합니다.

HTTP 헤더는 클라이언트와 서버 간의 메시지 교환 유형을 협상하는 데 사용되며 액세스를 결정하는 데 사용됩니다. 브라우저의 요청과 서버의 응답 메시지는 모두 **헤더**와 **본문**의 두 부분으로 나뉩니다.

### 헤더

메시지 유형 또는 메시지 인코딩과 같은 메시지에 대한 정보입니다. 헤더에는 키-값 쌍으로 표현되는 [다양한 정보](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)가 포함될 수 있습니다. 요청 헤더와 응답 헤더에는 서로 다른 정보가 포함되어 있습니다.

{% Aside %} 헤더에는 주석이 포함될 수 없습니다. {% endAside %}

**샘플 요청 헤더**

```text
Accept: text/html
Cookie: Version=1
```

위의 내용은 "응답으로 HTML을 수신하고 싶습니다. 여기에 내가 사용하는 쿠키가 있습니다."라고 말하는 것과 같습니다.

**샘플 응답 헤더**

```text
Content-Encoding: gzip
Cache-Control: no-store
```

위의 내용은 "데이터가 gzip으로 인코딩되었습니다. 캐시하지 마십시오."라고 말하는 것과 같습니다.

### 본문

메시지 자체입니다. 이것은 일반 텍스트, 이미지 바이너리, JSON, HTML 등이 될 수 있습니다.

## CORS는 어떻게 작동합니까?

동일 출처 정책은 브라우저에 교차 출처 요청을 차단하도록 지시합니다. 다른 출처에서 공개 리소스를 얻으려면 리소스 제공 서버가 브라우저에 "요청이 들어오는 이 출처가 내 리소스에 액세스할 수 있습니다"라고 알려야 합니다. 브라우저는 이를 기억하고 교차 출처 리소스 공유를 허용합니다.

### 1단계: 클라이언트(브라우저) 요청

브라우저가 교차 출처 요청을 할 때 브라우저는 현재 출처(scheme, host, port)와 함께 `Origin` 헤더를 추가합니다.

### 2단계: 서버 응답

서버 측에서 서버가 이 헤더를 보고 액세스를 허용하려면 요청한 출처를 지정하는 응답에 `Access-Control-Allow-Origin` 헤더를 추가해야 합니다(또는 모든 출처를 허용하려면 `*`).

### 3단계: 브라우저에서 응답 수신

브라우저가 해당 `Access-Control-Allow-Origin` 헤더와 함께 이 응답을 볼 때 브라우저는 응답 데이터가 클라이언트 사이트와 공유되도록 허용합니다.

## 실제 CORS 작동 보기

다음은 Express를 사용하는 작은 웹 서버입니다.

{% Glitch { id: 'cors-demo', path: 'server.js', height: 480 } %}

첫 번째 끝점(라인 8)에는 응답 헤더 세트가 없으며 단순히 응답으로 파일을 보냅니다.

{% Instruction 'devtools' %} {% Instruction 'devtools-console', 'ul' %}

- 다음 명령을 시도합니다.

```js
fetch('https://cors-demo.glitch.me/', {mode:'cors'})
```

다음과 같은 오류가 표시됩니다.

```bash
request has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource.
```

두 번째 끝점(라인 13)은 응답으로 동일한 파일을 보내지만 헤더에 `Access-Control-Allow-Origin: *`를 추가합니다. 콘솔에서 다음을 시도합니다.

```js
fetch('https://cors-demo.glitch.me/allow-cors', {mode:'cors'})
```

이번에는 요청이 차단되지 않습니다.

## CORS와 자격 증명 공유

개인 정보 보호를 위해 CORS는 일반적으로 요청이 요청자를 식별하지 못하는 "익명 요청"에 사용됩니다. CORS(발신자를 식별할 수 있음)를 사용할 때 쿠키를 보내려면 요청과 응답에 추가 헤더를 덧붙여야 합니다.

### 요청

아래와 같이 가져오기 옵션에 `credentials: 'include'`를 추가합니다. 여기에는 요청과 함께 쿠키가 포함됩니다.

```js
fetch('https://example.com', {
  mode: 'cors',
  credentials: 'include'
})
```

### 응답

`Access-Control-Allow-Origin`은 특정 출처로 설정되어야 하며(`*`를 사용하는 와일드 카드 없음) `Access-Control-Allow-Credentials`를 `true`로 설정해야 합니다.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

## 복잡한 HTTP 호출에 대한 실행 전 요청

웹 앱에 복잡한 HTTP 요청이 필요한 경우 브라우저는 요청 체인의 앞에 **[실행 전 요청](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests)**을 추가합니다.

CORS 사양은 **복잡한 요청**을 다음과 같이 정의합니다.

- GET, POST 또는 HEAD 이외의 메서드를 사용하는 요청
- `Accept`, `Accept-Language` 또는 `Content-Language` 이외의 헤더를 포함하는 요청
- `application/x-www-form-urlencoded`, `multipart/form-data` 또는 `text/plain` 이외에 `Content-Type` 헤더가 있는 요청

브라우저는 필요한 경우 실행 전 요청을 생성합니다. 이는 아래와 같은 `OPTIONS` 요청으로, 실제 요청 메시지보다 먼저 전송됩니다.

```text
OPTIONS /data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: DELETE
```

서버 측에서 애플리케이션은 이 출처에서 애플리케이션이 수락하는 메서드에 대한 정보로 실행 전 요청에 응답해야 합니다.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS
```

서버 응답에는 실행 전 결과를 캐시하는 지속 시간(초)을 지정하기 위한 `Access-Control-Max-Age` 헤더도 포함될 수 있으므로 클라이언트가 복잡한 요청을 보낼 때마다 실행 전 요청을 할 필요가 없습니다.
