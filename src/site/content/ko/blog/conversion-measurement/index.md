---
title: 광고 전환을 측정하는 보다 개인적인 방법인 Event Conversion Measurement API
subhead: 최초 평가판으로 사용할 수 있는 새로운 Web API는 사이트 간 식별자를 사용하지 않고 언제 광고 클릭이 전환으로 이어지는 지를 측정합니다.
authors:
  - maudn
  - samdutton
hero: image/admin/wRrDtHNikUNqgdDewvYG.jpg
date: 2020-10-06
updated: 2020-05-04
tags:
  - blog
  - privacy
---

{% Banner 'caution', 'body' %} Conversion Measurement API는 *Attribution Reporting API*로 이름이 바뀌고 더 많은 기능을 제공합니다.

- [Chrome 91](https://chromestatus.com/features/schedule) [이하에서 (Conversion Measurement API](https://github.com/WICG/conversion-measurement-api/blob/3e0ef7d3cee8d7dc5a4b953e70cb027b0e13943b/README.md))를 실험하고 있다면 이 게시물을 읽고 API 사용 방법에 대한 자세한 내용, 사용 사례 및 지침을 확인하세요.
- Chrome(원본 평가판)에서 실험에 사용할 수 있는 이 API(속성 보고)의 다음 버전에 관심이 있다면 [메일링 리스트에 가입](https://groups.google.com/u/1/a/chromium.org/g/attribution-reporting-api-dev)하여 사용 가능한 실험에 대한 업데이트를 받으세요.

{% endBanner %}

광고 캠페인의 효과를 측정하기 위해 광고주와 게시자는 광고 클릭 또는 조회가 구매 또는 가입과 같은 [전환](/digging-into-the-privacy-sandbox/#conversion)으로 이어지는 시점을 알아야 합니다. 지금까지는 이 목적에 **제3자 쿠키**가 사용되었습니다. 이제 Event Conversion Measurement API를 사용하면 여러 사이트에서 사용자를 인식하는 데 사용할 수 있는 메커니즘을 사용하지 않고도 게시자 웹사이트의 이벤트와 광고주 사이트의 후속 전환 간의 상관 관계를 파악할 수 있습니다.

{% Banner 'info', 'body' %} **이 제안에 여러분의 피드백이 필요합니다!** 의견이 있으면 API 제안 저장소에 [이슈를 생성](https://github.com/WICG/conversion-measurement-api/issues/)해 주세요. {% endBanner %}

{% Aside %} 이 API는 제3자 쿠키 또는 기타 사이트 간 추적 메커니즘 없이 제3자 사용 사례를 충족하기 위한 일련의 제안인 개인정보 보호 샌드박스의 일부입니다. 모든 제안에 대한 개요는 [개인정보 보호 샌드박스 심층 해부](/digging-into-the-privacy-sandbox)를 참조하세요. {% endAside %}

## 용어 사전

- **애드테크 플랫폼**: 브랜드 또는 대행사가 디지털 광고를 타겟팅, 전달 및 분석할 수 있도록 하는 소프트웨어 및 도구를 제공하는 회사입니다.
- **광고주**: 광고 비용을 지불하는 회사입니다.
- **게시자**: 해당 웹사이트에 광고를 게재하는 회사입니다.
- **사용자 클릭 전환**: 광고 클릭에 기여한 전환입니다.
- **조회 후 전환**: 광고 노출에 기여한 전환입니다(사용자가 광고와 상호 작용하지 않으면 나중에 전환).

## 이 API에 대해 알아야 하는 대상자: 애드테크 플랫폼, 광고주 및 게시자

- **[수요측 플랫폼](https://en.wikipedia.org/wiki/Demand-side_platform)**과 같은 **애드테크 플랫폼**은 현재 제3자 쿠키에 의존하는 기능을 지원하기 위해 이 API를 사용하는 데 관심이 있을 것입니다. 전환 측정 시스템을 다루고 있다면 [데모를 시도해 보고](#demo), [이 API를 실험하고](#experiment-with-the-api), [피드백을 공유해 주세요](#share-your-feedback).
- **광고 또는 전환 측정을 위해 맞춤 코드에 의존하는 광고주와 게시자**도 마찬가지로 이 API를 사용하여 기존 기술을 대체하는 데 관심을 가질 수 있습니다.
- **광고 또는 전환 측정을 위해 애드테크 플랫폼에 의존하는 광고주 및 게시자**는 이 API를 직접 사용할 필요는 없지만, 특히 API를 통합할 수 있는 애드테크 플랫폼으로 작업하는 경우에 [이 API에 담겨진 논리](#why-is-this-needed)에 관심을 가질 수 있습니다.

## API 개요

### 왜 필요한가?

현재, 광고 전환 측정을 위해 [제3자 쿠키](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Third-party_cookies)가 사용되는 경우가 많습니다. **그러나 브라우저가 이에 대한 액세스를 제한하고 있습니다.**

Chrome은 [제3자 쿠키에 대한 지원을 단계적으로 중단](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html)[할 계획이며 사용자가 원하는 경우 이를 차단할 수 있는 방법을 제공합니다](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en). Safari는 [제3자 쿠키를 차단](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)하고, Firefox는 [알려진 제3자 추적 쿠키를 차단](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default)하며, Edge는 [추적 방지 기능](https://support.microsoft.com/en-us/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention)을 제공합니다.

제3자 쿠키는 레거시 솔루션이 되고 있습니다. 제3자 쿠키가 해결한 사용 사례를 개인정보를 보호하는 방식으로 해결하기 위해 본 API와 같이 **특정 목적을 염두에 둔 새로운 API가 등장하고 있습니다.**

**Event Conversion Measurement API는 제3자 쿠키와 어떻게 비교됩니까?**

- 쿠키와 달리 이 API는 전환을 측정하기 위한 **특정한 목적을 염두에 두고 개발되었습니다.** 이를 통해 브라우저는 더욱 강화된 개인정보 보호를 적용할 수 있습니다.
- **기밀성이 더욱 높습니다**. 예를 들어 게시자 측 및 광고주 측 사용자 프로필을 연결하려는 목적으로 두 개의 서로 다른 최상위 사이트에서 사용자를 인식하기 어렵습니다. [이 API가 사용자 개인정보를 보호하는 방법](#how-this-api-preserves-user-privacy)에서 그 이유를 확인하세요.

### 첫 번째 버전

이 API는 **초기 실험 단계**에 있습니다. 최초 평가판에서는 API의 **첫 번째 버전**을 사용할 수 있습니다. [향후 버전](#use-cases)에서는 내용이 크게 달라질 수 있습니다.

### 클릭 전환만 지원

이 API 버전에서는 **사용자 클릭 전환 측정**만 지원하지만 [조회 후 전환 측정](https://github.com/WICG/conversion-measurement-api/blob/main/event_attribution_reporting.md)도 공개 인큐베이션 상태에 있습니다.

### 작동 원리

<figure class="w-figure">{% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="다이어그램: conversion measurement API 단계 개요", width="800", height="496" %}</figure>

이 API는 광고에 사용되는 두 가지 유형의 링크(`<a>` 요소)와 함께 사용할 수 있습니다.

- 소셜 네트워크 또는 검색 엔진 결과 페이지의 광고와 같은 **자사** 컨텍스트의 링크
- 제3자 애드테크 제공업체를 사용하는 게시자 사이트와 같은 **제3자 iframe**의 링크입니다.

이 API를 사용하면 광고 전환과 관련된 특성으로 이러한 아웃바운드 링크를 구성할 수 있습니다.

- 클릭 ID 또는 캠페인 ID와 같이 게시자 측의 광고 클릭에 첨부하는 사용자 지정 데이터
- 이 광고에 대해 전환이 예상되는 웹사이트
- 성공적인 변환에 대해 알림을 받아야 하는 보고 끝점
- 이 광고에 대해 더 이상 전환을 계산할 수 없는 마감 날짜 및 시간

사용자가 광고를 클릭하면 사용자의 로컬 장치에 있는 브라우저가 이 이벤트를 기록하며, `<a>` 요소의 전환 측정 특성으로 지정된 전환 구성과 클릭 데이터도 함께 기록합니다.

나중에 사용자는 광고주의 웹사이트를 방문하여 광고주 또는 애드테크 제공업체가 **전환**으로 분류한 작업을 수행할 수 있습니다. 이 경우 사용자의 브라우저에서 광고 클릭과 전환 이벤트의 일치가 이루어집니다.

브라우저는 마지막으로 `<a>` 요소의 특성에 지정된 끝점으로 **전환 보고서** 전송을 예약합니다. 이 보고서에는 이 전환으로 이어진 광고 클릭에 대한 데이터와 전환에 대한 데이터가 포함됩니다.

특정 광고 클릭에 대해 여러 전환이 등록된 경우, 해당 보고서가 전송되도록 예약됩니다(광고 클릭당 최대 3개).

보고서는 전환 후 며칠 또는 몇 주 후의 시차를 두고 전송됩니다(그 이유는 [보고서 타이밍](#report-timing) 참조).

## 브라우저 지원 및 유사한 API

### 브라우저 지원

Event Conversion Measurement API는 다음과 같이 지원될 수 있습니다.

- [최초 평가판으로 지원](/origin-trials/). 최초 평가판을 사용하면 해당 [출처](/same-site-same-origin/#origin)의 **모든 방문자**가 API를 사용할 수 있습니다. **최종 사용자에게 API를 사용해 보려면 최초 평가판에 대한 출처를 등록해야 합니다**. 최초 평가판에 관한 자세한 내용은 [Conversion Measurement API 사용](/using-conversion-measurement)을 참조하세요.
- Chrome 86 이상에서 플래그의 사용을 설정합니다. 플래그를 통해 **단일 사용자**의 브라우저에서 API를 사용할 수 있습니다. **플래그는 로컬에서 개발할 때 유용합니다**.

[Chrome 기능 항목](https://chromestatus.com/features/6412002824028160)에서 현재 상황에 대한 자세한 내용을 확인하세요.

### 표준화

이 API는 [WICG](https://www.w3.org/community/wicg/)(Web Platform Incubator Community Group)에서 공개적으로 설계되고 있습니다. Chrome에서 실험적으로 이용할 수 있습니다.

### 유사한 API

Safari에서 사용하는 웹 브라우저 엔진인 WebKit에는 [Private Click Measurement](https://github.com/privacycg/private-click-measurement)라는 유사한 목표를 가진 제안이 있습니다. 개인정보 보호 커뮤니티 그룹([PrivacyCG](https://www.w3.org/community/privacycg/)) 내에서 작업이 이루어지고 있습니다.

## 이 API가 사용자 개인정보를 보호하는 방법

이 API를 사용하면 사용자의 개인정보를 보호하면서 전환을 측정할 수 있습니다. 즉, 사이트 간에 사용자를 식별할 수 없습니다. 이를 위해 **데이터 제한**, **변환 데이터에 노이즈 도입** 및 **보고 타이밍** 메커니즘이 적용됩니다.

이러한 메커니즘이 작동하는 방식과 실제로 의미하는 바를 자세히 살펴보겠습니다.

### 데이터 제한

이어지는 내용에서 **클릭 시간 또는 조회 시간 데이터**는 사용자에게 광고가 게재된 후 클릭 또는 조회되었을 때 `adtech.example`이 사용할 수 있는 데이터입니다. 전환이 발생한 시점의 데이터가 **전환 시간 데이터**입니다.

**게시자** `news.example`과 **광고주** `shoes.example`을 살펴보겠습니다. **애드테크 플랫폼** `adtech.example`의 제3자 스크립트는 광고주 `shoes.example`에 대한 광고를 포함하도록 게시자 사이트 `news.example`에 제공됩니다. `shoes.example`에는 전환을 감지하기 위해 `adtech.example` 스크립트도 포함됩니다.

`adtech.example`은 웹 사용자에 대해 얼마나 알 수 있습니까?

#### 제3자 쿠키 사용

<figure class="w-figure">{% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="다이어그램: 제3자 쿠키가 사이트 간 사용자 인식을 가능하게 하는 방법", width="800", height="860" %}</figure>

`adtech.example`은 **사이트 간 고유 식별자로 사용되는 제3자 쿠키**를 이용해 **사이트 간에 사용자를 인식**합니다. 또한 `adtech.example`은 상세한 클릭 또는 조회 시간 데이터와 상세한 전환 시간 데이터에 **모두** 액세스하여 이들을 연결할 수 있습니다.

결과적으로 `adtech.example`은 광고 보기, 클릭 및 전환 사이에 사이트 간 단일 사용자의 행동을 추적할 수 있습니다.

`adtech.example`은 `news.example` 및 `shoes.example`뿐만 아니라 수많은 게시자 및 광고주 사이트에서 제공될 가능성이 높으므로 웹 전체에서 사용자의 행동을 추적할 수 있습니다.

#### Event Conversion Measurement API 사용

<figure class="w-figure">{% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="다이어그램: API가 사이트 간 사용자 인식 없이 전환 측정을 가능하게 하는 방법", width="800", height="643" %} <figcaption class="w-figcaption">쿠키 다이어그램의 "광고 ID"와 "클릭 ID"는 모두 세부 데이터에 매핑할 수 있게 해주는 식별자입니다. 이 다이어그램에서는 사용자 클릭 전환 측정만 지원되므로 "클릭 ID"라고 합니다.</figcaption></figure>

`adtech.example`은 사이트 간 식별자를 사용할 수 없으며, 따라서 **여러 사이트에 걸쳐 사용자를 인식할 수 없습니다**.

- 64비트 식별자는 광고 클릭에 첨부할 수 있습니다.
- 변환 이벤트에는 3비트의 변환 데이터만 첨부할 수 있습니다. 3비트는 0에서 7 사이의 정수 값에 맞을 수 있습니다. 이것은 많은 데이터는 아니지만 광고주가 미래에 광고 예산을 어디에 사용할지 올바른 결정을 내리는 방법(예를 들어, 데이터 모델을 훈련하여)을 알아내기에는 충분합니다.

{% Aside %} 클릭 데이터와 전환 데이터는 동일한 컨텍스트에서 JavaScript 환경에 노출되지 않습니다. {% endAside %}

#### 제3자 쿠키에 대한 대안이 없을 때

Event Conversion Measurement API와 같은 제3자 쿠키에 대한 대안이 없으면 전환에 기여하지 못합니다. `adtech.example`이 게시자와 광고주 사이트 모두에 있는 경우 클릭 시간 또는 전환 시간 데이터에 액세스할 수 있지만 서로를 절대 연결할 수 없습니다.

이 경우 사용자 개인정보는 보호되지만 광고주는 광고 지출을 최적화할 수 없습니다. Event Conversion Measurement API와 같은 대안이 필요한 이유가 여기에 있습니다.

### 전환 데이터에 노이즈 도입

전환 시간에 수집된 3비트에는 **노이즈가 도입**됩니다.

예를 들어 Chrome의 구현에서 데이터 노이즈 도입은 다음과 같이 작동합니다. 전체 시간 중 5%의 경우에 API는 실제 전환 데이터 대신 임의의 3비트 값을 보고합니다.

그러면 사용자의 개인정보가 공격으로부터 보호를 받습니다. 식별자를 생성하기 위해 여러 변환의 데이터를 악용하려는 행위자는 수신하는 데이터를 완전히 신뢰하지 못하게 되므로 이러한 유형의 공격이 더 복잡해집니다.

[실제 전환 수](/using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count)는 복구가 가능합니다.

클릭 데이터 및 전환 데이터 요약:

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>데이터</th>
        <th>크기</th>
        <th>예시</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>클릭 데이터( <code>impressiondata</code> 특성)</td>
        <td>64비트</td>
        <td>광고 ID 또는 클릭 ID</td>
      </tr>
      <tr>
        <td>전환 데이터</td>
        <td>3비트, 노이즈 도입</td>
        <td>전환 유형(가입, 결제 완료 등)에 매핑할 수 있는 0에서 7 사이의 정수</td>
      </tr>
    </tbody>
  </table>
</div>

### 보고 타이밍

특정 광고 클릭에 대해 여러 전환이 등록된 경우 **각 전환에 대해 해당 보고서가 전송되며 클릭당 최대 3회까지 가능합니다**.

전환 시간이 전환 측에서 더 많은 정보를 얻는 데 사용되지 않도록 하여 사용자의 개인정보를 보호하기 위해 이 API는 전환이 발생한 직후 전환 보고서가 전송되지 않도록 지정합니다. 최초 광고 클릭 후, 이 클릭과 관련된 **보고 기간** 일정이 시작됩니다. 각 보고 기간에는 기한이 있으며 해당 기한 전에 등록된 전환은 해당 기간이 끝날 때 전송됩니다.

보고서는 정확히 예약된 날짜와 시간에 전송되지 않을 수도 있습니다. 보고서가 전송되도록 예약된 시간에 브라우저가 실행되고 있지 않으면 브라우저 시작 시 보고서가 전송됩니다. 이 시간은 예약된 시간보다 며칠 또는 몇 주가 늦을 수 있습니다.

만료(클릭 시간 + `impressionexpiry`) 후에는 전환이 카운트되지 않습니다. `impressionexpiry`는 전환이 더 이상 이 광고에 대해 카운트될 수 없는 경계 시기에 해당하는 날짜와 시간입니다.

Chrome에서 보고서 예약은 다음과 같이 작동합니다.

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>전환 시간에 따라 전환 보고서가 전송됩니다(브라우저가 열려 있는 경우)...</th>
        <th>보고 기간 수</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30일, 기본값 및 최대값</td>
        <td>
          <ul>
            <li>광고를 클릭한 후 2일</li>
            <li>또는 광고 클릭 후 7일</li>
            <li>또는 <code>impressionexpiry</code> = 광고 클릭 후 30일</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>는 7일에서 30일 사이입니다.</td>
        <td>
          <ul>
            <li>광고 클릭 후 2일</li>
            <li>또는 광고 클릭 후 7일</li>
            <li>또는 광고 클릭 후 <code>impressionexpiry</code>
</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>는 2일에서 7일 사이입니다.</td>
        <td>
          <ul>
            <li>광고 클릭 후 2일</li>
            <li>또는 광고 클릭 후 <code>impressionexpiry</code>
</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>는 2일 미만입니다.</td>
        <td>
          <li>광고 클릭 후 2일</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure class="w-figure">{% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="어떤 보고서가 언제 보내졌는 지에 대한 연대기", width="800", height="462" %}</figure>

타이밍에 대한 자세한 내용은 [예약 보고서 보내기](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports)를 참조하세요.

## 예시

{% Banner 'info', 'body' %} 실제 작동을 확인하려면 [데모](https://goo.gle/demo-event-level-conversion-measurement-api) ⚡️를 시도하고 해당하는 [코드](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement)를 확인하세요. {% endBanner %}

API가 전환을 기록하고 보고하는 방법은 다음과 같습니다. 이것이 현재 API에서 클릭-투-전환 흐름이 작동하는 방식입니다. 이 API의 향후 버전에서는 [달라질 수 있습니다](#use-cases).

### 광고 클릭(1~5단계)

<figure class="w-figure">{% Img src="image/admin/FvbacJL6u37XHuvQuUuO.jpg", alt="다이어그램: 광고 클릭 및 클릭 저장", width="800", height="694" %}</figure>

`<a>` 광고 요소는 iframe 내의 `adtech.example`에 의해 게시자 사이트에 로드됩니다.

애드테크 플랫폼 개발자들은 전환 측정 특성으로 `<a>` 요소를 구성하고 있습니다.

```html
<a
  id="ad"
  impressiondata="200400600"
  conversiondestination="https://advertiser.example"
  reportingorigin="https://adtech.example"
  impressionexpiry="864000000"
  href="https://advertiser.example/shoes07"
>
  <img src="/images/shoe.jpg" alt="shoe" />
</a>
```

이 코드는 다음을 지정합니다.

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th>귀속</th>
        <th>기본값, 최대, 최소</th>
        <th>예시</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>impressiondata</code>(필수): 광고 클릭에 첨부할 <b>64비트</b> 식별자입니다.</td>
        <td>(기본값 없음)</td>
        <td>64비트 정수와 같이 동적으로 생성된 클릭 ID: <code>200400600</code>
</td>
      </tr>
      <tr>
        <td>
<code>conversiondestination</code>(필수): 이 광고에 대해 전환이 예상되는 <b><a href="/same-site-same-origin/#site" noopener="">eTLD+1</a></b>입니다.</td>
        <td>(기본값 없음)</td>
        <td>
<code>https://advertiser.example</code>.<br><code>conversiondestination</code>이 <code>https://advertiser.example</code>인 경우 <code>https://advertiser.example</code> 및 <code>https://shop.advertiser.example</code> 모두의 전환이 귀속됩니다.<br><code>conversiondestination</code>이 <code>https://shop.advertiser.example</code>인 경우에도 마찬가지입니다: <code>https://advertiser.example</code> 및 <code>https://shop.advertiser.example</code> 모두의 전환이 귀속됩니다.</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>(선택 사항): 전환이 이 광고에 귀속될 수 있는 제한 시간(밀리초)입니다.</td>
        <td>
<code>2592000000</code> = 30일(밀리초).<br><br> 최대: 30일(밀리초).<br><br> 최소: 2일(밀리초).</td>
        <td>클릭 후 10일: <code>864000000</code>
</td>
      </tr>
      <tr>
        <td>
<code>reportingorigin</code>(선택 사항): 확인된 전환을 보고할 대상입니다.</td>
        <td>링크 요소가 추가되는 페이지의 최상위 출처입니다.</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td>
<code>href</code>: 광고 클릭의 의도된 대상입니다.</td>
        <td><code>/</code></td>
        <td><code>https://advertiser.example/shoes07</code></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} 예시에 관한 몇 가지 참고 사항:

- 지금은 클릭만 지원되지만 API의 특성이나 API 제안에 "노출"이라는 용어가 사용됩니다. 이름은 API의 향후 버전에서 업데이트될 수 있습니다.
- 광고가 iframe에 있을 필요는 없지만 이것이 이 예시의 기초입니다.

{% endAside %}

{% Aside 'gotchas' %}

- `window.open` 또는 `window.location`을 통한 탐색을 기반으로 하는 흐름은 특성에 적합한 대상이 아닙니다.

{% endAside %}

사용자가 광고를 탭하거나 클릭하면 광고주의 사이트로 이동합니다. 탐색이 커밋되면 브라우저가 `impressiondata`, `conversiondestination`, `reportingorigin` 및 `impressionexpiry`를 포함하는 객체를 저장합니다.

```json
{
  "impression-data": "200400600",
  "conversion-destination": "https://advertiser.example",
  "reporting-origin": "https://adtech.example",
  "impression-expiry": 864000000
}
```

### 전환 및 보고 예약(6~9단계)

<figure class="w-figure">{% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="다이어그램: 전환 및 보고 예약", width="800", height="639" %}</figure>

광고를 클릭한 직후 또는 나중에(예: 다음 날) 사용자는 `advertiser.example`을 방문하여 운동화를 검색하고 구매하려는 신발을 찾은 다음 결제를 진행합니다. `advertiser.example`의 체크아웃 페이지에 픽셀이 포함되었습니다.

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example`은 이 요청을 수신하고 이것이 전환에 해당한다고 결정합니다. 이제 브라우저에서 전환을 기록하도록 요청해야 합니다. `adtech.example`은 모든 전환 데이터를 0에서 7 사이의 정수인 3비트로 압축합니다. 예를 들어 **체크아웃** 작업을 전환 값 2에 매핑할 수 있습니다.

그런 다음 `adtech.example`은 특정 레지스터 전환 리디렉션을 브라우저로 보냅니다.

```js
const conversionValues = {
  signup: 1,
  checkout: 2,
};

app.get('/conversion', (req, res) => {
  const conversionData = conversionValues[req.query.conversiontype];
  res.redirect(
    302,
    `/.well-known/register-conversion?conversion-data=${conversionData}`,
  );
});
```

{% Aside %} `.well-known` URL은 특수 URL입니다. 이를 통해 소프트웨어 도구와 서버는 사이트에 일반적으로 필요한 정보나 리소스(예: 사용자가 [비밀번호를 변경](/change-password-url/)할 수 있는 페이지)를 쉽게 찾을 수 있습니다. 여기서 `.well-known`은 브라우저가 이를 특별한 전환 요청으로 인식하도록 하기 위해서만 사용됩니다. 이 요청은 실제로 브라우저에서 내부적으로 취소됩니다. {% endAside %}

브라우저는 이 요청을 수신합니다. `.well-known/register-conversion`을 감지하면 브라우저가 다음 작업을 수행합니다.

- `conversiondestination`과 일치하는 저장소의 모든 광고 클릭을 조회합니다(사용자가 광고를 클릭할 때 `conversiondestination` URL로 등록된 URL에서 이 전환을 수신하기 때문). 하루 전에 게시자의 사이트에서 발생한 광고 클릭을 찾습니다.
- 이 광고 클릭에 대한 전환을 등록합니다.

여러 광고 클릭이 전환과 일치할 수 있습니다. 사용자가 `news.example` 및 `weather.example` 모두에서 `shoes.example`에 대한 광고를 클릭했을 수 있습니다. 이 경우 여러 전환이 등록됩니다.

이제 브라우저는 이 전환을 애드테크 서버에 알려야 한다는 것을 알고 있습니다. 보다 구체적으로 말하면 브라우저는 `<a>` 요소와 픽셀 요청(`adtech.example`) 모두에 지정된 `reportingorigin`을 알려야 합니다.

이를 위해 브라우저는 클릭 데이터(게시자의 사이트로부터 출처) 및 전환 데이터(광고주로부터 출처)가 포함된 데이터 컬렉션인 **전환 보고서**를 보내도록 예약합니다. 이 예에서는 사용자가 클릭하고 하루 후에 전환했습니다. 따라서 브라우저가 실행 중이라면 클릭 후 이틀에 지난 시점인 다음 날 보고서가 전송되도록 예약됩니다.

### 보고서 보내기(10 및 11단계)

<figure class="w-figure">{% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="다이어그램: 보고서를 보내는 브라우저", width="800", height="533" %}</figure>

보고서를 보내도록 예약된 시간에 도달하면 브라우저가 **전환 보고서**를 보냅니다. 구체적으로, `<a>` 요소(`adtech.example`)에 지정된 보고 출처로 HTTP POST가 보내집니다. 예를 들면 다음과 같습니다.

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

매개변수로 포함되는 항목은 다음과 같습니다.

- 원래 광고 클릭과 관련된 데이터(`impression-data`)
- [잠재적으로 노이즈가 도입](#noising-of-conversion-data)된 전환과 관련된 데이터
- 클릭에 기인하는 전환 크레딧. 이 API는 **마지막 클릭 기여** 모델을 따릅니다. 가장 최근에 일치하는 광고 클릭에는 100의 크레딧이 주어지고 일치하는 다른 모든 광고 클릭에는 0의 크레딧이 주어집니다.

이 요청을 받은 애드테크 서버는 여기에서 `impression-data` 및 `conversion-data`, 즉 전환 보고서를 가져올 수 있습니다.

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### 후속 전환 및 만료

나중에 사용자가 다시 전환할 수도 있습니다. 예를 들어 `advertiser.example`에서 신발에 어울리는 테니스 라켓을 구매할 수 있습니다. 여기서도 비슷한 흐름이 발생합니다.

- 애드테크 서버는 브라우저에 전환 요청을 보냅니다.
- 브라우저는 이 전환을 광고 클릭과 일치시키고 보고서를 예약하고 나중에 애드테크 서버로 보고서를 보냅니다.

`impressionexpiry` 후, 이 광고 클릭에 대한 전환의 카운트가 중단되고 광고 클릭이 브라우저 저장소에서 삭제됩니다.

## 사용 사례

### 현재 지원되는 내용

- 사용자 클릭 전환 측정: 어떤 광고 클릭이 전환으로 연결되는지 확인하고 전환에 대한 대략적인 정보에 액세스합니다.
- 광고 선택을 최적화하기 위한 데이터를 수집합니다(예: 머신러닝 모델 훈련).

### 이 버전에서 지원되지 않는 내용

다음 기능은 지원되지 않지만 이 API의 향후 버전 또는 [집계](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) 보고서에는 포함될 수 있습니다.

- 조회 후 전환 측정
- [다중 보고 끝점](https://github.com/WICG/conversion-measurement-api/issues/29)
- [iOS/Android 앱에서 시작된 웹 전환](https://github.com/WICG/conversion-measurement-api/issues/54)
- 전환 상승 측정/증분: 광고를 본 테스트 그룹과 그렇지 않은 대조군 간의 차이를 측정하여 전환 행동의 인과적 차이를 측정합니다.
- 마지막 클릭이 아닌 기여 모델
- 전환 이벤트에 대해 더 많은 양의 정보가 필요한 사용 사례(예: 세분화된 구매 가치 또는 제품 범주)

이러한 기능이 지원되려면 먼저 **더 많은 개인정보 보호**(노이즈, 더 적은 비트 또는 기타 제한)가 API에 추가되어야 합니다.

추가 가능한 기능에 대한 논의는 [API 제안 저장소의 **이슈**](https://github.com/WICG/conversion-measurement-api/issues)에서 공개적으로 이루어집니다.

{% Aside %} 해당 사용 사례가 없습니까? API에 대한 피드백이 있습니까? [공유하세요](#share-your-feedback). {% endAside %}

### 향후 버전에서 변경될 수 있는 기타 사항

- 이 API는 초기 실험 단계에 있습니다. 향후 버전에서는 아래 나열된 항목을 포함하여(이에 국한되지는 않음) 이 API에 상당한 변경이 이루어질 수 있습니다. 사용자 개인정보를 보호하면서 전환을 측정하는 것이 목표가 될 것이며 이 사용 사례를 보다 잘 해결하는 데 도움이 되는 변경이 이루어질 것입니다.
- API 및 특성 명명에 개선이 있을 수 있습니다.
- 클릭 데이터와 전환 데이터에 인코딩이 필요하지 않을 수 있습니다.
- 전환 데이터에 대한 3비트 제한이 증가하거나 감소할 수 있습니다.
- [더 많은 기능](#what-is-not-supported-in-this-iteration)이 추가될 수 있으며, 이러한 새로운 기능을 지원하는 데 필요한 경우 **더 많은 개인정보 보호 수단**(노이즈 도입/더 적은 비트/기타 제한)이 마련될 수 있습니다.

새로운 기능에 대한 토론에 참여하고 팔로우하려면 제안의 [GitHub 저장소](https://github.com/WICG/conversion-measurement-api/issues)를 보고 아이디어를 제출하세요.

## 시도해 보기

### 데모

[데모](https://goo.gle/demo-event-level-conversion-measurement-api)를 시도해 보세요. "시작하기 전에" 지침을 따르세요.

데모에 대한 질문이 있으면 [@maudnals](https://twitter.com/maudnals?lang=en) 또는 [@ChromiumDev](https://twitter.com/ChromiumDev)를 트윗하세요!

### API로 실험하기

API로 실험해볼 계획이라면(로컬에서, 또는 최종 사용자를 통해) [Conversion Measurement API 사용하기](/using-conversion-measurement)를 참조하세요.

### 피드백 공유

새로운 Conversion Measurement API가 여러분의 사용 사례를 지원하고 우수한 개발자 경험을 제공할 수 있으려면 **여러분의 피드백은 매우 중요합니다.**

- Chrome 구현에 대한 버그를 보고하려면 [버그를 개설하세요](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals%3EConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A).
- Chrome API에 대한 피드백을 공유하고 사용 사례를 논의하려면 [API 제안 저장소](https://github.com/WICG/conversion-measurement-api/issues)에서 새 이슈를 만들거나 기존 이슈에 참여하세요. 마찬가지로 [API 제안 저장소](https://github.com/privacycg/private-click-measurement/issues)에서 WebKit/Safari API 및 사용 사례에 대해 논의할 수 있습니다.
- 광고 사용 사례에 대해 논의하고 업계 전문가와 의견을 교환하려면 [웹 광고 개선 비즈니스 그룹](https://www.w3.org/community/web-adv/)에 가입하세요. WebKit/Safari API에 대해 토론하려면 [개인정보 보호 커뮤니티 그룹](https://www.w3.org/community/privacycg/)에 가입하세요.

### 계속 주시하기

- 개발자 피드백과 사용 사례가 쌓여가면서 Event Conversion Measurement API가 앞으로 더욱 발전하게 될 것입니다. 제안의 [GitHub 저장소](https://github.com/WICG/conversion-measurement-api/)를 계속 주시해 주세요.
- 이 API를 보완할 [Aggregate Conversion Measurement API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md)도 어떻게 발전하는지 지켜봐 주세요.

*모든 검토자, 특히 Charlie Harrison, John Delaney, Michael Kleber 및 Kayce Basques의 기여와 피드백에 깊이 감사 드립니다.*

*[Unsplash](https://unsplash.com/photos/WahfNoqbYnM) 소속 William Warby / @wawarby의 영웅 이미지, 편집함*
