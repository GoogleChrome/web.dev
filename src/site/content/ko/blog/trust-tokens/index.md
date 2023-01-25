---
title: 신뢰 토큰 시작하기
subhead: '신뢰 토큰은 웹사이트가 수동 추적 없이 사기를 방지하기 위해 한 브라우징 컨텍스트에서 다른 브라우징 컨텍스트(예: 사이트 간)로 제한된 양의 정보를 전달할 수 있도록 하는 새로운 API입니다.'
authors:
  - samdutton
date: 2020-06-22
updated: 2021-12-10
hero: image/admin/okxi2ttRG3h1Z4F3cylI.jpg
thumbnail: image/admin/cTo0l2opcfNxg1TEjxSg.jpg
alt: 토큰을 들고 있는 손의 흑백 사진
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside  'caution' %} **⚠️ 경고: 앱을 업데이트해야 할 수도 있습니다!**

**TrustTokenV3** 는 Chromium의 신뢰 토큰 구현에 대한 이전 버전과 호환되지 않는 변경 사항 모음입니다. 변경 사항은 2021년 7월 말에 Chrome 안정화 버전에 도달한 Chrome 92에 적용되었습니다.

아직 업데이트하지 않았다면 [API를 테스트하는](https://www.chromestatus.com/feature/5078049450098688) 기존 애플리케이션을 업데이트해야 합니다.

자세히 알아보기: [TrustTokenV3이란 무엇입니까?](https://bit.ly/what-is-trusttokenv3) {% endAside %}

<br><br>

{% YouTube id='bXB1Iwq6Eq4' %}

## 요약

신뢰 토큰을 사용하면 출처가 신뢰하는 사용자에게 암호화 토큰을 발급할 수 있습니다. 토큰은 사용자의 브라우저에 저장됩니다. 그런 다음 브라우저는 다른 컨텍스트에서 토큰을 사용하여 사용자의 신뢰성을 평가할 수 있습니다.

신뢰 토큰 API를 사용하면 사용자를 식별하거나 두 ID를 연결하지 않고도 한 컨텍스트에서 사용자의 신뢰를 다른 컨텍스트로 전달할 수 있습니다.

[데모](https://trust-token-demo.glitch.me)에서 API를 사용해 보고 Chrome DevTools **네트워크** 및 **애플리케이션** 탭에서 [토큰을 검사](https://developers.google.com/web/updates/2021/01/devtools#trust-token)할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/krrI292OLd6awb4dxkN0.jpg", alt="Chrome DevTools 네트워크 탭에서 신뢰 토큰을 보여주는 스크린샷", width="800", height="584" %}<figcaption> Chrome DevTools <b>네트워크</b> 탭에서 토큰을 신뢰합니다.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cwR9JdoVo1M4VDovP2oM.jpg", alt="Chrome DevTools 애플리케이션 탭에서 신뢰 토큰을 보여주는 스크린샷.", width="800", height="584" %}<figcaption> Chrome DevTools <b>애플리케이션</b> 탭에서 토큰을 신뢰합니다.</figcaption></figure>

{% Aside %} 개인정보 보호 샌드박스는 타사 쿠키 또는 기타 추적 메커니즘 없이 타사 사용 사례를 충족하기 위한 일련의 제안입니다. 모든 제안에 대한 개요는  [개인 정보 보호 샌드박스](/digging-into-the-privacy-sandbox) 자세히 보기를 참조하세요.

**이 제안은 귀하의 피드백이 필요합니다!** 의견이 있는 경우 [신뢰 토큰 안내](https://github.com/WICG/trust-token-api/issues/new) 저장소에 [문제를 생성](https://github.com/WICG/trust-token-api)하십시오. {% endAside %}

## 왜 신뢰 토큰이 필요한가요?

웹은 사용자가 실제 사람이나 서비스를 사칭하는 악의적인 제3자나 사람을 가장하는 봇이 아니라 자신이 주장하는 사람임을 보여주는 신뢰 신호를 설정하는 방법이 필요합니다. 사기 방지는 광고주, 광고 제공업체 및 CDN에게 특히 중요합니다.

불행히도, 예를 들어 사이트와의 상호 작용이 실제 사람의 것인지 확인하기 위해 신뢰성을 측정하고 전파하는 많은 기존 메커니즘은 지문에도 사용할 수 있는 기술을 활용합니다.

{% Aside 'key-term' %} **지문**을 사용하면 사이트에서 기기, 운영체제, 브라우저 설정(예: 언어 기본 설정, [사용자 에이전트](https://developer.mozilla.org/docs/Web/API/NavigatorID/userAgent), 사용 가능한 글꼴) 또는 기기 상태 변경에 대한 데이터를 가져와 개별 사용자를 식별하고 추적할 수 있습니다. 이것은 요청 헤더를 확인하여 서버에서 또는 JavaScript를 사용하여 클라이언트에서 수행할 수 있습니다.

지문은 사용자가 인식하지 못하고 제어할 수 없는 메커니즘을 사용합니다. [Panopticlick](https://panopticlick.eff.org/) 및 [amiunique.org](https://amiunique.org/)와 같은 사이트는 지문 데이터를 결합하여 귀하를 개인으로 식별하는 방법을 보여줍니다. {% endAside %}

API는 개인 정보를 보호하여 개별 사용자 추적 없이도 신뢰가 사이트 전체에 전파될 수 있도록 해야 합니다.

## 신뢰 토큰 제안에는 무엇이 있습니까?

웹은 사기 및 스팸을 탐지하기 위해 신뢰 신호 구축에 의존합니다. 이를 수행하는 한 가지 방법은 전역, 사이트 간 사용자별 식별자로 탐색을 추적하는 것입니다. 개인 정보 보호 API의 경우 허용되지 않습니다.

제안 [**설명**](https://github.com/WICG/trust-token-api#overview)에서:

<blockquote>
<p>이 API는 타사 컨텍스트에서 액세스할 수 있는 "Prrivacy Pass" 스타일 암호화 토큰을 위한 새로운 원본별 저장 영역을 제안합니다. 이 토큰은 개인화되지 않았으며 사용자를 추적하는 데 사용할 수 없지만 위조될 수 없도록 암호로 서명됩니다.</p>
<p>출처가 사용자를 신뢰하는 컨텍스트에 있는 경우 브라우저에 토큰 배치를 발행할 수 있습니다. 이 토큰은 나중에 사용자를 알 수 없거나 덜 신뢰할 수 있는 컨텍스트에서 "사용"할 수 있습니다. 결정적으로 토큰은 서로 구별할 수 없으므로 웹사이트에서 토큰을 통해 사용자를 추적하지 못합니다.</p>
<p>또한 브라우저가 특정 토큰 상환에 바인딩된 키로 나가는 요청에 서명할 수 있는 확장 메커니즘을 제안합니다.</p>
</blockquote>

## 샘플 API 사용

[다음은 API 설명의 샘플 코드](https://github.com/WICG/trust-token-api#sample-api-usage)에서 수정한 것입니다.

{% Aside %} 이 게시물의 코드는 Chrome 88 이후 사용 가능한 업데이트된 구문을 사용합니다. {% endAside %}

사용자가 타사 광고 네트워크(`foo.example`)의 광고를 포함하는 뉴스 웹사이트(`publisher.example`)를 방문한다고 가정해 봅니다. 사용자는 신뢰 토큰을 발행하는 소셜 미디어 사이트( `issuer.example`)를 사용한 적이 있습니다.

아래 순서는 신뢰 토큰이 작동하는 방식을 보여줍니다.

**1.** 사용자가 `issuer.example`을 방문하여 계정 활동, 보안문자 챌린지 통과와 같이 사이트가 실제 사람이라고 믿도록 하는 작업을 수행합니다.

**2.** `issuer.example`은 사용자가 사람인지 확인하고 다음의 JavaScript를 실행하여 사용자의 브라우저에 신뢰 토큰을 발행합니다.

```js
fetch('https://issuer.example/trust-token', {
  trustToken: {
    type: 'token-request',
    issuer: 'https://issuer.example'
  }
}).then(...)
```

**3.** 사용자의 브라우저는 신뢰 토큰을 `issuer.example`과 연결하여 저장합니다.

**4.** 잠시 후 사용자는 `publisher.example`을 방문합니다.

**5.** `publisher.example`은 사용자가 실제 사람인지 알고 싶어합니다. `publisher.example`은 `issuer.example`을 신뢰하므로 사용자의 브라우저에 해당 출처의 유효한 토큰이 있는지 확인합니다.

```js
document.hasTrustToken('https://issuer.example');
```

**6.** 이것이 `true`로 해결되는 약속을 반환하는 경우 사용자가 `issuer.example`에서 발행된 토큰을 가지고 있다는 것을 의미합니다. 따라서 `publisher.example`은 토큰을 상환하려고 시도할 수 있습니다.

```js
fetch('https://issuer.example/trust-token', {
trustToken: {
  type: 'token-redemption',
  issuer: 'https://issuer.example',
  refreshPolicy: {none, refresh}
}
}).then(...)
```

이 코드는 다음을 수행합니다.

1. 토큰 상환자 `publisher.example`이 상환을 요청합니다.
2. 상환에 성공하면 발행자 `issuer.example`은 특정 시점에 이 브라우저에 유효한 토큰을 발행했음을 나타내는 상환 기록을 반환합니다.

**7.** `fetch()`가 반환한 약속이 해결되면 상환 기록을 후속 리소스 요청에 사용할 수 있습니다.

```js
fetch('https://foo.example/get-content', {
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['https://issuer.example', ...]
  }
});
```

이 코드는 다음을 수행합니다.

1. 상환 기록은 요청 헤더 `Sec-Redemption-Record`로 포함됩니다.
2. `foo.example`은 상환 기록을 수신하고 기록을 구문 분석하여 `issuer.example`이 이 사용자를 사람으로 생각했는지 여부를 결정할 수 있습니다.
3. `foo.example` 은 그에 따라 응답합니다.

{% Details %} {% DetailsSummary %} 웹사이트에서 사용자를 신뢰할 수 있는지 여부를 어떻게 알 수 있나요? {% endDetailsSummary %} 전자상거래 사이트의 쇼핑 내역, 위치 플랫폼의 체크인 또는 은행의 계좌 내역이 있을 수 있습니다. 또한 발급자는 계정 보유 기간 또는 실제 사람일 가능성에 대한 발급자의 신뢰를 높이는 기타 상호 작용(예: CAPTCHA 또는 양식 제출)과 같은 다른 요소를 살펴볼 수도 있습니다. {% endDetails %}

### 신뢰 토큰 발행

`issuer.example`과 같은 신뢰 토큰 발행자에 의해 신뢰할 수 있는 것으로 간주되는 경우 `trustToken` 매개변수를 포함한 `fetch()` 요청을 수행하여 사용자에 대한 신뢰 토큰을 가져올 수 있습니다.

```js
fetch('issuer.example/trust-token', {
  trustToken: {
    type: 'token-request'
  }
}).then(...)
```

이것은 [새로운 암호화 프리미티브를](https://eprint.iacr.org/2020/072.pdf) 사용하여 [Privacy Pass](https://privacypass.github.io/) 발급 프로토콜의 확장을 호출합니다.

1. *nonce*로 알려진 의사 난수 세트를 생성합니다.

2. nonce를 블라인드(발급자가 내용을 볼 수 없도록 인코딩)하고 `Sec-Trust-Token` 헤더의 요청에 첨부합니다.

3. 제공된 엔드포인트에 POST 요청을 보냅니다.

끝점은 [블라인드 토큰](https://en.wikipedia.org/wiki/Blind_signature)(블라인드 nonce에 대한 서명)으로 응답한 다음 토큰이 블라인드 해제되고 브라우저에 의해 관련 nonce와 함께 내부적으로 신뢰 토큰으로 저장됩니다.

### 신뢰 토큰 상환

게시자 사이트(예: `publisher.example` )는 사용자가 사용할 수 있는 신뢰 토큰이 있는지 확인할 수 있습니다.

```js
const userHasTokens = await document.hasTrustToken('issuer.example/trust-token');
```

사용 가능한 토큰이 있는 경우 게시자 사이트에서 토큰을 사용하여 사용 기록을 얻을 수 있습니다.

```js
fetch('issuer.example/trust-token', {
  ...
  trustToken: {
    type: 'token-redemption',
    refreshPolicy: 'none'
  }
  ...
}).then(...)
```

`fetch()` 호출을 사용하여 의견 게시, 페이지 좋아요, 투표 투표와 같이 신뢰 토큰이 필요한 요청에 상환 기록을 포함할 수 있습니다.

```js
fetch('https://foo.example/post-comment', {
  ...
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['issuer.example/trust-token', ...]
  }
  ...
}).then(...);
```

상환 기록은 `Sec-Redemption-Record` 요청 헤더로 포함됩니다.

{% Aside %} 신뢰 토큰은 Fetch, XHR 및 HTML `<iframe>` 요소에 대한 옵션을 통해서만 액세스할 수 있습니다.
 직접 액세스할 수 없습니다. {% endAside%}

### 개인정보 보호 고려사항

토큰은 '연결 불가능'하도록 설계되었습니다. 발행자는 사용자가 방문하는 사이트에 대한 집계 정보를 알 수 있지만 발행과 상환을 연결할 수는 없습니다. 사용자가 토큰을 상환할 때 발행자는 토큰을 생성한 다른 토큰과 구별할 수 없습니다. 그러나 현재 신뢰 토큰은 독자적으로 존재하지 않습니다. 현재 제3자 쿠키 및 은밀한 추적 기술과 같이 이론적으로 발급자가 여러 사이트에서 사용자의 ID를 취합할 수 있는 다른 방법이 있습니다. 사이트가 지원을 계획할 때 이러한 생태계 전환을 이해하는 것이 중요합니다. 이것은 많은 개인정보 샌드박스 API에 대한 전환의 일반적인 측면이므로 여기에서 더 이상 논의하지 않습니다.

### 보안 고려 사항

**신뢰 토큰 소진:** 악의적인 사이트가 특정 발행자의 토큰 공급을 의도적으로 고갈시킬 수 있습니다. 발행자가 한 번에 많은 토큰을 제공할 수 있도록 하는 것과 같이 이러한 종류의 공격에 대한 몇 가지 완화 방법이 있습니다. 이를 브라우저가 최상위 페이지 보기당 하나의 토큰만 사용하도록 하여 사용자가 토큰을 적절히 공급받도록 할 수 있습니다.

**이중 지출 방지:** 맬웨어가 사용자의 모든 신뢰 토큰에 액세스를 시도할 수 있습니다. 그러나 모든 상환은 각 토큰이 한 번만 사용되는지 확인할 수 있는 동일한 토큰 발행자에게 보내지기 때문에 시간이 지나면서 토큰이 소진됩니다. 위험을 완화하기 위해 발행자는 더 적은 수의 토큰에 서명할 수도 있습니다.

### 요청 메커니즘

예를 들어 탐색 요청과 함께 `fetch()` 외부에서 상환 기록을 보내는 것을 허용할 수 있습니다. 사이트는 페이지 로드와 동시에 토큰 상환을 활성화하기 위해 HTTP 응답 헤더에 발급자 데이터를 포함할 수도 있습니다.

**다시 말씀드리지만 이 제안은 귀하의 피드백이 필요합니다!** 의견이 있는 경우 신뢰 토큰 [설명 저장소](https://github.com/WICG/trust-token-api)에 [문제](https://github.com/WICG/trust-token-api/issues/new) 를 생성하십시오.

## 자세히 알아보기

- [신뢰 토큰 데모](https://trust-token-demo.glitch.me)
- [Chrome의 원본 평가판 시작하기](https://developer.chrome.com/blog/origin-trials/)
- [개인정보 샌드박스 자세히 알아보기](/digging-into-the-privacy-sandbox/)
- [신뢰 토큰 API 설명](https://github.com/WICG/trust-token-api)
- [Chromium 프로젝트: 신뢰 토큰 API](https://sites.google.com/a/chromium.org/dev/updates/trust-token)
- [구현 의도: 신뢰 토큰 API](https://groups.google.com/a/chromium.org/g/blink-dev/c/X9sF2uLe9rA/m/1xV5KEn2DgAJ)
- [Chrome 플랫폼 상태](https://www.chromestatus.com/feature/5078049450098688)
- [Privacy Pass](https://privacypass.github.io/)
- [Privacy Pass의 확장](https://eprint.iacr.org/2020/072.pdf)

---

이 게시물을 작성하고 검토하는 데 도움을 주신 모든 분들께 감사드립니다.

사진 제공: [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)의 [ZSun Fu](https://unsplash.com/photos/b4D7FKAghoE)
