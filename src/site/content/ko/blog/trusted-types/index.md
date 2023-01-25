---
title: 신뢰할 수 있는 유형으로 DOM 기반 교차 사이트 스크립팅 취약점 방지
subhead: 애플리케이션의 DOM XSS 공격 표면을 줄입니다.
authors:
  - koto
date: 2020-03-25
hero: image/admin/3Mgu37qU0P4fVdI4NTxM.png
alt: 교차 사이트 스크립팅 취약점을 보여주는 코드 조각.
description: '신뢰할 수 있는 유형 소개: 최신 웹 애플리케이션에서 DOM 기반 교차 사이트 스크립팅을 방지하는 브라우저 API입니다.'
tags:
  - blog
  - security
feedback:
  - api
---

## 왜 신경을 써야 할까요?

DOM 기반 교차 사이트 스크립팅(DOM XSS)은 가장 일반적인 웹 보안 취약점 중 하나이며 애플리케이션에 도입하기가 매우 쉽습니다. [신뢰할 수 있는 유형](https://github.com/w3c/webappsec-trusted-types)은 위험한 웹 API 기능을 기본적으로 보호함으로써 DOM XSS 취약점이 없는 애플리케이션을 작성, 보안 검토 및 유지 관리할 수 있는 도구를 제공합니다. 신뢰할 수 있는 유형은 Chrome 83에서 지원되며 [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill)은 기타 브라우저에서 사용할 수 있습니다. 최신 교차 브라우저 지원 정보는 [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types#browser_compatibility) 을 참조하세요.

{% Aside 'key-term' %} DOM 기반 교차 사이트 스크립팅은 사용자가 제어하는 *소스* (예: 사용자 이름 또는 URL 조각에서 가져온 리디렉션 URL)의 데이터가 `eval()`과 같은 함수 또는 `.innerHTML`과 같은 속성 설정자와 같은 *싱크에* 도달하면 발생하며, 이는 임의의 JavaScript 코드를 실행할 수 있습니다. {% endAside %}

## 배경

수년 동안 [DOM XSS](https://owasp.org/www-community/attacks/xss/)는 가장 일반적이고 위험한 웹 보안 취약점 중 하나였습니다.

교차 사이트 스크립팅에는 두 가지 뚜렷한 그룹이 있습니다. 일부 XSS 취약점은 웹사이트를 구성하는 HTML 코드를 안전하지 않게 생성하는 서버 측 코드로 인해 발생합니다. 이외에는 클라이언트에 근본 원인이 있어 JavaScript 코드가 사용자 제어 콘텐츠로 위험한 함수를 호출합니다.

[서버 측 XSS를 방지](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)하려면 문자열을 연결하여 HTML을 생성하는 것 대신 안전한 컨텍스트 자동 이스케이프 템플릿 라이브러리를 사용하세요. 불가피하게 발생하는 버그에 대한 추가 완화를 위해 [임시 기반 콘텐츠 보안 정책](https://csp.withgoogle.com/docs/strict-csp.html)을 사용합니다.

이제 브라우저는 [신뢰할 수 있는 유형](https://bit.ly/trusted-types)으로 클라이언트 측(DOM 기반이라고도 함) XSS를 방지하는 데도 도움이 됩니다.

## API 소개

신뢰할 수 있는 유형은 다음과 같은 위험한 싱크 기능을 봉쇄하는 방식으로 작동합니다. 브라우저 공급업체와 [웹 프레임워크](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)가 이미 보안상의 이유로 이러한 기능을 사용하지 않도록 지시하기 때문에 일부는 이미 알고 있을 수 있습니다.

- **스크립트 조작**:<br> [`<script src>`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-src) 및 [`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script) 요소의 텍스트 내용 설정.

- **문자열에서 HTML 생성**:<br>

    [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) , [`outerHTML`](https://developer.mozilla.org/docs/Web/API/Element/outerHTML) ,[`insertAdjacentHTML`](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML) , [`<iframe> srcdoc`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-srcdoc) , [`document.write`](https://developer.mozilla.org/docs/Web/API/Document/write) , [`document.writeln`](https://developer.mozilla.org/docs/Web/API/Document/writeln) 및 [`DOMParser.parseFromString`](https://developer.mozilla.org/docs/Web/API/DOMParser#DOMParser.parseFromString)

- **플러그인 콘텐츠 실행**:<br> [`<embed src>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed#attr-src) , [`<object data>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-data) 및 [`<object codebase>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-codebase)

- **런타임 JavaScript 코드 컴파일**:<br> `eval` , `setTimeout` , `setInterval` , `new Function()`

신뢰할 수 있는 유형을 사용하려면 위의 싱크 함수에 데이터를 전달하기 전에 데이터를 처리해야 합니다. 브라우저는 데이터가 신뢰할 수 있는지 알지 못하기 때문에 문자열을 사용하는 것만으로는 실패합니다.

{% Compare 'worse' %}

```javascript
anElement.innerHTML  = location.href;
```

{% CompareCaption %} 신뢰할 수 있는 유형이 활성화되면 브라우저에서 *TypeError*를 발생시키고 문자열이 있는 DOM XSS 싱크 사용을 방지합니다. {% endCompareCaption %}

{% endCompare %}

데이터가 안전하게 처리되었음을 나타내려면 신뢰할 수 있는 유형이라는 특수 개체를 만듭니다.

{% Compare 'better' %}

```javascript
anElement.innerHTML = aTrustedHTML;
```

{% CompareCaption %} 신뢰할 수 있는 유형이 활성화되면 브라우저는 HTML 스니펫을 예상하는 싱크에 `TrustedHTML` 개체를 수락합니다. 다른 민감한 싱크에 대한 `TrustedScript` 및 `TrustedScriptURL` 개체도 있습니다. {% endCompareCaption %}

{% endCompare %}

신뢰할 수 있는 유형은 애플리케이션의 DOM XSS [공격 표면](https://en.wikipedia.org/wiki/Attack_surface)을 크게 줄입니다. 보안 검토를 단순화하고 브라우저에서 런타임 시 코드를 컴파일, 린트 또는 번들링 할 때 수행되는 유형 기반 보안 검사를 시행할 수 있습니다.

## 신뢰할 수 있는 유형을 사용하는 방법

### 콘텐츠 보안 정책 위반 보고서 준비

보고서 콜렉터(예: 오픈 소스 [go-csp-collector](https://github.com/jacobbednarz/go-csp-collector))를 배포하거나 상용 제품 중 하나를 사용할 수 있습니다. 브라우저에서 위반을 디버그 할 수도 있습니다.

```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### 보고서 전용 CSP 헤더 추가

신뢰할 수 있는 유형으로 마이그레이션하려는 문서에 다음 HTTP 응답 헤더를 추가합니다.

```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

이제 모든 위반 사항이 `//my-csp-endpoint.example`에 보고되지만 웹사이트는 계속 작동합니다. 다음 섹션에서 `//my-csp-endpoint.example`이 작동하는 방식을 설명합니다.

{% Aside 'caution' %} 신뢰할 수 있는 유형은 HTTPS 및 `localhost`와 같은 [보안 컨텍스트](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts)에서만 사용할 수 있습니다. {% endAside %}

### 신뢰할 수 있는 유형 위반 식별

이제부터 신뢰할 수 있는 유형이 위반을 감지할 때마다 보고서가 구성된 `report-uri`로 전송됩니다. 예를 들어, 애플리케이션이 `innerHTML` 문자열을 전달하면 브라우저는 다음 보고서를 보냅니다.

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

이것은 `https://my.url.example/script.js`에서 39번째 줄의 `innerHTML`이 `<img src=x` 시작하는 문자열로 호출되었음을 의미합니다. 이 정보는 DOM XSS를 도입하고 변경해야 하는 코드 부분을 좁히는 데 도움이 됩니다.

{% Aside %} 이와 같은 대부분의 위반은 코드베이스에서 코드 린터 또는 [정적 코드 검사기](https://github.com/mozilla/eslint-plugin-no-unsanitized)를 실행하여 감지할 수도 있습니다. 이렇게 하면 많은 양의 위반을 빠르게 식별하는 데 도움이 됩니다.

즉, 부적합 코드가 실행될 때 트리거 되므로 CSP 위반도 분석해야 합니다. {% endAside %}

### 위반 사항 수정

신뢰할 수 있는 유형 위반을 수정하기 위한 몇 가지 옵션이 있습니다. [문제가 되는 코드를 제거](#remove-the-offending-code)하거나, [라이브러리를 사용](#use-a-library)하거나, [신뢰할 수 있는 유형 정책을 생성](#create-a-trusted-type-policy)하거나, 최후의 수단으로 [기본 정책을 생성](#create-a-default-policy)할 수 있습니다.

#### 문제가 되는 코드 다시 작성

혹시 호환되지 않는 기능은 더 이상 필요하지 않거나 오류가 발생하기 쉬운 기능을 사용하지 않고 최신 방식으로 다시 작성할 수 있을까요?

{% Compare 'worse' %}

```javascript
el.innerHTML = '<img src=xyz.jpg>';
```

{% endCompare %}

{% Compare 'better' %}

```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```

{% endCompare %}

#### 라이브러리 사용

일부 라이브러리는 싱크 함수에 전달할 수 있는 신뢰할 수 있는 유형을 이미 생성합니다. 예를 들어 [DOMPurify](https://github.com/cure53/DOMPurify)를 사용하여 HTML 스니펫을 삭제하고 XSS 페이로드를 제거할 수 있습니다.

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true});
```

DOMPurify는 [신뢰할 수 있는 유형을 지원](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types)하며 브라우저가 위반을 생성하지 않도록 `TrustedHTML` 개체로 래핑된 정제된 HTML을 반환합니다. {% Aside 'caution' %} DOMPurify의 삭제 논리에 버그가 있는 경우 애플리케이션에 여전히 DOM XSS 취약점이 있을 수 있습니다. 신뢰할 수 있는 유형을 사용하면 값을 *어떻게든* 처리해야 하지만 정확한 처리 규칙이 무엇인지, 안전한지 여부는 아직 정의하지 않습니다. {% endAside %}

#### 신뢰할 수 있는 유형 정책 만들기

때때로 기능을 제거할 수 없고, 값을 삭제하고 신뢰할 수 있는 유형을 생성하는 라이브러리가 없습니다. 이러한 경우 신뢰할 수 있는 유형 개체를 직접 만드세요.

이를 위해 먼저 [정책을](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr) 만듭니다. 정책은 입력에 특정 보안 규칙을 적용하는 신뢰할 수 있는 유형의 팩토리입니다.

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // 기능 테스트
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '<')
  });
}
```

이 코드는 `createHTML()` 함수를 통해 `TrustedHTML` 개체를 생성할 수 있는 `myEscapePolicy`라는 정책을 만듭니다. 정의된 규칙은 새 HTML 요소의 생성을 방지하기 위해 `<`를 HTML escape 처리합니다.

다음과 같이 정책을 사용합니다.

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // 참
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Aside %} `trustedTypes.createPolicy()`에 JavaScript 함수가 전달되는 동안 `createHTML()`은 문자열을 반환하고, `createPolicy()`는 반환 값을 올바른 유형(이 경우 `TrustedHTML`)으로 래핑 하는 정책 객체를 반환합니다. {% endAside %}

#### 기본 정책 사용

때로는 문제가 되는 코드를 변경할 수 없습니다. 예를 들어 CDN에서 타사 라이브러리를 로드하는 경우입니다. 이 경우 [기본 정책을](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr) 사용합니다.

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // 기능 테스트
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

이름이 `default`인 정책은 신뢰할 수 있는 유형만 허용하는 싱크에서 문자열을 사용할 때마다 사용됩니다. {% Aside 'gotchas' %} 기본 정책을 드물게 사용하고 일반 정책을 대신 사용하도록 애플리케이션을 리팩토링하는 것을 선호합니다. 그렇게 하면 보안 규칙이 처리하는 데이터에 가까운 설계를 장려하고 값을 올바르게 삭제하는 데 가장 많은 컨텍스트를 갖게 됩니다. {% endAside %}

### 콘텐츠 보안 정책 시행으로 전환

애플리케이션이 더 이상 위반을 생성하지 않으면 신뢰할 수 있는 유형 적용을 시작할 수 있습니다.

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

짜잔! 이제 웹 애플리케이션이 아무리 복잡하더라도 DOM XSS 취약점을 도입할 수 있는 유일한 것은 정책 중 하나의 코드입니다. [정책 생성을 제한](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive)하여 이를 더욱 봉쇄할 수 있습니다.

## 추가 읽기

- [신뢰할 수 있는 유형 GitHub](https://github.com/w3c/webappsec-trusted-types)
- [W3C 사양 초안](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [자주하는 질문](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [통합](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)
