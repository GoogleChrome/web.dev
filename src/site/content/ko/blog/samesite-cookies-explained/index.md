---
title: SameSite 쿠키 설명
subhead: 사이트 간 쿠키를 명시적으로 표시하는 방법을 학습하여 사이트를 보호하세요.
authors:
  - rowan_m
date: 2019-05-07
updated: 2020-05-28
hero: image/admin/UTOC41rgCccAqVNbJlyK.jpg
description: SameSite 속성을 사용하여 자사 및 타사 사용을 위해 쿠키를 표시하는 방법을 알아보세요. SameSite의 Lax 및 Strict 값을 사용하여 CSRF 공격에 대한 보호를 개선함으로써 사이트의 보안을 강화할 수 있습니다. 새로운 None 특성을 지정하면 사이트 간 사용을 위해 쿠키를 명시적으로 표시할 수 있습니다.
tags:
  - blog
  - security
  - cookies
  # - chrome80
feedback:
  - API
---

{% Aside %} 이 문서는 `SameSite` 쿠키 특성 변경에 관한 시리즈의 일부입니다.

- [SameSite 쿠키 설명](/samesite-cookies-explained/)
- [SameSite 쿠키 레시피](/samesite-cookie-recipes/)
- [계획적인 Same-Site](/schemeful-samesite) {% endAside %}

쿠키는 웹 사이트에 영구적 상태를 추가하는 데 사용할 수 있는 방법 중 하나입니다. 수년에 걸쳐 쿠키의 기능은 성장하고 발전했지만 몇 가지 고질적인 문제가 있는 플랫폼으로 남아 있습니다. 이 문제를 해결하기 위해 브라우저(Chrome, Firefox 및 Edge 포함)는 개인 정보의 보호 수준을 높이는 기본값을 적용하도록 동작을 변경하고 있습니다.

각 쿠키는 해당 쿠키가 사용되는 시기와 위치를 제어하는 여러 특성을 가지고 있는 `key=value` 쌍입니다. 아마도 만료 날짜를 설정하거나 쿠키가 HTTPS를 통해서만 전송되어야 함을 나타내는 데 이미 이러한 특성을 사용했을 것으로 생각합니다. 서버는 응답에 `Set-Cookie`라는 잘 어울리는 이름의 헤더를 전송하여 쿠키를 설정합니다. 자세한 내용은 [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1)에서 알아볼 수 있지만 지금은 여기서는 간단히 복습할 수 있습니다.

사용자에게 "새로운 기능" 프로모션을 표시하려는 블로그가 있다고 가정해 보겠습니다. 사용자는 프로모션을 닫을 수 있고, 그러면 잠시 동안 다시 볼 수 없을 것입니다. 해당 기본 설정을 쿠키에 저장하고, 한 달(2,600,000초) 후에 만료되도록 설정하고, HTTPS를 통해서만 보낼 수 있습니다. 해당 헤더는 다음과 같습니다.

```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jJ1fqcsAk9Ig3hManFBO.png", alt="3개의 쿠키가 응답으로 서버에서 브라우저로 전송되고 있습니다", width="800", height="276", style="max-width: 60vw" %}<figcaption class="w-figcaption"> 서버는 <code>Set-Cookie</code> 헤더를 사용하여 쿠키를 설정합니다.</figcaption></figure>

독자가 이러한 요구 사항을 충족하는 페이지를 볼 때, 즉 보안 연결에 있고 쿠키가 한 달 미만인 경우 브라우저는 요청에 다음 헤더를 보냅니다.

```text
Cookie: promo_shown=1
```

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Rq21WQpOZFvfgS9bbjmc.png", alt="요청에 브라우저에서 서버로 3개의 쿠키를 보내는 중", width="800", height="165", style="max-width: 60vw" %}<figcaption class="w-figcaption"> 귀하의 브라우저에서 <code>Cookie</code> 헤더에 쿠키를 다시 보냅니다.</figcaption></figure>

`document.cookie`를 사용하여 JavaScript에서 해당 사이트에 사용할 수 있는 쿠키를 추가하고 읽을 수도 있습니다. `document.cookie`에 할당을 하면 해당 키를 포함한 쿠키가 생성되거나 재정의됩니다. 예를 들어 브라우저의 JavaScript 콘솔에서 다음을 시도할 수 있습니다.

```text
> document.cookie = "promo_shown=1; Max-Age=2600000; Secure"
< "promo_shown=1; Max-Age=2600000; Secure"
```

`document.cookie`를 읽으면 현재 컨텍스트에서 액세스할 수 있는 모든 쿠키가 출력되며 각 쿠키는 세미콜론으로 구분됩니다.

```text
> document.cookie;
< "promo_shown=1; color_theme=peachpuff; sidebar_loc=left"
```

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mbV00Gy5VAPTUls0i7cM.png", alt="브라우저 내에서 쿠키에 액세스하는 JavaScript", width="600", height="382", style="max-width: 35vw" %}<figcaption class="w-figcaption"> JavaScript는 <code>document.cookie</code>를 사용하여 쿠키에 액세스할 수 있습니다.</figcaption></figure>

인기 있는 사이트에서 이 기능을 시도하면 대부분이 3개 이상의 쿠키를 설정한다는 것을 알 수 있을 것입니다. 대부분의 경우 이러한 쿠키는 해당 도메인에 대한 각각의 요청에 대해 전송되며 이는 여러 의미를 갖습니다. 사용자에 대해 업로드 대역폭은 다운로드보다 제한적인 경우가 많으므로 모든 아웃바운드 요청에 대한 오버헤드로 인해 첫 바이트까지의 시간이 지연됩니다. 설정하는 쿠키의 수와 크기에서 보수적 입장을 유지하세요. `Max-Age` 특성을 사용하여 쿠키가 필요 이상으로 오래 유지되지 않도록 하세요.

## 자사 및 타사 쿠키란 무엇입니까?

이전에 보았던 동일한 사이트로 돌아가면 현재 방문 중인 도메인뿐만 아니라 다양한 도메인에 대한 쿠키가 있음을 알 수 있습니다. 현재 사이트의 도메인, 즉 브라우저의 주소 표시줄에 표시되는 도메인과 일치하는 쿠키를 **자사** 쿠키라고 합니다. 마찬가지로 현재 사이트가 아닌 다른 도메인의 쿠키를 **타사** 쿠키라고 합니다. 이것은 절대적인 레이블은 아니며 사용자의 컨텍스트에 상대적입니다. 동일한 쿠키가 사용자가 당시 어느 사이트에 있는 지에 따라 자사 또는 타사가 될 수 있습니다.

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zjXpDz2jAdXMT83Nm3IT.png", alt="같은 페이지의 서로 다른 요청에서 브라우저로 3개의 쿠키가 전송되고 있습니다", width="800", height="346", style="max-width: 60vw" %} <figcaption class="w-figcaption"> 쿠키는 한 페이지의 다양한 도메인에서 제공될 수 있습니다. </figcaption></figure>

위의 예를 계속 이어가 보면, 블로그 게시물 중 하나에 정말 멋진 고양이 사진이 있고 `/blog/img/amazing-cat.png`에서 호스팅된다고 가정해 보겠습니다. 이미지가 너무 멋져서 다른 사람이 자신의 사이트에 이 이미지를 직접 사용합니다. 방문자가 귀하의 블로그에 방문했고 `promo_shown` 쿠키가 있는 경우 다른 사람의 사이트에서 `amazing-cat.png`를 볼 때 이미지에 대한 이 요청에서 해당 쿠키가 **전송됩니다**. 이것이 누구에게나 특별하게 유용하지는 않은데, `promo_shown`은 이 다른 사람의 사이트에서 아무 것에도 사용되지 않고 단순히 요청에 오버헤드만 가중시킬뿐이기 때문입니다.

이것이 의도하지 않은 결과라면 그렇게 할 이유가 있을까요? 사이트가 타사 컨텍스트에서 사용될 때 상태를 유지할 수 있도록 하는 것이 바로 이 메커니즘입니다. 예를 들어, 사이트에 YouTube 동영상을 삽입하면 방문자의 플레이어에 "나중에 보기" 옵션이 표시됩니다. 방문자가 이미 YouTube에 로그인되어 있는 경우 해당 세션은 타사 쿠키에 의해 내장 플레이어에서 제공되고 있는 것입니다. 즉, "나중에 보기" 버튼을 누르면 로그인하거나 페이지에서 다른 곳으로 이동했다가 다시 YouTube로 이동할 필요 없이 한 번에 동영상을 저장할 것입니다.

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/u9chHBLm3i27yFRwHx5W.png", alt="같은 쿠키가 세 가지 다른 컨텍스트로 전송 중입니다", width="800", height="433", style="max-width: 60vw" %} <figcaption class="w-figcaption"> 타사 컨텍스트의 쿠키는 다른 페이지를 방문할 때 전송됩니다. </figcaption></figure>

웹의 문화적 속성 중 하나는 기본적으로 열려 있는 경향이 있다는 것입니다. 바로 이러한 부분 때문에 많은 사람들이 이곳에서 자신의 콘텐츠와 앱을 만들 수 있는 것입니다. 그러나 이로 인해 많은 보안 및 개인정보보호 문제도 대두됩니다. 사이트 간 요청 위조(CSRF) 공격은 누가 요청을 시작했는 지에 관계없이 쿠키가 지정된 출처에 대한 모든 요청에 첨부된다는 사실을 악용한 것입니다. 예를 들어, `evil.example`를 방문한다면 `your-blog.example`에 대한 요청이 트리거될 수 있고 브라우저는 기꺼이 관련 쿠키를 첨부할 것입니다. 여러분의 블로그가 이러한 요청을 검증하는 방식에 주의를 기울이지 않는다면 `evil.example`이 게시물을 삭제하거나 자체 콘텐츠를 추가하는 등의 작업을 트리거할 수 있습니다.

또한 사용자들은 여러 사이트에서 자신들의 활동을 추적하는 데 쿠키가 어떻게 이용될 수 있는 지에 대해 더 민감해지고 있습니다. 그러나 지금까지 쿠키와 관련하여 자신의 의도를 명시적으로 나타낼 방법은 없었습니다. `promo_shown` 쿠키는 자사 컨텍스트에서만 전송되어야 하는 반면, 다른 사이트에 포함되는 위젯을 위한 세션 쿠키는 타사 컨텍스트에서 로그인 상태를 제공하기 위해 의도적으로 존재합니다.

## `SameSite` 특성을 사용하여 쿠키 사용을 명시적으로 선언

`SameSite` 특성([RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00)에 정의됨)을 도입하면 쿠키를 자사 또는 동일 사이트 컨텍스트로 제한해야 하는지 여부를 선언할 수 있습니다. 여기서 '사이트'가 의미하는 바를 정확히 이해하면 도움이 됩니다. 사이트는 도메인 접미사와 바로 앞의 도메인 부분이 결합된 것입니다. 예를 들어 `www.web.dev` 도메인은 `web.dev` 사이트의 일부입니다.

{% Aside 'key-term' %}

사용자가 `www.web.dev`에 있고 `static.web.dev`에서 이미지를 요청하는 경우, 이것은 **same-site** 요청입니다.

{% endAside %}

[공개 접미사 목록](https://publicsuffix.org/)이 이것을 정의하므로 여기에는 `.com`과 같은 최상위 도메인뿐만 아니라 `github.io`와 같은 서비스도 포함합니다. 이를 통해 `your-project.github.io`와 `my-project.github.io`를 별도의 사이트로 간주할 수 있습니다.

{% Aside 'key-term' %}

사용자가 `your-project.github.io`에 있고 `my-project.github.io`에서 이미지를 요청하는 경우, 이것은 **사이트 간** 요청입니다.

{% endAside %}

쿠키에 대한 `SameSite` 특성을 도입하면 이 동작을 제어하는 세 가지 방법이 제공됩니다. 특성을 지정하지 않도록 선택하거나 `Strict` 또는 `Lax`를 사용하여 쿠키를 same-site 요청으로 제한할 수 있습니다.

`SameSite`를 `Strict`으로 설정하면 쿠키가 자사 컨텍스트에서만 전송됩니다. 사용자 측면에서 쿠키는 해당 사이트가 현재 브라우저의 URL 표시줄에 표시된 사이트와 일치하는 경우에만 전송됩니다. 따라서 `promo_shown` 쿠키가 다음과 같이 설정된 경우:

```text
Set-Cookie: promo_shown=1; SameSite=Strict
```

사용자가 여러분의 사이트에 있으면 예상대로 요청과 함께 쿠키가 전송됩니다. 그러나 다른 사이트에서 또는 친구의 이메일을 통해 여러분의 사이트로 연결되는 링크를 따라가는 경우, 이 초기 요청 시 쿠키가 전송되지 않습니다. 비밀번호 변경 또는 구매와 같이 초기 탐색 시에 항상 작동하는 기능과 관련된 쿠키가 있는 경우에는 이러한 동작이 유용하지만 `promo_shown`에는 너무 제한적입니다. 독자가 이 링크를 따라 사이트로 들어올 때는 기본 설정을 적용할 수 있도록 쿠키가 전송되기를 원합니다.

이러한 최상위 탐색과 함께 쿠키를 보낼 수 있게 하는 `SameSite=Lax`가 바로 이 경우에 도움을 줍니다. 다른 사이트에서 여러분의 콘텐츠를 참조하는 위의 고양이 기사의 예를 다시 살펴보겠습니다. 그들은 고양이 사진을 직접 사용하고 원본 기사에 대한 링크를 제공합니다.

```html
<p>Look at this amazing cat!</p>
<img src="https://blog.example/blog/img/amazing-cat.png" />
<p>Read the <a href="https://blog.example/blog/cat.html">article</a>.</p>
```

그리고 쿠키는 다음과 같이 설정되었습니다.

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

독자가 다른 사람의 블로그에 있을 때 브라우저가 `amazing-cat.png`를 요청하면 쿠키가 **전송되지 않습니다**. 그러나 독자가 블로그의 `cat.html` 링크를 따라가면 해당 요청에 쿠키가 **포함됩니다.** 따라서 `Lax`는 사이트 표시에 영향을 미치는 쿠키에 좋은 선택이고, `Strict`는 사용자가 수행하는 작업과 관련된 쿠키에 유용합니다.

{% Aside 'caution' %}

`Strict`과 `Lax` 모두 사이트 보안을 위한 완벽한 솔루션은 아닙니다. 쿠키는 사용자 요청의 일부로 전송되며 다른 사용자 입력과 동일하게 취급해야 합니다. 즉, 입력을 적절하게 검열하고 유효성을 확인해야 한다는 것입니다. 서버 측 기밀로 간주되는 데이터를 저장하는 데 절대 쿠키를 사용하지 마세요.

{% endAside %}

마지막으로, 이전에 모든 컨텍스트에서 쿠키가 전송되기를 원한다는 사실을 암시적으로 명시하는 방식으로서, 값을 지정하지 않는 방법이 있습니다. [RFC6265bis](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03)의 최신 초안에서는 `SameSite=None`의 새 값을 도입하여 이 부분을 명시적으로 나타냅니다. 즉, `None`을 사용하여 의도적으로 타자 컨텍스트에서 쿠키가 전송되기를 원한다는 사실을 명확하게 전달할 수 있습니다.

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1MhNdg9exp0rKnHpwCWT.png", alt="해당 컨텍스트에 따라 세 가지 쿠키에 None, Lax 또는 Strict의 레이블이 붙습니다", width="800", height="456", style="max-width: 60vw" %} <figcaption class="w-figcaption"> 쿠키의 컨텍스트를 <code>None</code>, <code>Lax</code> 또는 <code>Strict</code>으로 명시적으로 나타냅니다. </figcaption></figure>

{% Aside %}

위젯, 포함된 콘텐츠, 제휴 프로그램, 광고 또는 여러 사이트에 걸친 로그인과 같이 다른 사이트에서 소비하는 서비스를 제공하는 경우, 의도를 명확하게 하기 위해 `None`을 사용해야 합니다.

{% endAside %}

## SameSite가 없는 기본 동작으로 변경

`SameSite` 특성은 널리 지원되지만 많은 개발자들이 채택하고 있지는 않습니다. 쿠키를 전송하는 것이 너무나 일반화되어 있어서 모든 사용 사례가 작동하지만, 이것은 또한 사용자가 CSRF 및 의도하지 않은 정보 누출에 취약하다는 것을 의미합니다. 개발자가 의도를 드러내고 사용자에게 더 안전한 경험을 제공하도록 장려하기 위해 IETF에서 제안한 [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00)는 두 가지 주요 변경을 제시하고 있습니다.

- `SameSite` 특성이 없는 쿠키는 `SameSite=Lax`로 처리됩니다.
- `SameSite=None`을 포함한 쿠키는 `Secure`도 지정해야 합니다. 즉, 보안 컨텍스트가 필요합니다.

Chrome은 버전 84부터 이 기본 동작을 구현합니다. [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ)는 Firefox 69부터 테스트 버전을 제공하고 있으며 향후 기본 동작으로 만들 것입니다. Firefox에서 이러한 동작을 테스트하려면 [`about:config`](http://kb.mozillazine.org/About:config)을 열고 `network.cookie.sameSite.laxByDefault`를 설정하세요. [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) 또한 기본 동작을 변경할 계획입니다.

{% Aside %}

추가 브라우저 지원에 대한 발표가 나오면 이 문서도 업데이트됩니다.

{% endAside %}

### `SameSite=Lax`를 기본적으로 설정

{% Compare 'worse', 'No attribute set' %}

```text
Set-Cookie: promo_shown=1
```

{% CompareCaption %}

어떤 `SameSite` 특성도 지정하지 않고 쿠키를 보내면…

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Default behavior applied' %}

```text
Set-Cookie: promo_shown=1; SameSite=Lax
```

{% CompareCaption %}

브라우저는 이 쿠키를 `SameSite=Lax`가 지정된 것처럼 처리합니다.

{% endCompareCaption %}

{% endCompare %}

이는 보다 안전한 기본값을 적용하려는 것이지만 브라우저에서 자체적으로 적용해주기를 바라기 보다는 `SameSite` 특성을 명시적으로 설정하는 것이 바람직합니다. 그러면 쿠키에 대한 의도가 명확해지고 여러 브라우저에서 일관된 경험을 할 수 있을 가능성이 높아집니다.

{% Aside 'caution' %}

Chrome에서 적용하는 기본 동작은 명시적 `SameSite=Lax`보다 약간 더 관대한데, 특정 쿠키가 최상위 POST 요청에서 전송되도록 허용하기 때문입니다. [blink-dev 공지](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/YKBxPCScCwAJ)에서 정확한 세부 내용을 확인할 수 있습니다. 이것은 임시 방편으로 마련된 것이므로 `SameSite=None; Secure`을 사용하도록 사이트 간 쿠키를 수정할 필요성은 여전히 있습니다.

{% endAside %}

### `SameSite=None`은 안전해야 합니다

{% Compare 'worse', 'Rejected' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None
```

{% CompareCaption %}

`Secure` 없이 쿠키를 설정하면 **거부됩니다**.

{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Accepted' %}

```text
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

{% CompareCaption %}

`SameSite=None`을 `Secure` 특성과 쌍으로 구성해야 합니다.

{% endCompareCaption %}

{% endCompare %}

`about://flags/#cookies-without-same-site-must-be-secure`를 활성화하여 Chrome 76부터 이 동작을 테스트할 수 있으며 Firefox 69부터는 [`about:config`](http://kb.mozillazine.org/About:config)에서 `network.cookie.sameSite.noneRequiresSecure`를 설정하면 됩니다.

새 쿠키를 설정할 때 이를 적용하고 만료일이 다가오지 않았더라도 기존 쿠키를 새로 고칠 수 있습니다.

{% Aside 'note' %}

사이트에서 타사 콘텐츠를 제공하는 서비스를 이용하는 경우 해당 서비스를 업데이트하고 있는지 공급자에게도 확인해야 합니다. 사이트에서 새 동작이 적용되도록 종속성 또는 스니펫을 업데이트해야 할 수도 있습니다.

{% endAside %}

이러한 변경 사항은 이전 버전의 `SameSite` 특성을 올바르게 구현한 브라우저와 하위 호환되며, 그렇지 않으면 전혀 지원하지 않습니다. 쿠키에 이러한 변경 사항을 적용하면 브라우저의 기본 동작에 의존하지 않고 쿠키의 용도를 명시적으로 나타낼 수 있습니다. 마찬가지로, 아직까지 `SameSite=None`을 인식하지 못하는 클라이언트는 이를 무시하고 특성이 설정되지 않은 것처럼 계속 작동하게 됩니다.

{% Aside 'warning' %}

Chrome, Safari 및 UC 브라우저를 비롯한 이전 버전의 여러 브라우저는 새로운 `None` 특성과 호환되지 않으며 쿠키를 무시하거나 제한할 수 있습니다. 이 동작은 현재 버전에서 수정되었지만 트래픽을 확인하여 영향을 받는 사용자의 비율을 파악해야 합니다. [Chromium 사이트에서 알려진 비호환 클라이언트 목록](https://www.chromium.org/updates/same-site/incompatible-clients)을 찾아볼 수 있습니다.

{% endAside %}

## `SameSite` 쿠키 레시피

`SameSite=None`에 대한 이러한 변경 사항과 브라우저 동작의 차이를 성공적으로 처리하도록 쿠키를 업데이트하는 방법에 대한 자세한 내용은 후속 게시물, [SameSite 쿠키 레시피](/samesite-cookie-recipes)를 참조하세요.

*Lily Chen, Malte Ubl, Mike West, Rob Dodson, Tom Steiner, Vivek Sekhar의 기여와 피드백에 감사드립니다.*

*[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)의 [Pille-Riin Priske](https://unsplash.com/photos/UiP3uF5JRWM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)가 제공한 쿠키 영웅 이미지*
