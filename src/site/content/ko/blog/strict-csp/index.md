---
layout: post
title: 엄격한 CSP(콘텐츠 보안 정책)로 XSS(교차 사이트 스크립팅) 완화
subhead: 교차 사이트 스크립팅에 대한 심층 방어로 스크립트 임시값 또는 해시를 기반으로 CSP를 배포하는 방법.
description: 교차 사이트 스크립팅에 대한 심층 방어로 스크립트 임시값 또는 해시를 기반으로 CSP를 배포하는 방법 대해 알아봅니다.
authors:
  - lwe
date: 2021-03-15
hero: image/3lmWcR1VGYVMicNlBh4aZWBTcSg1/mhE0NYvP3JFyvNyiQ1dj.jpg
alt: 엄격한 콘텐츠 보안 정책을 설정하는 JavaScript 코드의 스크린샷.
tags:
  - blog
  - security
---

## 엄격한 CSP(콘텐츠 보안 정책)를 배포해야 하는 이유는 무엇일까요?

웹 애플리케이션에 악성 스크립트를 삽입하는 기능인 [XSS(교차 사이트 스크립팅)](https://www.google.com/about/appsecurity/learning/xss/)는 10년이 넘도록 가장 큰 웹 보안 취약점 중 하나였습니다.

[콘텐츠 보안 정책(CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) 은 XSS를 완화하는 데 도움이 되는 추가 보안 계층입니다. CSP 구성에는 웹 페이지에 콘텐츠 보안 정책 HTTP 헤더를 추가하고 사용자 에이전트가 해당 페이지에 대해 로드할 수 있는 리소스를 제어하는 값을 설정하는 작업이 포함됩니다. 본 문서는 [대부분의 구성에서 우회](https://research.google.com/pubs/pub45542.html)할 수 있는 종종 XSS에 노출된 페이지를 떠나 XSS를 완화하기 위해 일반적으로 사용되는 호스트 allowlist 기반의 CSP 대신에 임시값 또는 해시 기반의 CSP를 사용하는 방법에 대해 설명합니다.

{% Aside 'key-term' %} *임시값*은 `<script>` 태그를 신뢰할 수 있는 것으로 표시하는 데 사용할 수 있는 단 한 번 사용되는 임의의 숫자입니다. {% endAside %}

{% Aside 'key-term' %} 해시 함수는 입력 값을 압축된 숫자 값인 해시로 변환하는 수학 함수입니다. *해시*(예: [SHA-256](https://en.wikipedia.org/wiki/SHA-2))를 사용하여 인라인 `<script>` 태그를 신뢰할 수 있는 것으로 표시할 수 있습니다. {% endAside %}

임시값 또는 해시를 기반으로 하는 콘텐츠 보안 정책은 종종 *엄격한 CSP*라고 합니다. 애플리케이션이 엄격한 CSP를 사용하는 경우 HTML 삽입 결함을 발견한 공격자는 일반적으로 이를 사용하여 브라우저가 취약한 문서의 컨텍스트에서 악성 스크립트를 실행하도록 할 수 없습니다. 이는 엄격한 CSP가 해시된 스크립트 또는 서버에서 생성된 올바른 임시값이 있는 스크립트만 허용하므로 공격자는 주어진 응답에 대한 올바른 임시값을 모르면 스크립트를 실행할 수 없기 때문입니다.

{% Aside %} 사이트를 XSS로부터 보호하려면 사용자 입력을 삭제 *하고* CSP를 추가 보안 레이어로 사용하세요. CSP는 악성 스크립트의 실행을 방지할 수 있는 [심층 방어](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) 기술이지만 XSS 버그를 방지(그리고 즉시 수정) 하는 것을 대체할 수는 없습니다. {% endAside %}

### 허용 목록 CSP보다 엄격한 CSP가 권장되는 이유

사이트에 이미 `script-src www.googleapis.com`과 같은 CSP가 있는 경우, 교차 사이트 스크립팅에 대해 효과적이지 않을 수 있습니다! 이러한 유형의 CSP를 허용 목록 CSP라고 하며 이것은 몇 가지 단점이 있습니다.

- 많은 사용자 정의가 필요합니다.
- [대부분의 구성에서 우회](https://research.google.com/pubs/pub45542.html) 할 수 있습니다.

따라서 허용 목록 CSP는 일반적으로 공격자가 XSS를 악용하는 것을 방지하는 데 효과가 없습니다. 그렇기 때문에 위에서 설명한 함정을 피하기 위해 암호화 임시값 또는 해시를 기반으로 하는 엄격한 CSP를 사용하는 것이 좋습니다.

<div class="switcher">{% Compare 'worse', 'Allowlist CSP' %} - 사이트를 효과적으로 보호하지 않습니다. ❌ - 고도로 맞춤화되어야 합니다. 😓 {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Strict CSP' %}</p>
<ul data-md-type="list" data-md-list-type="unordered" data-md-list-tight="true">
<li data-md-type="list_item" data-md-list-type="unordered">사이트를 효과적으로 보호합니다. ✅</li>
<li data-md-type="list_item" data-md-list-type="unordered">항상 같은 구조를 가지고 있습니다. 😌 {% endCompare %}</li>
</ul>
<div data-md-type="block_html"></div>

## 엄격한 콘텐츠 보안 정책이란 무엇인가요?

엄격한 콘텐츠 보안 정책은 다음과 같은 구조를 가지며 다음 HTTP 응답 헤더 중 하나를 설정하여 활성화됩니다.

- **임시값 기반의 엄격한 CSP**

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';

```

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/er4BaGCJzBwDaESFKfZd.jpg", alt="", width="800", height="279" %}

- **해시 기반 엄격한 CSP**

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';

```

{% Aside warning %} 이것은 엄격한 CSP의 가장 기본적인 버전입니다. 여러 브라우저에서 효과를 보려면 조정해야 합니다. 자세한 내용은 [Safari 및 이전 브라우저를 지원하도록 대체 추가](#step-4:-add-fallbacks-to-support-safari-and-older-browsers)를 참조하세요. {% endAside %}

다음 속성은 CSP를 위와 같이 "엄격"하게 만들어 안전합니다.

- 임시값 `'nonce-{RANDOM}'` 또는 해시 `'sha256-{HASHED_INLINE_SCRIPT}'`를 사용하여 어떤 `<script>` 태그가 사이트 개발자가 신뢰하고 사용자 브라우저에서 실행할 수 있도록 허락된 것인지 표시할 수 있습니다.

- 이미 신뢰할 수 있는 스크립트에 의해 생성된 스크립트의 실행을 자동으로 허용하여 임시값 또는 해시 기반 CSP를 배포하는 노력을 줄이기 위해 [`'strict-dynamic'`](https://www.w3.org/TR/CSP3/#strict-dynamic-usage)을 설정합니다. 또한 대부분의 타사 JavaScript 라이브러리 및 위젯 사용을 차단 해제합니다.

- URL 허용 목록을 기반으로 하지 않으므로 [일반적인 CSP 우회를](https://speakerdeck.com/lweichselbaum/csp-is-dead-long-live-strict-csp-deepsec-2016?slide=15) 겪지 않습니다.

- 인라인 이벤트 헨들러 또는 `javascript:` URI와 같은 신뢰할 수 없는 인라인 스크립트를 차단합니다.

- Flash와 같은 위험한 플러그인을 비활성화하도록 `object-src`를 제한합니다.

- `<base>`를 제한하여 `base-uri` 태그 삽입을 차단합니다. 이것은 공격자가 상대 URL에서 로드된 스크립트의 위치를 변경하는 것을 방지합니다.

{% Aside %} 엄격한 CSP의 또 다른 장점은 CSP가 항상 동일한 구조를 가지며 애플리케이션에 맞게 사용자 지정할 필요가 없다는 것입니다. {% endAside %}

## 엄격한 CSP 채택

엄격한 CSP를 채택하려면 다음을 수행해야 합니다.

1. 애플리케이션에서 임시값 또는 해시 기반 CSP를 설정해야 하는지 결정합니다.
2. [엄격한 콘텐츠 보안 정책이란](#what-is-a-strict-content-security-policy) 섹션에서 CSP를 복사하고 애플리케이션 전체에서 응답 헤더로 설정합니다.
3. HTML 템플릿 및 클라이언트 측 코드를 리팩터링하여 CSP와 호환되지 않는 패턴을 제거합니다.
4. Safari 및 이전 브라우저를 지원하도록 대비책을 추가합니다.
5. CSP를 배포합니다.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) (플래그 `--preset=experimental`를 포함한 v7.3.0 이상) **모범 사례** 감사를 이 프로세스 전반에 걸쳐 사용하여 사이트에 CSP가 있는지, 그리고 이것이 XSS에 대해 효과적일 만큼 충분히 엄격한지 확인할 수 있습니다.

{% Img src="image/9B7J9oWjgsWbuE84mmxDaY37Wpw2/42a4iEEKsD4T3yU47vNQ.png", alt="시행 모드에서 CSP를 찾을 수 없다는 Lighthouse 보고서 경고", width="730", height="78" %}

### 1단계: 임시값 또는 해시 기반 CSP가 필요한지 결정

엄격한 CSP에는 임시값과 해시 기반의 두 가지 유형이 있습니다. 작동 방식은 다음과 같습니다.

- **임시값 기반 CSP** *: 런타임 시* 임의의 숫자를 생성하여 CSP에 포함하고 페이지의 모든 스크립트 태그와 연결합니다. 공격자는 해당 스크립트에 대한 올바른 임의의 숫자를 추측해야 하기 때문에 페이지에 악성 스크립트를 포함하고 실행할 수 없습니다. 이것은 숫자를 추측할 수 없고 런타임 시 모든 응답에 대해 새로 생성된 경우에만 작동합니다.
- **해시 기반 CSP** : 모든 인라인 스크립트 태그의 해시가 CSP에 추가됩니다. 각 스크립트에는 다른 해시가 있습니다. 공격자는 페이지에 악성 스크립트를 포함하고 실행할 수 없습니다. 해당 스크립트의 해시가 CSP에 있어야 하기 때문입니다.

엄격한 CSP 접근 방식을 선택하는 기준은 다음과 같습니다.

<div>
  <table>
      <caption>엄격한 CSP 접근 방식을 선택하는 기준</caption>
      <thead>
      <tr>
        <th>임시값 기반 CSP</th>
        <td>모든 응답에 대해 새로운 임시 토큰(임시값)을 만들 수 있는 서버에서 렌더링된 HTML 페이지의 경우.</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>해시 기반 CSP</th>
        <td>정적으로 제공되거나 캐시되어야 하는 HTML 페이지의 경우. 예를 들어, Angular, React 등과 같은 프레임워크로 구축된 단일 페이지 웹 애플리케이션은 서버 측 렌더링 없이 정적으로 제공됩니다.</td>
      </tr>
    </tbody>
  </table>
</div>

### 2단계: 엄격한 CSP 설정 및 스크립트 준비

CSP를 설정할 때 다음과 같은 몇 가지 옵션이 있습니다.

- 보고 전용 모드( `Content-Security-Policy-Report-Only` ) 또는 시행 모드( `Content-Security-Policy` ). 보고 전용에서 CSP는 아직 리소스를 차단하지 않습니다. 아무 것도 중단되지 않습니다. 그러나 오류를 보고 차단되었을 항목에 대한 보고서를 받을 수 있습니다. 로컬에서 CSP를 설정하는 중일 때는 두 모드 모두 브라우저 콘솔에서 오류를 표시하므로 이는 실제로 중요하지 않습니다. 적용 모드를 사용하면 페이지가 깨져 보이기 때문에 차단된 리소스를 확인하고 CSP를 조정하기가 훨씬 쉬워집니다. 보고 전용 모드는 나중에 프로세스에서 가장 유용합니다( [5단계](#step-5:-deploy-your-csp) 참조).
- 헤더 또는 HTML `<meta>` 태그. 로컬 개발의 경우 `<meta>` 태그를 사용하면 CSP를 조정하고 사이트에 미치는 영향을 빠르게 확인할 수 있습니다. 하지만:
    - 나중에 CSP를 프로덕션에 배포할 때 HTTP 헤더로 설정하는 것이 좋습니다.
    - 보고서 전용 모드에서 CSP를 설정하려면 헤더로 설정해야 합니다. CSP 메타 태그는 보고서 전용 모드를 지원하지 않습니다.

<span id="nonce-based-csp"></span>

{% Details %}

{% DetailsSummary %} 옵션 A: 임시값 기반 CSP {% endDetailsSummary %}

애플리케이션에서 다음 `Content-Security-Policy` HTTP 응답 헤더를 설정합니다.

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

{% Aside 'caution' %}

`{RANDOM}` 자리 표시자를 **모든 서버 응답에서** *랜덤*으로 생성되는 임시 값으로 교체합니다. {% endAside %}

#### CSP에 대한 임시값 생성

임시값은 페이지 로드당 한 번만 사용되는 임의의 숫자입니다. 임시값 기반 CSP는 공격자가 임시값을 **추측할 수 없는** 경우에만 XSS를 완화할 수 있습니다. CSP의 임시값은 다음과 같아야 합니다.

- 암호학적으로 **강력한 랜** 값(이상적으로는 길이 128비트 이상)
- **모든 응답에 대해** 새로 생성됨
- Base64 인코딩

다음은 서버 측 프레임워크에서 CSP 임시값을 추가하는 방법에 대한 몇 가지 예입니다.

- [Django (python)](https://django-csp.readthedocs.io/en/latest/nonce.html)
- Express (JavaScript):

```javascript
const app = express();
app.get('/', function(request, response) {
    // 모든 응답에 대해 새로운 랜덤 임시값 생성.
    const nonce = crypto.randomBytes(16).toString("base64");
    // 엄격한 임시값 기나 CSP 응답 헤더 설정
    const csp = `script-src 'nonce-${nonce}' 'strict-dynamic' https:; object-src 'none'; base-uri 'none';`;
    response.set("Content-Security-Policy", csp);
    // 애플리케이션의 모든 <script> 태그는 이 값에 `임시` 속성을 설정해야 합니다.
    response.render(template, { nonce: nonce });
  });
}
```

#### `<script>` 요소에 `nonce` 속성 추가

임시값 기반 CSP를 사용하면 모든 `<script>` 요소는 CSP 헤더(모든 스크립트는 동일한 임시값을 가질 수 있음)에 지정된 랜덤 임시 값과 맞는 `nonce` 속성이 있어야 합니다. 첫 번째 단계는 이러한 속성을 모든 스크립트에 추가하는 것입니다.

{% Compare 'worse', 'Blocked by CSP'%}

```html
<script src="/path/to/script.js"></script>
<script>foo()</script>
```

{% CompareCaption %} CSP는 이러한 스크립트에 `nonce` 속성이 없기 때문에 차단합니다. {% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<script nonce="${NONCE}" src="/path/to/script.js"></script>
<script nonce="${NONCE}">foo()</script>
```

{% CompareCaption %} `${NONCE}`가 CSP 응답 헤더의 임시값과 일치하는 값으로 대체되는 경우 이러한 스크립트의 실행을 허용합니다. 일부 브라우저는 페이지 소스를 검사할 때 `nonce` 속성을 숨깁니다. {% endCompareCaption %}

{% endCompare %}

{% Aside 'gotchas' %} CSP에서 `'strict-dynamic'` 을 사용하면 초기 HTML 응답에 있는 `<script>` 태그를 추가해야 합니다. `'strict-dynamic'` 은 이미 신뢰할 수 있는 안전한 스크립트에 의해 로드된 한 페이지에 동적으로 추가된 스크립트의 실행을 허용합니다([사양](https://www.w3.org/TR/CSP3/#strict-dynamic-usage) 참조). {% endAside %}

{% endDetails %}

<span id="hash-based-csp"></span>

{% Details %}

{% DetailsSummary %} 옵션 B: 해시 기반 CSP 응답 헤더 {% endDetailsSummary %}

애플리케이션에서 다음 `Content-Security-Policy` HTTP 응답 헤더를 설정합니다.

```text
Content-Security-Policy:
  script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

여러 인라인 스크립트의 경우 구문은 `'sha256-{HASHED_INLINE_SCRIPT_1}' 'sha256-{HASHED_INLINE_SCRIPT_2}'`입니다.

{% Aside 'caution' %} `{HASHED_INLINE_SCRIPT}` 자리 표시자는 다른 스크립트를 로드하는 데 사용할 수 있는 인라인 스크립트의 base64로 인코딩된 SHA-256 해시로 바꿔야 합니다(다음 섹션 참조). 이 [도구](https://strict-csp-codelab.glitch.me/csp_sha256_util.html)로 `<script>` 블록의 SHA 해시를 계산할 수 있습니다. 대안은 차단된 스크립트의 해시가 포함된 Chrome 개발자 콘솔의 CSP 위반 경고를 검사하고 이러한 해시를 정책에 'sha256-…'으로 추가하는 것입니다.

공격자가 삽입한 스크립트는 해시된 인라인 스크립트와 이에 의해 동적으로 추가된 스크립트만 브라우저에서 실행할 수 있으므로 브라우저에서 차단됩니다. {% endAside %}

#### 소스 스크립트를 동적으로 로드

외부에서 제공되는 모든 스크립트는 인라인 스크립트를 통해 동적으로 로드되어야 합니다. CSP 해시는 인라인 스크립트에 대해서만 브라우저에서 지원되기 때문입니다(소스 스크립트에 대한 해시는 [브라우저에서 잘 지원되지 않음](https://wpt.fyi/results/content-security-policy/script-src/script-src-sri_hash.sub.html?label=master&label=experimental&aligned)).

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/B2YsfJDYw8PRI6kJI7Bs.jpg", alt="", width="800", height="333" %}

{% Compare 'worse', 'Blocked by CSP' %}

```html
<script src="https://example.org/foo.js"></script>
<script src="https://example.org/bar.js"></script>
```

{% CompareCaption %} 인라인 스크립트만 해시될 수 있으므로 CSP는 이러한 스크립트를 차단합니다. {% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<script>
var scripts = [ 'https://example.org/foo.js', 'https://example.org/bar.js'];
scripts.forEach(function(scriptUrl) {
  var s = document.createElement('script');
  s.src = scriptUrl;
  s.async = false; // 실행 순서 유지를 위함
  document.head.appendChild(s);
});
</script>
```

{% CompareCaption %} 이 스크립트의 실행을 허용하려면 인라인 스크립트의 해시를 계산하고 CSP 응답 헤더에 추가하여 `{HASHED_INLINE_SCRIPT}` 자리 표시자를 대체해야 합니다. 해시 양을 줄이기 위해 모든 인라인 스크립트를 선택적으로 단일 스크립트로 병합할 수 있습니다. 이 작업을 확인하려면 [예제](https://strict-csp-codelab.glitch.me/solution_hash_csp#)를 확인하고 [코드](https://glitch.com/edit/#!/strict-csp-codelab?path=demo%2Fsolution_hash_csp.html%3A1%3A)를 검사하세요. {% endCompareCaption %}

{% endCompare %}

{% Aside 'gotchas' %} 인라인 스크립트에 대한 CSP 해시를 계산할 때 `<script>` 태그를 열고 닫는 사이의 공백 문자가 중요합니다. 이 [도구를](https://strict-csp-codelab.glitch.me/csp_sha256_util.html) 사용하여 인라인 스크립트에 대한 CSP 해시를 계산할 수 있습니다. {% endAside %}

{% Details %}

{% DetailsSummary %} `async = false` 및 스크립트 로딩 `async = false`는 이 경우에 차단되지 않지만 주의해서 사용하세요. {% endDetailsSummary %}

위의 코드 조각에 bar 전에 foo가 실행되도록 하기 위해`s.async = false`가 추가되었습니다(bar가 먼저 로드되더라도). <strong data-md-type="double_emphasis">이 스니펫에서 `s.async = false`는 스크립트가 로드되는 동안 파서를 차단하지 않습니다</strong> . 스크립트가 동적으로 추가되기 때문입니다. `async` 스크립트에 대해 동작하는 것처럼 파서는 스크립트가 실행될 때만 중지됩니다. 그러나 이 스니펫을 사용할 때는 다음 사항에 유의하세요.

- 문서 다운로드가 완료되기 전에 스크립트 중 하나/둘 모두가 실행될 수 있습니다. 스크립트가 실행될 때 문서가 준비되도록 하려면 스크립트를 추가하기 전에 [`DOMContentLoaded` 이벤트](https://developer.mozilla.org/docs/Web/API/Window/DOMContentLoaded_event)를 기다려야 합니다. 이로 인해 성능 문제가 발생하는 경우(스크립트가 충분히 일찍 다운로드를 시작하지 않기 때문에) 이 페이지에서 [preload 태그](https://developer.mozilla.org/docs/Web/HTML/Preloading_content)를 먼저 사용할 수 있습니다.
- `defer = true`는 아무 것도 하지 않습니다. 해당 동작이 필요한 경우 스크립트를 실행하려는 시간에 수동으로 실행해야 합니다. {% endDetails %}

{% endDetails %}

### 3단계: HTML 템플릿 및 클라이언트 측 코드를 리팩터링하여 CSP와 호환되지 않는 패턴 제거

인라인 이벤트 핸들러(예: `onclick="…"` , `onerror="…"` ) 및 JavaScript URI( `<a href="javascript:…">` )를 사용하여 스크립트를 실행할 수 있습니다. 이는 XSS 버그를 발견한 공격자가 이러한 종류의 HTML을 삽입하고 악성 JavaScript를 실행할 수 있음을 의미합니다. 임시값 또는 해시 기반 CSP는 이러한 마크업의 사용을 허용하지 않습니다. 사이트에서 위에 설명된 패턴을 사용하는 경우 더 안전한 대안으로 리팩토링해야 합니다.

이전 단계에서 CSP를 활성화한 경우 CSP가 호환되지 않는 패턴을 차단할 때마다 콘솔에서 CSP 위반을 볼 수 있습니다.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/mRWfNxAhQXzInOLCgtv8.jpg", alt="Chrome 개발자 콘솔의 CSP 위반 보고서", width="800", height="235" %}

대부분의 경우 수정은 간단합니다.

#### 인라인 이벤트 핸들러를 리팩토링하려면 JavaScript 블록에서 추가되도록 다시 작성하십시오

{% Compare 'worse', 'Blocked by CSP' %}

```html
<span onclick="doThings();">A thing.</span>
```

{% CompareCaption %} CSP는 인라인 이벤트 핸들러를 차단합니다. {% endCompareCaption%}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<span id="things">A thing.</span>
<script nonce="${nonce}">
  document.getElementById('things')
          .addEventListener('click', doThings);
</script>
```

{% CompareCaption %} CSP는 JavaScript를 통해 등록된 이벤트 핸들러를 허용합니다. {% endCompareCaption %}

{% endCompare %}

#### `javascript:` URI의 경우 유사한 패턴을 사용할 수 있습니다

{% Compare 'worse', 'Blocked by CSP' %}

```html
<a href="javascript:linkClicked()">foo</a>
```

{% CompareCaption %} CSP는 javascript: URI를 차단합니다. {% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<a id="foo">foo</a>
<script nonce="${nonce}">
  document.getElementById('foo')
          .addEventListener('click', linkClicked);
</script>
```

{% CompareCaption %} CSP는 JavaScript를 통해 등록된 이벤트 핸들러를 허용합니다. {% endCompareCaption %}

{% endCompare %}

#### JavaScript에서 `eval()` 사용

애플리케이션이 `eval()` 을 사용하여 JSON 문자열 직렬화를 JS 객체로 변환하는 경우 이러한 인스턴스를 `JSON.parse()` 로 리팩토링해야 합니다. 이 또한 [더 빠릅니다.](https://v8.dev/blog/cost-of-javascript-2019#json)

`eval()` 사용을 모두 제거할 수 없는 경우에도 엄격한 임시값 기반 CSP를 설정할 수 있지만 정책을 약간 안전하지 않게 만드는 `'unsafe-eval'` CSP 키워드를 사용해야 합니다.

이 엄격한 CSP 코드랩에서 이것과 더 많은 이러한 리팩토링 예시를 찾을 수 있습니다. {% Glitch { id: 'strict-csp-codelab', path: 'demo/solution_nonce_csp.html', Highlights: '14,20,28,39 ,40,41,42,43,44,45,54,55,56,57,58,59,60', PreviewSize: 35, allow: [] } %}

### 4단계: Safari 및 이전 브라우저를 지원하도록 대체 추가

CSP는 모든 주요 브라우저에서 지원되지만 두 가지 대체가 필요합니다.

- `'strict-dynamic'`을 사용하려면 `'strict-dynamic'`에 대한 지원이 없는 유일한 주요 브라우저인 사파리에 대한 대체로 `https:`를 추가해야 합니다.

    - `'strict-dynamic'` 을 지원하는 모든 브라우저는 `https:` 대체를 무시하므로 정책의 강도가 떨어지지 않습니다.
    - Safari에서 외부 소스 스크립트는 HTTPS 출처에서 온 경우에만 로드할 수 있습니다. 이것은 엄격한 CSP보다 안전하지 않습니다(대체입니다). 그러나 `'unsafe-inline'`이 존재하지 않거나 해시 또는 임시값이  있는 경우 무시되기 때문에 `javascript:` 주입과 같은 일반적인 XSS 원인으로부터 여전히 보호됩니다.

- 매우 오래된 브라우저 버전(4년 이상)과의 호환성을 보장하기 위해 `'unsafe-inline'` 을 대체로 추가할 수 있습니다. CSP 임시값 또는 해시가 있는 경우 모든 최신 브라우저는 `'unsafe-inline'`를 무시합니다.

```text
Content-Security-Policy:
  script-src 'nonce-{random}' 'strict-dynamic' https: 'unsafe-inline';
  object-src 'none';
  base-uri 'none';
```

{% Aside %} `https:` 및 `unsafe-inline`은 `strict-dynamic`을 지원하는 브라우저에서 무시되므로 정책을 안전하지 않게 만들지 않습니다. {% endAside %}

### 5단계: CSP 배포

로컬 개발 환경에서 CSP에 의해 차단되는 합법적인 스크립트가 없는지 확인한 후 CSP를 (스테이징 후) 프로덕션 환경에 배포할 수 있습니다.

1. `Content-Security-Policy-Report-Only` 헤더를 사용하여 보고서 전용 모드에서 CSP를 (선택적으로) 배포합니다. [보고 API](/reporting-api/)에 대해 자세히 알아보세요. 보고서 전용 모드는 실제로 CSP 제한을 적용하기 전에 프로덕션의 새 CSP와 같은 잠재적인 주요 변경 사항을 테스트하는 데 편리합니다. 보고 전용 모드에서 CSP는 애플리케이션의 동작에 영향을 주지 않습니다(실제로 중단되는 것은 없음). 그러나 브라우저는 CSP와 호환되지 않는 패턴이 발생하는 경우 콘솔 오류 및 위반 보고서를 계속 생성합니다(따라서 최종 사용자에게 어떤 문제가 발생했는지 확인할 수 있습니다).
2. CSP가 최종 사용자에게 손상을 초래하지 않을 것이라고 확신하면 `Content-Security-Policy` 응답 헤더를 사용하여 CSP를 배포합니다. **이 단계를 완료해야만 CSP가 XSS로부터 애플리케이션을 보호하기 시작합니다** . HTTP 헤더 서버 측을 통해 CSP를 설정하는 것이 `<meta>` 태그로 설정하는 것보다 더 안전합니다. 가능하면 헤더를 사용하십시오.

{% Aside 'gotchas' %} 사용 중인 CSP를 [CSP Evaluator](https://csp-evaluator.withgoogle.com) 또는 Lighthouse로 확인하여 "엄격"한지 확인하세요. 정책을 조금만 변경해도 보안이 크게 저하될 수 있으므로 이는 매우 중요합니다. {% endAside %}

{% Aside 'caution' %} 프로덕션 트래픽에 CSP를 활성화하면 브라우저 확장 프로그램 및 멀웨어로 인해 CSP 위반 보고서에 약간의 노이즈가 표시될 수 있습니다. {% endAside %}

## 제한 사항

일반적으로 엄격한 CSP는 XSS를 완화하는 데 도움이 되는 강력한 추가 보안 레이어를 제공합니다. 대부분의 경우 CSP는 공격 표면을 상당히 줄입니다(`javascript:` URI와 같은 위험한 패턴은 완전히 꺼짐). 그러나 사용 중인 CSP 유형(임시값, 해시, `'strict-dynamic'` 또는 제외)에 따라 CSP가 보호하지 않는 경우가 있습니다.

- 스크립트는 임시값이지만 본문 또는 해당 `<script>` 요소의 `src` 매개 변수에 직접 주입이 있는 경우입니다.
- 동적으로 생성된 스크립트 `document.createElement('script')` )의 위치에 주입이 있는 경우, 인수 값을 기반으로 `script` DOM 노드를 생성하는 라이브러리 함수를 포함합니다. jQuery의 `.html()`, `.get()` 및   jQuery &lt; 3.0의 `.post()`와 같은 몇 가지 일반적인 API가 포함됩니다.
- 오래된 AngularJS 애플리케이션에 템플릿 주입이 있는 경우. AngularJS 템플릿을 주입할 수 있는 공격자는 이를 사용하여  [임의의 JavaScript를 실행](https://sites.google.com/site/bughunteruniversity/nonvuln/angularjs-expression-sandbox-bypass)할 수 있습니다.
- 정책이 `'unsafe-eval'`과 `eval()`,  `setTimeout()` 및 기타 거의 사용되지 않는 API에 대한 주입을 포함하는 경우입니다.

개발자와 보안 엔지니어는 코드 검토 및 보안 감사 중에 이러한 패턴에 특히 주의해야 합니다. [이 CSP 프레젠테이션](https://static.sched.com/hosted_files/locomocosec2019/db/CSP%20-%20A%20Successful%20Mess%20Between%20Hardening%20and%20Mitigation%20%281%29.pdf#page=27)에서 위에 설명된 사례에 대한 자세한 내용을 찾을 수 있습니다.

{% Aside %} 신뢰할 수 있는 유형은 엄격한 CSP를 매우 잘 보완하며 위에 나열된 일부 제한 사항으로부터 효율적으로 보호할 수 있습니다. [web.dev](/trusted-types)에서 신뢰할 수 있는 유형을 사용하는 방법에 대해 자세히 알아보세요. {% endAside %}

## 추가 참고 자료

- [CSP는 죽었다, CSP 만세! 화이트리스트의 불안정성과 콘텐츠 보안 정책의 미래](https://research.google/pubs/pub45542/)
- [CSP 평가자](https://csp-evaluator.withgoogle.com/)
- [LocoMoco 콘퍼런스: 콘텐츠 보안 정책 - 강화와 완화 사이의 성공적인 혼란](https://static.sched.com/hosted_files/locomocosec2019/db/CSP%20-%20A%20Successful%20Mess%20Between%20Hardening%20and%20Mitigation%20%281%29.pdf)
- [Google I/O 토크: 최신 플랫폼 기능으로 웹 앱 보호](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf)
