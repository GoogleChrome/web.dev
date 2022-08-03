---
layout: post
title: Web Vitals
description: 정상적인 사이트를 위한 필수 메트릭
hero: image/admin/BHaoqqR73jDWe6FL2kfw.png
authors:
  - philipwalton
date: 2020-04-30
updated: 2020-07-21
tags:
  - metrics
  - performance
  - web-vitals
---

사용자 경험의 품질을 최적화하는 것은 웹 사이트의 장기적인 성공의 핵심입니다. 비즈니스 소유자, 마케팅 담당자 또는 개발자에 관계없이 Web Vitals는 사이트 경험을 수량화하고 개선할 기회를 식별하는 데 도움이 될 수 있습니다.

## 개요

Web Vitals는 웹에서 우수한 사용자 경험을 제공하는 데 필수적인 품질 신호에 대한 통합 지침을 제공하기 위한 Google의 이니셔티브입니다.

Google은 성능을 측정하고 보고하기 위해 수년 동안 다양한 도구를 제공해 왔습니다. 이러한 도구를 사용하는 데 전문가가 된 일부 개발자도 존재하지만, 너무나 풍부한 도구와 메트릭에 버거워하는 이들도 있습니다.

사이트 소유자의 경우 사용자에게 제공하는 경험의 품질을 이해하고자 성능에 관한 모든 것을 알고 있을 필요는 없습니다. Web Vitals 이니셔티브는 전망을 단순화하고, 사이트에서 가장 중요한 메트릭인 **Core Web Vitals**에 초점을 맞추도록 지원합니다.

## Core Web Vitals

Core Web Vitals는 모든 웹페이지에 적용되는 Web Vitals의 하위 집합으로 모든 사이트 소유자가 측정해야 하며 모든 Google 도구의 표면에 위치합니다. 각각의 Core Web Vitals는 사용자 경험의 고유한 측면을 나타내고, [필드에서](/user-centric-performance-metrics/#how-metrics-are-measured) 측정 가능하며, 필수적인 [사용자 중심](/user-centric-performance-metrics/#how-metrics-are-measured) 결과에 대한 현실의 경험을 반영합니다.

Core Web Vitals를 구성하는 메트릭은 시간이 지남에 따라 [진화](#evolving-web-vitals)합니다. 2020년 현재 세트는 사용자 경험의 세 가지 측면인 *로딩*, *상호 작용*, *시각적 안정성*에 중점을 두고 있으며 다음 메트릭(및 각각의 임계값)을 포함합니다.

<div class="auto-grid" style="--auto-grid-min-item-size: 200px;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="최대 콘텐츠풀 페인트 권장 임계값", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="최초 입력 지연 권장 임계값", width="400", height="350" %} {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="누적 레이아웃 이동 권장 임계값", width="400", height="350" %}</div>

- **[Largest Contentful Paint(최대 콘텐츠풀 페인트, LCP)](/lcp/)**: *로딩* 성능을 측정합니다. 우수한 사용자 경험을 제공하려면 페이지가 처음으로 로딩된 후 **2.5초** 이내에 LCP가 발생해야 합니다.
- **[First Input Delay(최초 입력 지연, FID)](/fid/)**: *상호 작용*을 측정합니다. 우수한 사용자 경험을 제공하려면 페이지의 FID가 **100밀리초** 이하여야 합니다.
- **[Cumulative Layout Shift(누적 레이아웃 시프트, CLS)](/cls/)**: *시각적 안정성*을 측정합니다. 우수한 사용자 경험을 제공하려면 페이지에서 **0.1** 이하의 CLS를 유지해야 합니다.

위의 각 메트릭이 대부분의 사용자를 위해 권장되는 목표에 도달했는지 확인하기 위해 측정하기 좋은 임계값은 모바일 및 데스크톱 장치 전반을 세분화했을 때 페이지 로드의 **75번째 백분위수**입니다.

Core Web Vitals 규정 준수를 평가하는 도구는 페이지가 위의 세 가지 메트릭 모두에 대해 75번째 백분위수에서 권장 목표를 충족한다면 통과한다고 간주해야 합니다.

{% Aside %} 이러한 권장 사항의 기반이 되는 연구 및 방법론에 대해 자세히 알아보려면 [Core Web Vitals 메트릭 임계값](/defining-core-web-vitals-thresholds/)을 참조하시기 바랍니다. {% endAside %}

### Core Web Vitals를 측정하고 보고하는 도구

Google은 Core Web Vitals가 모든 웹 경험에 필수적이라고 생각하며, [사용자에게 널리 사용되는 도구](/vitals-tools/)의 표면에 이러한 메트릭을 표시하도록 최선을 다하고 있습니다. 다음 섹션에서는 Core Web Vitals를 지원하는 도구가 무엇인지에 대한 상세한 정보를 확인하실 수 있습니다.

#### Core Web Vitals를 측정하기 위한 필드 도구

[Chrome User Experience Report](https://developer.chrome.com/docs/crux/)는 각 Core Web Vital에 대해 익명으로 실제 사용자 측정 데이터를 수집합니다. 사이트 소유자는 페이지에 대해 분석 도구를 사용할 필요 없이, 이 데이터를 활용해 신속하게 성능을 평가하고 [PageSpeed Insights](https://pagespeed.web.dev/) 및 Search Console의 [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520) 같은 도구를 지원할 수 있습니다.

<div class="table-wrapper">
  <table>
    <tr>
      <td> </td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developer.chrome.com/docs/crux/">Chrome User Experience Report</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520">Search Console(Core Web Vitals Report)</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %} 이러한 도구를 사용하는 방법과 자신의 사용 사례에 알맞은 도구를 알아보려면 [Web Vitals로 측정 시작하기](/vitals-measurement-getting-started/)를 참조하시기 바랍니다. {% endAside %}

Chrome User Experience Report의 데이터는 사이트의 성능을 빠르게 평가할 수 있게 해주지만 정확한 진단이나 모니터링, 회귀에 대한 신속한 대응에 필수적인 상세한 페이지 뷰당 원격 분석은 제공하지 않습니다. 그러므로 필드에서 자체적으로 실제 사용자 모니터링을 진행하길 강력하게 추천합니다.

#### JavaScript에서 Core Web Vitals 측정

표준 웹 API를 사용하여 JavaScript에서 각 Core Web Vitals를 측정할 수 있습니다.

모든 Core Web Vitals를 가장 쉽게 측정할 수 있는 방법은 [web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 라이브러리를 사용하는 것입니다. 이러한 라이브러리는 위에 나열된 모든 Google 도구가 보고하는 것과 정확히 일치하는 방식으로 각 메트릭을 측정하는 기본 웹 API 주변에 위치한 소규모의 프로덕션 래퍼입니다.

[web-vitals](https://github.com/GoogleChrome/web-vitals) 라이브러리를 사용하면 각 메트릭을 측정하는 것이 단일 함수를 호출하는 것만큼 간단해집니다(완전한 [사용 방법](https://github.com/GoogleChrome/web-vitals#usage) 및 [API](https://github.com/GoogleChrome/web-vitals#api) 세부 정보는 해당 문서 참조).

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

[web-vitals](https://github.com/GoogleChrome/web-vitals) 라이브러리를 사용하여 Core Web Vitals 데이터를 측정하고 분석 엔드포인트로 전송하도록 사이트를 구성했다면, 다음 단계는 해당 데이터를 집계하고 보고하여 페이지가 페이지 방문의 최소 75%에 대해 권장 임계값을 충족하는지 확인하는 것입니다.

일부 분석 제공업체에서는 Core Web Vitals 메트릭에 대한 지원을 기본적으로 제공합니다. 그렇지 않은 곳이더라도, 자신의 도구에 Core Web Vitals를 측정하도록 허용하는 기본 커스텀 메트릭 기능은 포함해야 합니다.

[Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report)를 이에 대한 예시로 들 수 있습니다. 이 보고서를 통해 사이트 소유자는 Google Analytics를 사용하여 Core Web Vitals를 측정할 수 있습니다. 다른 분석 도구를 사용하여 Core Web Vitals를 측정하는 방법에 대한 지침은 [필드에서 Web Vitals를 측정하기 위한 모범 사례](/vitals-field-measurement-best-practices/)를 참조하시기 바랍니다.

또한 [Web Vitals Chrome 확장 프로그램](https://github.com/GoogleChrome/web-vitals-extension)을 사용해 코드를 작성하지 않고도 각 Core Web Vitals에 대해 보고할 수 있습니다. 이러한 확장 프로그램은 [web-vitals](https://github.com/GoogleChrome/web-vitals) 라이브러리를 사용하여 각 메트릭을 측정하고 사용자가 웹을 탐색할 때 표시합니다.

이 확장 프로그램은 귀하의 사이트, 경쟁업체 사이트는 물론 전반적인 웹의 성능을 이해하는 데 도움이 될 수 있습니다.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">Web Vitals 확장 프로그램</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

기본 웹 API를 통해 이러한 메트릭을 직접 측정하는 것을 선호하는 개발자는 구현 세부 정보에 대해 다음과 같은 메트릭 가이드를 참조할 수 있습니다.

- [JavaScript에서 LCP 측정](/lcp/#measure-lcp-in-javascript)
- [JavaScript에서 FID 측정](/fid/#measure-fid-in-javascript)
- [JavaScript에서 CLS 측정](/cls/#measure-cls-in-javascript)

{% Aside %} 인기 분석 서비스(또는 자체적인 인하우스 분석 툴)를 사용해 이러한 메트릭을 측정하는 법에 대한 자세한 내용은 [필드 Web Vitals 측정 모범 사례](/vitals-field-measurement-best-practices/)를 참조하시기 바랍니다. {% endAside %}

#### Core Web Vitals를 측정하기 위한 실험실 도구

모든 Core Web Vitals는 기본적으로 필드용 메트릭이지만, 대부분은 실험실에서도 측정할 수 있습니다.

실험실 측정은 기능을 사용자에게 출시하기 전에 개발 중 기능의 성능을 테스트하고, 성능 회귀가 발생하기 전에 이를 포착해낼 수 있는 가장 좋은 방법입니다.

다음 도구를 사용하여 실험실 환경에서 Core Web Vitals를 측정할 수 있습니다.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.chrome.com/docs/devtools/">Chrome DevTools</a></td>
        <td>✔</td>
        <td>✘ (대신 <a href="/tbt/">TBT</a> 사용)</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/lighthouse/overview/">Lighthouse</a></td>
        <td>✔</td>
        <td>✘ (대신 <a href="/tbt/">TBT</a> 사용)</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} 사용자 없이 시뮬레이션된 환경에서 페이지를 로드하는 Lighthouse와 같은 도구로는 FID를 측정할 수 없습니다(사용자 입력이 없음). 그러나 Total Blocking Time(총 차단 시간, TBT) 메트릭은 실험실에서 측정할 수 있으며 FID를 충분히 대체할 수 있습니다. 실험실에서 TBT를 개선하는 성능 최적화는 필드에서 FID를 개선합니다(아래 성능 권장 사항 참조). {% endAside %}

실험실 측정은 훌륭한 경험을 제공하는 데 필수적인 부분이지만 필드 측정을 대신할 수는 없습니다.

사이트의 성능은 사용자의 장치 기능, 네트워크 조건, 장치에서 실행 중인 다른 프로세스, 페이지와 상호 작용하는 방식에 따라 크게 달라질 수 있습니다. 사실, 각 Core Web Vitals 메트릭의 점수는 사용자 상호 작용에 영향을 받을 수 있습니다. 그러므로 필드 측정만이 전체 그림을 정확하게 포착할 수 있는 방법입니다.

### 점수 향상을 위한 권장 사항

Core Web Vitals를 측정하고 개선할 영역을 식별한 후 다음 단계는 최적화입니다. 다음 가이드는 각 Core Web Vitals에 대해 페이지를 최적화하는 방법에 대한 구체적인 권장 사항을 제공합니다.

- [LCP 최적화](/optimize-lcp/)
- [FID 최적화](/optimize-fid/)
- [CLS 최적화](/optimize-cls/)

## 기타 Web Vitals

Core Web Vitals는 우수한 사용자 경험을 이해하고 제공하는 데 중요한 메트릭이지만 다른 중요 메트릭 또한 존재합니다.

이러한 기타 Web Vitals 메트릭은 경험의 더 큰 부분을 포착하고, 특정 문제의 진단을 지원하는 등 주로 Core Web Vitals를 대체하거나 보완하는 역할을 합니다.

예를 들어, [Time to First Byte(최초 바이트까지의 시간, TTFB)](/ttfb/) 및 [First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/) 메트릭은 모두 *로딩* 경험에 중요한 요소이며 LCP와 함께 문제(각각 느린 [서버 응답 시간](/overloaded-server/) 또는 [렌더링 차단 리소스](/render-blocking-resources/) 문제)를 진단하는 데 유용합니다.

마찬가지로, [총 차단 시간(TBT)](/tbt/) 및 [Time to Interactive(상호 작용까지의 시간, TTI)](/tti/)와 같은 메트릭은 FID에 영향을 줄 잠재적인 *상호 작용* 문제를 파악하고 진단하는 데 필수적인 실험실 메트릭입니다. 그러나 필드에서 측정할 수 없고 [사용자 중심](/user-centric-performance-metrics/#how-metrics-are-measured) 결과를 반영하지도 않기 때문에 Core Web Vitals 세트에 속하지는 않습니다.

## 진화하는 Web Vitals

Web Vitals 및 Core Web Vitals는 개발자가 웹 전반에 대한 경험의 품질을 측정하기 위해 현재 사용할 수 있는 최상의 신호를 나타내지만 이러한 신호는 완벽하지 않으며 향후 개선 또는 추가가 이루어질 수 있습니다.

**Core Web Vitals**는 모든 웹페이지와 관련이 있으며 관련 Google 도구 전반에서 제공됩니다. 이러한 메트릭이 변경되는 경우 광범위한 영향을 미치기 때문에 개발자는 Core Web Vitals의 정의 및 임계값이 안정적이고, 사전 통지 및 예측 가능한 연간 주기로 업데이트가 이루어질 것임을 기대합니다.

다른 Web Vitals는 컨텍스트 또는 도구별로 달라지며 Core Web Vitals보다 더 실험적일 수 있습니다. 따라서 정의와 임계값이 더 자주 변경될 수 있습니다.

Web Vitals에 대한 모든 변경 사항은 공개된 이 [변경 로그](http://bit.ly/chrome-speed-metrics-changelog)에 명확하게 문서화됩니다.
