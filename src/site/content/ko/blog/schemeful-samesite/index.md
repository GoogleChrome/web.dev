---
layout: post
title: Schemeful 동일 사이트
subhead: '"동일 사이트"의 정의는 URL 체계를 포함하도록 진화하고 있습니다. 따라서 사이트의 HTTP와 HTTPS 버전 간의 링크는 이제 크로스 사이트 요청으로 계산됩니다. 가능한 한 문제를 방지하기 위해 기본적으로 HTTPS로 업그레이드하거나 어떤 SameSite 속성 값이 필요한지에 대한 자세한 내용을 계속 읽어보세요.'
description: '"동일 사이트"의 정의는 URL 체계를 포함하도록 진화하고 있습니다. 따라서 사이트의 HTTP와 HTTPS 버전 간의 링크는 이제 크로스 사이트 요청으로 계산됩니다. 가능한 한 문제를 방지하기 위해 기본적으로 HTTPS로 업그레이드하거나 어떤 SameSite 속성 값이 필요한지에 대한 자세한 내용을 계속 읽어보세요.'
authors:
  - bingler
  - rowan_m
date: 2020-11-20
hero: image/admin/UMxBPy0AKAfbzxwgTroV.jpg
thumbnail: image/admin/3J33n1o98vnkO6fdDFwP.jpg
alt: 두 접시에 따로 담긴 쿠키. 접시는 서로 다른 체계, HTTP 및 HTTPS를 나타냅니다. 쿠키는 쿠키를 나타냅니다.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside %} 이 문서는 `SameSite` 쿠키 특성 변경에 관한 시리즈의 일부입니다.

- [SameSite 쿠키 설명](/samesite-cookies-explained/)
- [SameSite 쿠키 레시피](/samesite-cookie-recipes/)
- [Schemeful 동일 사이트](/schemeful-samesite) {% endAside %}

[Schemeful 동일 사이트](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.3)는 웹(사이트)의 정의를 등록 가능한 도메인에서 Scheme + 등록 가능한 도메인으로 바꿔놓습니다. ["동일 사이트" 및 "동일 출처" 이해하기](/same-site-same-origin/#%22schemeful-same-site%22)에서 자세한 내용과 예를 찾아볼 수 있습니다.

{% Aside 'key-term' %} 다시 말하면, 사이트의 안전하지 않은 HTTP 버전(예를 들어, **http**://website.example)과 해당 사이트의 보안 HTTPS 버전(예를 들어, **https**://website.example)이 이제 각 사이트에 대해 **크로스 사이트**로 간주됩니다. {% endAside %}

좋은 소식은 웹사이트가 이미 HTTPS로 완전히 업그레이드되었다면 아무것도 시경 쓸 필요가 없다는 것입니다. 바뀌는 것은 아무것도 없습니다.

아직 웹사이트를 완전히 업그레이드하지 않았다면 최우선적으로 그렇게 해야 합니다. 그러나 사이트 방문자가 HTTP와 HTTPS 사이를 전환하는 경우가 있다면 이러한 일반적인 일부 시나리오와 관련된 `SameSite` 쿠키 동작을 아래에 요약했으니 참고하세요.

{% Aside 'warning' %} 장기적 계획은 [타사 쿠키에 대한 지원을 완전히 단계적으로 중단하고](https://blog.chromium.org/2020/10/progress-on-privacy-sandbox-and.html) 개인정보를 보호하는 대체 방법으로 전환하는 것입니다. 쿠키에서 `SameSite=None; Secure`를 설정하여 scheme 사이에 이를 전송할 수 있도록 하는 방법은 완전한 HTTPS로의 마이그레이션을 앞두고 임시적으로 채택할 수 있는 솔루션으로 생각해야 합니다. {% endAside %}

Chrome과 Firefox 모두에서 테스트를 위해 이러한 변경을 활성화할 수 있습니다.

- Chrome 86에서 `about://flags/#schemeful-same-site`를 활성화합니다. [Chrome 상태 페이지](https://chromestatus.com/feature/5096179480133632)에서 진행 상황을 추적합니다.
- Firefox 79에서는 `about:config`를 통해 `network.cookie.sameSite.schemeful`을 `true`로 설정합니다. [Bugzilla 이슈](https://bugzilla.mozilla.org/show_bug.cgi?id=1651119)를 통해 진행 상황을 추적하세요.

`SameSite=Lax`를 쿠키의 기본값으로 변경하려는 주요 이유 중 하나는 [CSRF(Cross-Site Request Forgery)](https://developer.mozilla.org/docs/Glossary/CSRF)로부터 보호하기 위한 것이었습니다. 그러나 안전하지 않은 HTTP 트래픽은 여전히 네트워크 공격자가 쿠키를 변조한 다음 사이트의 보안 HTTPS 버전에서 이를 사용할 수 있는 기회를 제공합니다. Scheme 사이에서 이러한 추가적인 크로스 사이트 경계를 생성하면 이러한 공격에 대비하는 추가 방어선이 만들어집니다.

## 일반적인 크로스-Scheme 시나리오

{% Aside 'key-term' %} URL이 모두 동일한 등록 가능한 도메인(예: site.example)을 갖지만 다른 scheme(예를 들어, **http**://site.example 대 **https**://site.example)을 사용하는 아래 예와 같은 상황에서 이를 서로 간에 **크로스-scheme**이라고 합니다. {% endAside %}

### 이동

웹사이트의 크로스-scheme 버전 사이를 이동하면(예를 들어, **http**://site.example에서 **https**://site.example로 연결) 이전에는 `SameSite=Strict` 쿠키를 보낼 수 있었습니다. 이것은 현재 크로스 사이트 이동으로 취급되어 `SameSite=Strict` 쿠키가 차단됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yDViqKg9eeEeAEiCNqe4.png", alt="사이트의 안전하지 않은 HTTP 버전에서 안전한 HTTPS 버전으로 연결되는 링크를 따라가면 크로스-scheme 이동이 트리거됩니다. SameSite=Strick 쿠키 차단됨, SameSite=Lax 및 SameSite=None; 보안 쿠키는 허용됩니다.", width="800", height="342" %}<figcaption> HTTP에서 HTTPS로의 크로스-scheme 이동.</figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP → HTTPS</strong>
   </td>
   <td>
<strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ 차단됨</td>
   <td>⛔ 차단됨</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>✓ 허용됨</td>
   <td>✓ 허용됨</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓ 허용됨</td>
   <td>⛔ 차단됨</td>
  </tr>
</table>

### 하위 리소스 로딩

{% Aside 'warning' %} 모든 주요 브라우저는 스크립트 또는 iframe과 같은 [활성 혼합 콘텐츠](https://developer.mozilla.org/docs/Web/Security/Mixed_content)를 차단합니다. 또한 [Chrome](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html) 및 [Firefox](https://groups.google.com/g/mozilla.dev.platform/c/F163Jz32oYY)를 포함한 브라우저는 수동 혼합 콘텐츠를 업그레이드하거나 차단하는 방향으로 가고 있습니다. {% endAside %}

여기서의 변경 사항은 완전한 HTTPS로 업그레이드하는 과정을 진행하는 동안 임시 해결책으로만 간주해야 합니다.

하위 리소스의 예로는 이미지, iframe 및 XHR 또는 Fetch를 사용한 네트워크 요청이 있습니다.

페이지에 크로스-scheme 하위 리소스를 로드하면 이전에는 `SameSite=Strict` 또는 `SameSite=Lax` 쿠키를 보내거나 설정할 수 있었습니다. 이제 이것은 다른 타사 또는 크로스 사이트 하위 리소스와 동일한 방식으로 처리됩니다. 즉, `SameSite=Strict` 또는 `SameSite=Lax` 쿠키가 차단됩니다.

또한 브라우저가 보안되지 않은 scheme의 리소스를 보안 페이지에 로드하도록 허용하더라도 타사 또는 크로스 사이트 쿠키에 `Secure`가 필요하므로 이러한 요청에서 모든 쿠키가 차단됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GgR6Yln1f9JGkt04exRC.png", alt="사이트의 보안 HTTPS 버전 리소스에서 발생하는 크로스-scheme 하위 리소스가 비보안 HTTP 버전에 포함됨. SameSite=Strict 및 SameSite=Lax 쿠키가 차단됨, SameSite=None; 보안 쿠키는 허용됩니다.", width="800", height="285" %}<figcaption> HTTPS를 통해 크로스-scheme 하위 리소스를 포함하는 HTTP 페이지.</figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP → HTTPS</strong>
   </td>
   <td>
<strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ 차단됨</td>
   <td>⛔ 차단됨</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>⛔ 차단됨</td>
   <td>⛔ 차단됨</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓ 허용됨</td>
   <td>⛔ 차단됨</td>
  </tr>
</table>

### 양식 게시

웹사이트의 크로스-scheme 버전 간에 게시하면 이전에는 `SameSite=Lax` 또는 `SameSite=Strict`로 설정된 쿠키가 전송될 수 있었습니다. 이제 이것은 크로스 사이트 POST로 처리됩니다. 즉, `SameSite=None` 쿠키만 보낼 수 있습니다. 기본적으로 안전하지 않은 버전을 제공하지만 로그인 또는 체크아웃 양식을 제출할 때 사용자를 보안 버전으로 업그레이드하는 사이트에서 이러한 상황이 발생할 수 있습니다.

하위 리소스와 마찬가지로 요청이 보안(예: HTTPS)에서 비보안(예: HTTP) 컨텍스트로 이동하는 경우 타사 또는 크로스 사이트 쿠키에 `Secure`가 필요하므로 이러한 요청에서 모든 쿠키가 차단됩니다.

{% Aside 'warning' %} 여기에서 가장 좋은 해결책은 양식 페이지와 대상이 모두 HTTPS와 같은 보안 연결상에 있는지 확인하는 것입니다. 이는 사용자가 양식에 민감한 정보를 입력하는 경우 특히 중요합니다. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ud9LkDeGJUWHObifD718.png", alt="사이트의 비보안 HTTP 버전 양식에서 크로스-scheme으로 양식을 제출하면 보안 HTTPS 버전으로 제출됨. SameSite=Strict 및 SameSite=Lax 쿠키 차단됨, 및 SameSite=None; 쿠키가 허용됩니다.", width="800", height="376" %}<figcaption> HTTP에서 HTTPS로 크로스-scheme 양식 제출.</figcaption></figure>

<table>
  <tr>
   <td>
   </td>
   <td>
<strong>HTTP → HTTPS</strong>
   </td>
   <td>
<strong>HTTPS → HTTP</strong>
   </td>
  </tr>
  <tr>
   <td>
<code>SameSite=Strict</code>
   </td>
   <td>⛔ 차단됨</td>
   <td>⛔ 차단됨</td>
  </tr>
  <tr>
   <td>
<code>SameSite=Lax</code>
   </td>
   <td>⛔ 차단됨</td>
   <td>⛔ 차단됨</td>
  </tr>
  <tr>
   <td>
<code>SameSite=None;Secure</code>
   </td>
   <td>✓ 허용됨</td>
   <td>⛔ 차단됨</td>
  </tr>
</table>

## 내 사이트를 테스트하려면 어떻게 해야 하나요?

개발자 도구 및 메시징은 Chrome 및 Firefox에서 사용할 수 있습니다.

Chrome 86부터 [DevTools의 Issue 탭](https://developer.chrome.com/docs/devtools/issues/)에 Schemeful Same-Site 이슈가 포함됩니다. 사이트에 대해 다음 이슈가 강조 표시되는 것을 볼 수도 있습니다.

이동 문제:

- "동일 사이트 요청에서 계속 쿠키를 보내려면 완전히 HTTPS로 마이그레이션하십시오." - 향후 Chrome 버전에서 쿠키가 **차단될 것이라는** 경고입니다.
- "동일 사이트 요청에서 쿠키를 보내려면 완전히 HTTPS로 마이그레이션하십시오." - 쿠키가 **차단되었다는** 경고입니다.

하위 리소스 로드 문제:

- "동일 사이트 하위 리소스로 계속 쿠키를 보내려면 완전히 HTTPS로 마이그레이션하십시오." 또는 "동일 사이트 하위 리소스에서 쿠키를 계속 설정하도록 하려면 완전히 HTTPS로 마이그레이션하십시오." - 향후 Chrome 버전에서 쿠키가 **차단될 것이라는** 경고입니다.
- "동일 사이트 하위 리소스로 쿠키를 보내려면 완전히 HTTPS로 마이그레이션하십시오." 또는 "동일 사이트 하위 리소스에서 쿠키를 설정할 수 있게 하려면 완전히 HTTPS로 마이그레이션하십시오." - 쿠키가 **차단되었음**을 경고합니다. 후자의 경고는 양식을 게시할 때도 나타날 수 있습니다.

자세한 내용은 [Schemeful 동일 사이트에 대한 테스트 및 디버깅 팁](https://www.chromium.org/updates/schemeful-same-site/testing-and-debugging-tips-for-schemeful-same-site)에서 확인할 수 있습니다.

Firefox 79부터 `network.cookie.sameSite.schemeful`이 `about:config`를 통해 `true`로 설정되면 콘솔에 Schemeful 동일 사이트 문제에 대한 메시지가 표시됩니다. 해당 사이트에서 다음 메시지를 볼 수도 있습니다.

- "Scheme이 일치하지 않기 때문에 쿠키 `cookie_name`은 **조만간** `http://site.example/`에 대해 크로스 사이트 쿠키로 취급됩니다."
- "Scheme이 일치하지 않기 때문에 쿠키 `cookie_name`은 `http://site.example/`에 대해 크로스 사이트로 **취급되었습니다**."

## 자주하는 질문

### 내 사이트는 이미 HTTPS에서 완전히 사용 가능합니다. 내 브라우저의 DevTools에 문제가 표시되는 이유는 무엇인가요?

일부 링크와 하위 리소스가 여전히 안전하지 않은 URL을 가리킬 수 있습니다.

이 문제를 해결하는 한 가지 방법은 [HTTP Strict-Transport-Security](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)(HSTS) 및 `includeSubDomain` 지시문을 사용하는 것입니다. HSTS + `includeSubDomain`을 사용하면 페이지 중 하나에 실수로 안전하지 않은 링크가 포함된 경우에도 브라우저가 자동으로 보안 버전을 대신 사용합니다.

### HTTPS로 업그레이드할 수 없으면 어떻게 하나요?

사용자를 보호하기 위해 사이트를 완전히 HTTPS로 업그레이드할 것을 강력히 권장하지만 스스로 할 수 없는 경우 호스팅 제공업체에 해당 옵션을 제공할 수 있는지 문의하는 것이 좋습니다. 자체 호스팅하는 경우 [Let's Encrypt](https://letsencrypt.org/)에서 인증서를 설치하고 구성할 수 있는 다양한 도구를 제공합니다. HTTPS 연결을 제공할 수 있는 CDN 또는 기타 프록시 뒤로 사이트를 이동하는 방법도 고려해볼 수 있습니다.

여전히 가능하지 않은 경우 영향을 받는 쿠키에서 `SameSite` 보호를 완화시켜 보세요.

- `SameSite=Strict` 쿠키만 차단되는 경우 보호를 `Lax`로 낮출 수 있습니다.
- `Strict` 및 `Lax` 쿠키가 모두 차단되고 쿠키가 보안 URL로 전송(또는 이로부터 설정)되는 경우 보호를 `None`으로 낮출 수 있습니다.
    - 이 해결 방법은 쿠키를 보내는(또는 쿠키를 설정하는) URL이 안전하지 않은 경우 **실패합니다**. `SameSite=None`에는 쿠키에서 `Secure` 특성이 필요하기 때문입니다. 즉, 이러한 쿠키는 안전하지 않은 연결을 통해 전송되거나 설정되지 않을 수 있습니다. 이 경우 사이트가 HTTPS로 업그레이드될 때까지 해당 쿠키에 액세스할 수 없습니다.
    - 결국 제3자 쿠키가 완전히 단계적으로 제거될 것이므로 이는 일시적이라는 점을 기억하세요.

### `SameSite` 특성을 지정하지 않은 경우 쿠키에 어떤 영향을 미치나요?

`SameSite` 특성이 없는 쿠키는 `SameSite=Lax`를 지정한 것처럼 처리되며 동일한 크로스-scheme 동작이 이러한 쿠키에도 적용됩니다. 안전하지 않은 방법에 대한 임시 예외는 계속 적용됩니다. 자세한 내용은 <a href="https://www.chromium.org/updates/same-site/faq" data-md-type="link">Chromium `SameSite`에서 Lax + POST 완화 FAQ</a>를 참조하세요.

### WebSocket은 어떤 영향을 받나요?

WebSocket 연결은 페이지와 동일한 보안성을 가진 경우 여전히 동일 사이트로 간주됩니다.

동일 사이트:

- `https://`에서 `wss://` 연결
- `http://`에서 `ws://` 연결

크로스 사이트:

- `http://`에서 `wss://` 연결
- `https://`에서 `ws://` 연결

*[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)에서 제공된 [Julissa Capdevilla](https://unsplash.com/photos/wNjgWrEXAL0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) 사진*
