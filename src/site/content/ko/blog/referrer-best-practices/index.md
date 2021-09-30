---
title: 리퍼러 및 리퍼러 정책 모범 사례
subhead: 리퍼러 정책을 설정하고 들어오는 요청에서 리퍼러를 사용하는 모범 사례
authors:
  - maudn
date: 2020-07-30
updated: 2020-09-23
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: |
  `strict-origin-when-cross-origin` 의 리퍼러 정책 설정을 고려하세요. 출처 간 데이터 누출 위험을 완화하면서 리퍼러의 유용성을 많은 부분 유지합니다.
tags:
  - blog
  - security
  - privacy
feedback:
  - API
---

## 요약

- 예상치 못한 출처 간 정보 누출로 웹 사용자의 개인 정보가 침해될 수 있습니다. 여기서 보호 리퍼러 정책이 도움이 될 수 있습니다.
- `strict-origin-when-cross-origin`의 리퍼러 정책 설정을 고려하세요. 출처 간 데이터 누출 위험을 완화하면서 리퍼러의 유용성을 많은 부분 유지합니다.
- 교차 사이트 요청 위조(CSRF) 보호 목적으로 리퍼러를 사용하지 마세요. 대신, [CSRF 토큰](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)을 사용하고 다른 헤더를 추가 보안 계층으로 사용하세요.

{% Aside %} 시작하기 전에:

- "사이트"와 "출처"의 차이점에 대해 확실히 모르겠으면 ["same-site" 및 "same-origin" 이해하기](/same-site-same-origin/)를 확인해 보세요.
- 사양의 원래 맞춤법 오류로 인해 `Referer` 헤더에는 R이 빠져 있습니다. JavaScript 및 DOM의 `Referrer-Policy` 헤더와 `referrer`는 철자가 정확합니다. {% endAside %}

## 리퍼러 및 리퍼러 정책 A부터 Z까지

HTTP 요청에는 요청이 이루어진 출처 또는 웹 페이지 URL을 나타내는 [`Referer`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer) 헤더가 포함될 수 있습니다. [`Referrer-Policy` 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)는 `Referer` 헤더에서 사용할 수 있는 데이터를 정의합니다.

아래 예에서 `Referer` 헤더에는 요청이 이루어진 `site-one`에 있는 페이지의 전체 URL이 포함됩니다.

<figure class="w-figure">{% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="리퍼러 헤더를 포함하는 HTTP 요청", width="800", height="573" %}</figure>

`Referer` 헤더는 다양한 유형의 요청에 존재할 수 있습니다.

- 사용자가 링크를 클릭할 때의 탐색 요청
- 브라우저가 페이지에 필요한 이미지, iframe, 스크립트 및 기타 리소스를 요청할 때의 하위 리소스 요청

탐색 및 iframe의 경우, `document.referrer` 사용하여 JavaScript를 통해서도 이 데이터에 액세스할 수 있습니다.

`Referer` 값은 유익한 정보를 내포할 수 있습니다. 예를 들어, 분석 서비스는 이 값을 사용하여 `site-two.example` 방문자의 50%가 `social-network.example`에서 왔다는 사실을 알아낼 수 있습니다.

그러나 경로와 쿼리 문자열을 포함하는 전체 URL이 **출처 간**에 `Referer`에서 전송되면 이는 **개인정보 침해**를 유발할 수 있으며 **보안 위험**을 제기할 수 있습니다. 다음 URL을 살펴보세요.

<figure class="w-figure">{% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="경로가 있는 URL, 다양한 개인정보 보호 및 보안 위험에 매핑됨", width="800", height="370" %}</figure>

URL #1 ~ #5에는 개인정보가 포함되어 있으며 때로는 개인 식별이 가능하거나 민감한 정보도 포함될 수 있습니다. 출처 간에 이러한 정보가 감지되지 않고 누출되면 웹 사용자의 개인정보가 위험에 빠질 수 있습니다.

URL #6은 [기능 URL](https://www.w3.org/TR/capability-urls/)입니다. 의도한 사용자 이외의 다른 사람의 손에 정보가 넘어가는 것은 원하지 않을 것입니다. 이런 일이 실제로 발생하면 악의적인 행위자에 의해 이 사용자의 계정이 도용될 수 있습니다.

**사이트의 요청에 사용할 수 있는 리퍼러 데이터를 제한하기 위해 리퍼러 정책을 설정할 수 있습니다.**

## 어떤 정책을 사용할 수 있고 서로 어떻게 다릅니까?

8가지 정책 중 하나를 선택할 수 있습니다. 정책에 따라 `Referer` 헤더(및 `document.referrer`)에서 사용할 수 있는 데이터는 다음과 같습니다.

- 데이터 없음(`Referer` 헤더가 없음)
- [출처](/same-site-same-origin/#origin)만
- 전체 URL: 출처, 경로 및 쿼리 문자열

<figure class="w-figure">{% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Referer 헤더 및 document.referrer에 포함될 수 있는 데이터", width="800", height="255" %}</figure>

일부 정책은 출처 간 또는 동일 출처 요청, 보안(요청 대상이 출처만큼 안전한지 여부) 또는 둘 모두 등 **컨텍스트**에 따라 다르게 작동하도록 설계됩니다. 이는 자체 사이트 내에서 리퍼러의 풍부함을 유지하면서 출처 간에 공유되는 정보의 양을 제한하거나 덜 안전한 원본으로 제한하는 데 유용합니다.

다음은 리퍼러 정책이 Referer 헤더와 `document.referrer`에서 사용할 수 있는 URL 데이터를 제한하는 방법을 보여주는 개요입니다.

<figure class="w-figure">{% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="보안 및 출처 간 컨텍스트에 따라 다른 리퍼러 정책 및 동작", width="800", height="537" %}</figure>

MDN은 [정책 및 동작의 전체 예시 목록](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives)을 제공합니다.

참고 사항:

- 전송 방식(HTTPS 대 HTTP)을 고려하는 모든 정책(`strict-origin`, `no-referrer-when-downgrade` 및 `strict-origin-when-cross-origin`)은 HTTP의 보안성이 떨어지더라도 HTTP 출처에서 다른 HTTP 출처로의 요청을 HTTPS 출처에서 다른 HTTPS 출처로의 요청과 동일한 방식으로 처리합니다. 그 이유는 이러한 정책의 경우에 보안 **다운그레이드**가 발생하는지 여부가 중요하기 때문입니다. 즉, 요청으로 인해 암호화된 출처의 데이터가 암호화되지 않은 출처에 노출될 수 있는지 여부가 중요한 것입니다. HTTP → HTTP 요청은 항상 암호화되지 않으므로 다운그레이드가 없습니다. 반면, HTTPS → HTTP 요청은 다운그레이드가 발생합니다.
- 요청이 **same-origin**인 경우, 전송 방식(HTTPS 또는 HTTP)이 동일합니다. 따라서 보안 다운그레이드가 없습니다.

## 브라우저의 기본 리퍼러 정책

*2020년 7월 현재*

**리퍼러 정책이 설정되어 있지 않으면 브라우저의 기본 정책이 사용됩니다.**

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>브라우저</th>
        <th>기본 <code>Referrer-Policy</code> / 동작</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Chrome</td>
        <td>
<a href="https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default">버전 85</a>에서 <code>strict-origin-when-cross-origin</code>으로 전환할 계획(이전 <code>no-referrer-when-downgrade</code>)</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          <ul>
            <li>
<code>strict-origin-when-cross-origin</code> (<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">마감된 버그 참조</a>)</li>
            <li>비공개 브라우징 및 추적기의 <code>strict-origin-when-cross-origin</code>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Edge</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li>
<code>strict-origin-when-cross-origin</code> <a href="https://github.com/privacycg/proposals/issues/13">실험 중</a>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>
<code>strict-origin-when-cross-origin</code>와 유사합니다. 자세한 내용은 <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">추적 방지</a>를 참조하세요.</td>
      </tr>
    </tbody>
  </table>
</div>

## 리퍼러 정책 설정하기: 모범 사례

{% Aside 'objective' %} `strict-origin-when-cross-origin`(또는 더 엄격)과 같은 개인정보 보호 강화 정책을 명시적으로 설정하세요. {% endAside %}

사이트에 대해 리퍼러 정책을 설정하는 여러 가지 방법이 있습니다.

- HTTP 헤더로
- [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML) 내에서
- [요청이 있을 시](https://javascript.info/fetch-api#referrer-referrerpolicy) JavaScript에서

페이지, 요청 또는 요소마다 다른 정책을 설정할 수 있습니다.

HTTP 헤더와 메타 요소는 모두 페이지 수준입니다. 요소의 유효 정책을 결정할 때 우선 순위는 다음과 같습니다.

1. 요소 수준 정책
2. 페이지 수준 정책
3. 브라우저 기본 설정

**예시:**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

이미지는 `no-referrer-when-downgrade` 정책으로 요청되는 반면 이 페이지의 다른 모든 하위 리소스 요청은 `strict-origin-when-cross-origin` 정책을 따릅니다.

## 리퍼러 정책을 보려면 어떻게 합니까?

[securityheaders.com](https://securityheaders.com/)은 특정 사이트나 페이지가 사용하는 정책을 확인하기에 편리합니다.

Chrome, Edge 또는 Firefox의 개발자 도구를 사용하여 특정 요청에 사용된 리퍼러 정책을 볼 수도 있습니다. 이 글을 작성하는 시점에 Safari는 `Referrer-Policy` 헤더를 표시하지 않지만 전송된 `Referer`는 표시합니다.

<figure class="w-figure">{% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="리퍼러 및 리퍼러 정책을 보여주는 Chrome DevTools의 네트워크 패널 스크린샷", width="800", height="416" %}<figcaption class="w-figcaption"> Chrome DevTools, 요청이 선택된 <b>네트워크 패널</b></figcaption></figure>

## 내 웹 사이트에 어떤 정책을 설정해야 합니까?

요약: `strict-origin-when-cross-origin`(또는 더 엄격)과 같은 개인정보 보호 강화 정책을 명시적으로 설정합니다.

### 왜 "명시적"이어야 합니까?

리퍼러 정책이 설정되어 있지 않으면 브라우저의 기본 정책이 사용됩니다. 실제로 웹 사이트는 종종 브라우저의 기본값을 따릅니다. 그러나 이것은 다음과 같은 이유로 이상적이지 않습니다.

- 브라우저 기본 정책은 브라우저와 모드(비공개/시크릿)에 따라 `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, 또는 이보다 엄격합니다. 따라서 웹 사이트가 모든 브라우저에서 예상대로 작동하는 것은 아닙니다.
- 브라우저는 출처 간 요청에 대해 `strict-origin-when-cross-origin`과 같은 더 엄격한 기본값 및 [리퍼러 트리밍](https://github.com/privacycg/proposals/issues/13)과 같은 메커니즘을 채택하고 있습니다. 브라우저 기본값이 변경되기 전에 개인정보 보호 강화 정책을 명시적으로 선택하면 제어력을 확보할 수 있고 적절하다고 판단되는 테스트를 실행할 수 있습니다.

### 왜 `strict-origin-when-cross-origin`(또는 더 엄격)을 사용해야 합니까?

안전하고 개인정보 보호를 강화하며 유용한 정책이 필요합니다. 여기서 "유용한"이라는 말은 리퍼러에서 원하는 바에 따라 다릅니다.

- **보안**: 웹 사이트에서 HTTPS를 사용하는 경우([그렇지 않은 경우 우선 순위로 지정할 것](/why-https-matters/)) HTTPS가 아닌 요청에서 웹 사이트의 URL이 누출되는 것을 원하지 않을 것입니다. 네트워크에 있는 모든 사람이 이를 볼 수 있으므로 사용자가 중간자 공격에 노출될 수 있습니다. `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, `no-referrer` 및 `strict-origin` 정책이 이 문제를 해결해줍니다.
- **개인정보 보호 강화**: 출처 간 요청의 경우 `no-referrer-when-downgrade`가 전체 URL을 공유합니다. 이는 개인정보 보호를 강화하는 것이 아닙니다. `strict-origin-when-cross-origin` 및 `strict-origin`만 출처를 공유하고 `no-referrer`는 아무 것도 공유하지 않습니다. 그러면 개인정보 보호 선택지로 `strict-origin-when-cross-origin`, `strict-origin` 및 `no-referrer`가 남습니다.
- **유용성**: `no-referrer` 및 `strict-origin`은 same-origin 요청에 대해서도 전체 URL을 공유하지 않습니다. 따라서 이것이 필요한 경우 `strict-origin-when-cross-origin`이 더 나은 선택입니다.

이 모든 사항들을 고려하면 **`strict-origin-when-cross-origin`**이 일반적으로 합리적인 선택임을 알 수 있습니다.

**예: `strict-origin-when-cross-origin` 정책 설정:**

`index.html` :

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

또는 서버측, 예를 들어 Express에서:

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### `strict-origin-when-cross-origin`(또는 더 엄격)이 모든 사용 사례를 수용하지 못한다면 어떻게 될까요?

이 경우 **점진적인 접근 방식**을 취하세요. 웹 사이트에 대해 `strict-origin-when-cross-origin`과 같은 보호 정책을 설정하고 필요한 경우 특정 요청이나 HTML 요소에 대해 보다 관대한 정책을 설정합니다.

### 예: 요소 수준 정책

`index.html` :

```html/6
<head>
  <!-- document-level policy: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- policy on this <a> element: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

Safari/WebKit은 [사이트 간](/same-site-same-origin/#same-site-cross-site) 요청에 `document.referrer` 또는 `Referer` 헤더를 제한할 수 있습니다. [자세한 내용](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)을 확인하세요.

### 예: 요청 수준 정책

`script.js` :

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### 또 어떤 점들을 고려해야 합니까?

정책은 웹 사이트와 사용 사례에 따라 달라져야 합니다. 이는 귀하, 귀하의 팀, 회사의 판단에 달려 있습니다. 일부 URL에 개인 식별 데이터 또는 민감한 데이터가 포함된 경우 보호 정책을 설정하세요.

{% Aside 'warning' %} 귀하에게 민감하지 않은 데이터가 사용자에게는 민감할 수 있거나 단순히 출처 간에서 감지되지 않고 누출되기를 원하거나 그러기를 예상하는 데이터가 아닐 수 있습니다. {% endAside %}

## 들어오는 요청에서 리퍼러 사용: 모범 사례

### 내 사이트 기능에 들어오는 요청의 리퍼러 URL이 사용되는 경우 어떻게 해야 합니까?

#### 사용자 데이터 보호

`Referer`에는 비공개, 개인 또는 식별 데이터가 포함될 수 있으므로 그에 따라 취급해야 합니다.

#### 수신하는 `Referer`는 달라질 수 있다는 점에 유의하세요

들어오는 출처 간 요청의 리퍼러를 사용하면 몇 가지 제한이 따릅니다.

- 요청 이미터의 구현을 제어할 수 없는 경우 수신하는 `Referer` 헤더(및 `document.referrer`)에 대해 가정을 할 수 없습니다. 요청 이미터는 언제든지 `no-referrer` 정책으로 전환하거나, 더 일반적으로 말하면, 이전보다 더 엄격한 정책으로 전환을 결정할 수도 있습니다. 이 경우에는 이전보다 `Referer`를 통해 더 적은 데이터를 얻게 됩니다.
- 기본적으로, 브라우저에 리퍼러 정책 `strict-origin-when-cross-origin`이 점차 많이 사용되고 있습니다. 즉, 들어오는 출처 간 요청에서 출처만(전체 리퍼러 URL이 아니라) 수신할 수 있습니다. 이러한 정보를 보내는 사이트에 이 정책이 설정되어 있지 않은 경우에도 마찬가지입니다.
- 브라우저는 `Referer`를 관리하는 방식을 변경할 수도 있습니다. 예를 들어, 향후에는 사용자 개인 정보를 보호하기 위해 출처 간 하위 리소스 요청에서 출처에 대한 리퍼러를 항상 트리밍하도록 동작할 수 있습니다.
- `Referer` 헤더(및 `document.referrer`)에 필요 이상으로 많은 데이터가 포함될 수 있습니다. 예를 들어 요청이 출처 간인지만 알고 싶을 때 전체 URL이 포함될 수 있습니다.

#### `Referer`에 대한 대안

다음과 같은 경우 대안을 고려해야 할 수 있습니다.

- 사이트의 필수 기능이 들어오는 출처 간 요청의 리퍼러 URL을 사용합니다.
- 및/또는 사이트가 출처 간 요청에서 필요로 하는 리퍼러 URL의 일부를 더 이상 수신하지 않는 경우. 이러한 상황은 요청 이미터가 정책을 변경하거나 정책이 설정되지 않았고 브라우저 기본 정책이 변경된 경우(예: [Chrome 85](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default))에 발생합니다.

대안을 정의하려면 먼저 사용 중인 리퍼러 부분을 분석하세요.

**출처(`https://site-one.example`)만 필요한 경우:**

- 페이지에 대한 최상위 액세스 권한이 있는 스크립트에서 리퍼러를 사용하는 경우 `window.location.origin`이 대안입니다.
- 가능한 경우, [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) 및 [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site)와 같은 헤더가 `Origin`을 제공하거나, 정확하게 원하는 바 대로 요청이 출처 간인지 여부를 설명합니다.

**URL의 다른 요소(경로, 쿼리 매개변수…)가 필요한 경우:**

- 요청 매개변수가 사용 사례를 처리할 수 있으며 이를 통해 리퍼러를 구문 분석하는 작업을 생략할 수 있습니다.
- 페이지에 대한 최상위 액세스 권한이 있는 스크립트에서 리퍼러를 사용하는 경우 `window.location.pathname`이 대안이 될 수 있습니다. URL의 경로 섹션만 추출하여 인수로 전달함으로써 URL 매개변수에 있을 수 있는 잠재적으로 민감한 정보가 전달되지 않도록 합니다.

**이러한 대안을 이용할 수 없는 경우:**

- 요청 이미터(`site-one.example`)가 요구되는 정보를 일종의 구성에서 명시적으로 설정할 것을 기대하도록 시스템을 변경할 수 있는지 확인하세요. 장점: `site-one.example` 사용자에게 더욱 명시적으로 개인정보를 보호해 주며 미래에 더 잘 대비할 수 있습니다. 단점: 잠재적으로, 여러분이나 시스템 사용자에게 더 많은 작업이 필요할 수 있습니다.
- 요청을 내보내는 사이트가 `no-referrer-when-downgrade`의 요소별 또는 요청별 리퍼러 정책 설정에 동의할 수 있는지 확인하세요. 단점: `site-one.example` 사용자의 개인정보 보호 수준이 낮고 일부 브라우저에서 지원되지 않을 수 있습니다.

### 교차 사이트 요청 위조(CSRF) 보호

요청 이미터는 `no-referrer` 정책을 설정하여 언제든지 리퍼러를 보내지 않도록 결정할 수 있습니다(악의적인 행위자는 리퍼러를 도용할 수도 있음).

[CSRF 토큰](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)을 기본 보호 수단으로 사용하세요. 보호 수준을 더욱 높이기 위해 [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites)를 사용하고 `Referer` 대신 [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin)(POST 및 CORS 요청에서 사용 가능) 및 [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site)(사용 가능한 경우)와 같은 헤더를 사용하세요.

### 로깅

`Referer`에 있을 수 있는 사용자의 개인 데이터 또는 민감한 데이터를 보호해야 합니다.

출처만 사용하는 경우 [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) 헤더가 대안이 될 수 있는지 확인하세요. 이렇게 하면 리퍼러를 구문 분석할 필요 없이 더 간단한 방법으로 디버깅에 필요한 정보를 얻을 수 있습니다.

### 결제

결제 공급자는 보안 검사를 위해 들어오는 요청의 `Referer` 헤더에 의존할 수 있습니다.

예를 들면 다음과 같습니다.

- 사용자가 `online-shop.example/cart/checkout`에서 **구매** 버튼을 클릭합니다.
- `online-shop.example`은 거래를 관리하기 위해 `payment-provider.example`로 리디렉션됩니다.
- `payment-provider.example`은 판매자가 설정한 허용된 `Referer` 값 목록과 대조해 이 요청의 `Referer`를 검사합니다. 목록의 항목과 일치하지 않는 부분이 있으면 `payment-provider.example`이 요청을 거부합니다. 일치하는 경우에는 사용자가 거래로 진행할 수 있습니다.

#### 결제 흐름의 보안을 검사하기 위한 모범 사례

**요약: 결제 공급자는 낮은 수준의 공격에 대한 기본적인 검사로 `Referer`를 사용할 수 있지만 더 신뢰할 수 있는 다른 검증 방법이 꼭 있어야 합니다.**

`Referer` 헤더 자체는 검사를 위한 신뢰할 수 있는 기반이 되지 못합니다. 합법적인 판매자인지 여부에 관계없이 요청하는 사이트는 `no-referrer` 정책을 설정할 수 있고, 그렇게 되면 결제 공급자가 `Referer` 정보를 사용할 수 없게 됩니다. 그러나 결제 공급자의 입장에서 `Referrer`를 볼 수 있다면 `no-referrer` 정책을 설정하지 않은 순진한 공격자를 잡아내는 데 도움이 될 수 있습니다. 따라서 첫 단계의 기본적 검사로 `Referer` 사용을 선택할 수 있습니다. 만약 그러한 경우에는 다음 지침을 따르세요.

- **`Referer`가 ​​항상 존재할 것으로 기대하지 마세요. 존재하는 경우에는 최소한 포함할 데이터 부분(출처)에 대해서만 확인하세요.** 허용되는 `Referer` 값 목록을 설정할 때 경로는 포함되지 않고 출처만 포함되도록 하세요. 예: `online-shop.example`에 허용되는 `Referer` 값은 `online-shop.example/cart/checkout`이 아니라 `online-shop.example`이어야 합니다. 이유? `Referer`가 전혀 없을 것으로 예상하거나 요청하는 웹사이트의 출처인 `Referer` 값을 예상함으로써 판매자가 설정한 **`Referrer-Policy`에 대해, 또는 판매자가 정책을 설정하지 않은 경우 브라우저 동작**에 대해 어떠한 가정도 하지 않을 것이기 때문에 예상치 못한 오류를 방지하게 됩니다. 사이트와 브라우저 모두 들어오는 요청에서 보낸 `Referer`를 출처만 남기고 제거하거나 `Referer`를 전혀 보내지 않을 수 있습니다.
- `Referer`가 없는 경우, 또는 존재하고 기본적인 `Referer` 출처 확인에 성공한 경우: 다른 더 신뢰할 수 있는 인증 방법으로 진행할 수 있습니다(아래 참조).

**더 신뢰할 수 있는 검증 방법은 무엇입니까?**

신뢰할 수 있는 검증 방법 중 하나는 요청자가 고유 키와 함께 **요청 매개변수를 해시 처리**하도록 하는 것입니다. 그러면 결제 공급자가 **자체적으로 동일한 해시를 계산**하고 계산과 일치하는 경우에만 요청을 수락할 수 있습니다.

**리퍼러 정책이 없는 HTTP 판매자 사이트가 HTTPS 결제 공급자로 리디렉션하는 경우 `Referer`는 어떻게 됩니까?**

요청에서 HTTPS 결제 공급자에게 `Referer`가 보이지 않는 이유는 [대부분의 브라우저](#default-referrer-policies-in-browsers)가 `strict-origin-when-cross-origin` 또는 웹사이트에 정책이 설정되지 않은 경우 `no-referrer-when-downgrade`를 기본적으로 사용하기 때문입니다. 또한 [Chrome의 새로운 기본 정책 변경 사항](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)은 이 동작을 변경하지 않는다는 점에도 유의해야 합니다.

{% Aside %}

웹사이트에서 HTTP를 사용하는 경우 [HTTPS로 마이그레이션하세요](/why-https-matters/).

{% endAside %}

## 결론

보호 리퍼러 정책은 사용자의 개인정보 보호 수준을 높이는 좋은 방법입니다.

사용자를 보호하기 위한 다양한 기술에 대해 자세히 알아보려면 web.dev의 [Safe and secure](/secure/) 컬렉션을 확인하세요!

*모든 리뷰어, 특히 Kaustubha Govind, David Van Cleve, Mike West, Sam Dutton, Rowan Merewood, Jxck 및 Kayce Basques의 기여와 피드백에 깊이 감사 드립니다.*

## 리소스

- ["same-site" 및 "same-origin" 이해하기](/same-site-same-origin/)
- [새로운 보안 헤더: 리퍼러 정책(2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [MDN의 리퍼러 정책](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- [리퍼러 헤더: MDN의 개인정보 및 보안 문제](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Chrome 변경: 구현 의도 간단히 알아보기](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Chrome 변경: 배송 의도 간단히 알아보기](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Chrome 변경: 상태 항목](https://www.chromestatus.com/feature/6251880185331712)
- [Chrome 변경: 85 베타 블로그 게시물](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [리퍼러 트리밍 GitHub 스레드: 다양한 브라우저가 하는 일](https://github.com/privacycg/proposals/issues/13)
- [리퍼러 정책 사양](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
