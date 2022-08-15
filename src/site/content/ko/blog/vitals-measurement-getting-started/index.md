---
title: Web Vitals 측정 시작하기
authors:
  - katiehempenius
date: 2020-05-27
updated: 2022-07-18
hero: image/admin/QxMJKZcue9RS5u05XxTE.png
alt: LCP, FID 및 CLS라는 라벨이 붙은 스톱워치가 오버레이된 월별 그래프
description: 실제 환경과 실험실 환경 모두에서 사이트의 Web Vitals를 측정하는 방법을 알아보세요.
tags:
  - blog
  - performance
  - web-vitals
---

사이트에서 Web Vital에 대한 데이터를 수집하는 것은 이를 개선하기 위한 첫 번째 단계입니다. 전반적인 분석은 실제 환경과 실험실 환경 모두에서 성능 데이터를 수집합니다. Web Vitals 측정에는 최소한의 코드 변경이 필요하며 무료 도구를 사용하여 수행할 수 있습니다.

## RUM 데이터를 사용하여 Web Vitals 측정

필드 데이터라고도 알려진 [Real User Monitoring](https://en.wikipedia.org/wiki/Real_user_monitoring)(실제 사용자 모니터링, RUM) 데이터는 사이트의 실제 사용자가 경험하는 성능을 포착합니다. RUM 데이터는 Google에서 사이트가 [권장되는 Core Web Vitals 임계값](/vitals/)을 충족하는지 확인하는 데 사용됩니다.

### 시작하기

RUM 설정이 없는 경우 다음 도구를 사용하여 사이트의 실제 성능에 대한 데이터를 빠르게 제공할 수 있습니다. 이러한 도구는 모두 동일한 기본 데이터 세트([Chrome User Experience Report](https://developer.chrome.com/docs/crux/))를 기반으로 하지만 사용 사례가 약간 다릅니다.

- **PageSpeed Insights(PSI)** : [PageSpeed Insights](https://pagespeed.web.dev/)는 지난 28일 동안 집계된 페이지 수준 및 원본 수준 성능에 대해 보고하며 성능 개선 방법을 제안합니다. 사이트의 Web Vitals 측정 및 개선을 하나로 시작하고 싶다면 PSI를 사용하여 사이트를 감사하는 것이 좋습니다. PSI는 [웹](https://pagespeed.web.dev/) 또는 [API](https://developers.google.com/speed/docs/insights/v5/get-started)를 통해 이용할 수 있습니다.
- **Search Console** : [Search Console](https://search.google.com/search-console/welcome)은 페이지별로 성능 데이터를 보고합니다. 따라서 개선이 필요한 특정 페이지를 식별하는 데 적합합니다. PageSpeed Insights와 달리 Search Console 보고에는 과거 성능 데이터 내역이 포함됩니다. Search Console은 본인이 소유하고 있으며 소유권이 확인된 사이트에서만 사용할 수 있습니다.
- **CrUX 대시보드**: [CrUX 대시보드](https://developers.google.com/web/updates/2018/08/chrome-ux-report-dashboard)는 선택한 출처에 대한 CrUX 데이터를 표시하는 사전 구축된 대시보드입니다. Data Studio를 기반으로 구축되며 설정 프로세스는 약 1분 정도 소요됩니다. PageSpeed Insights 및 Search Console과 비교했을 때 CrUX 대시보드 보고는 더 많은 차원을 포함합니다. 예를 들면 데이터를 장치 및 연결 유형별로 분류할 수 있습니다.

위에 나열된 도구는 Web Vitals 측정을 "시작"하는 데 적합할 뿐만 아니라 다른 곳에서도 유용할 수 있습니다. 특히 CrUX와 PSI는 모두 API로 제공되며 [대시보드](https://dev.to/chromiumdev/a-step-by-step-guide-to-monitoring-the-competition-with-the-chrome-ux-report-4k1o) 및 기타 보고를 구축하는 데 사용할 수 있습니다.

### RUM 데이터 수집

CrUX 기반 도구는 Web Vitals 성능을 조사하기 위한 좋은 출발점이지만, 자체 RUM으로 이를 보완하는 방법을 적극 추천합니다. 직접 수집한 RUM 데이터는 사이트 성능에 대한 보다 자세하고 즉각적인 피드백을 제공하기 때문에 문제를 쉽게 식별하고 가능한 솔루션을 테스트할 수 있습니다.

{% Aside %} CrUX 기반 데이터 소스는 약 1개월 단위로 데이터를 보고하지만 세부 내용은 도구에 따라 조금씩 다릅니다. 예를 들어 PSI와 Search Console은 지난 28일 동안 관찰된 성능을 보고하는 반면 CrUX 데이터 세트와 대시보드는 월별로 분류하여 보고합니다. {% endAside %}

전용 RUM 제공자를 이용하거나, 고유한 도구를 설정하여 본인에게 필요한 RUM 데이터를 수집할 수 있습니다.

전용 RUM 공급자는 RUM 데이터 수집 및 보고를 전문으로 합니다. 이러한 서비스와 함께 Core Web Vitals를 사용하려면 RUM 공급자에게 사이트에서 Core Web Vitals 모니터링을 활성화하는 방법을 문의하세요.

RUM 공급자를 이용하지 않는 경우, [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)를 사용하여 이러한 메트릭을 수집하고 보고하도록 기존 분석 설정을 보강할 수 있습니다. 아래에서 이러한 방식에 대한 자세한 설명을 확인해주세요.

### web-vitals JavaScript 라이브러리

Web Vitals에 대해 자체적인 RUM 설정을 구현하려는 경우, Web Vitals 측정을 수집하는 가장 쉬운 방법은 사용하는 [`web-vitals`](https://github.com/GoogleChrome/web-vitals) JavaScript 라이브러리를 사용하는 것입니다. `web-vitals`는 [현장에서 측정 가능](/user-centric-performance-metrics/#in-the-field)한 각 Web Vitals 메트릭을 수집하고 보고하기 위한 편리한 API를 제공하는 소규모 모듈식 라이브러리(~1KB)입니다.

Web Vital을 구성하는 메트릭은 모두 브라우저의 빌트인 성능 API에 의해 직접적으로 노출되는 것이 아니라, 이를 기반으로 구축됩니다. 예를 들어 [Cumulative Layout Shift(누적 레이아웃 이동, CLS)](/cls/)는 [Layout Instability API](https://wicg.github.io/layout-instability/)를 사용해 구현됩니다. `web-vitals`를 사용하면 이러한 메트릭을 직접 구현하는 것에 대해 걱정할 필요가 없으며, 수집한 데이터가 각 메트릭에 대한 방법론 및 모범 사례와 일치하는지 확인할 수 있습니다.

`web-vitals` 구현에 대한 자세한 내용은 [문서](https://github.com/GoogleChrome/web-vitals) 및 [현장의 Web Vitals 측정에 대한 모범 사례](/vitals-field-measurement-best-practices/)를 참조하세요.

### 데이터 집계

`web-vitals`가 수집한 측정값을 보고하는 것이 중요합니다. 이 데이터가 측정되었으나 보고되지 않은 경우에는 절대 확인할 수 없기 때문이죠. `web-vitals` 문서에는 데이터를 [API 엔드포인트](https://github.com/GoogleChrome/web-vitals#send-the-results-to-an-analytics-endpoint), [Google Analytics](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics) 또는 [Google Tag Manager](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-tag-manager)로 보내는 방법을 보여주는 예시가 기재되어 있습니다.

선호하는 보고 도구가 이미 있는 경우 해당 도구를 사용하는 것이 좋습니다. 그렇지 않은 경우 무료로 제공되는 Google Analytics를 이러한 용도로 사용할 수 있습니다.

사용할 도구를 고려할 때 누가 데이터에 액세스하게 될지 고려하는 것이 좋습니다. 기업은 일반적으로 단일 부서가 아니라 회사 전체가 성능 개선에 관심을 가질 때 가장 큰 성과를 거둡니다. 다른 부서의 승인을 받는 방법을 알아보려면 [전체적인 웹 사이트 속도 수정](/fixing-website-speed-cross-functionally/)을 참조하세요.

### 데이터 해석

성능 데이터를 분석할 때는 분포의 꼬리에 관심을 기울이는 게 중요합니다. RUM 데이터는 성능이 다양하다는 것을 보여주는 경우가 많습니다. 빠른 속도를 경험하는 사용자도 있고, 느린 속도를 경험하는 사용자도 있습니다. 그러나 중앙값을 사용하여 데이터를 요약하면 이러한 부분이 쉽게 가려집니다.

Google은 Web Vitals에 대해 중앙값 또는 평균과 같은 통계가 아닌 "원활한" 경험의 비율을 사용하여 사이트 또는 페이지가 권장 임계값을 충족하는지 결정합니다. 특히 사이트 또는 페이지가 Core Web Vitals 임계값을 충족하는 것으로 간주되려면 페이지 방문의 75%가 각 메트릭에 대한 "양호" 임계값을 충족해야 합니다.

## 실험실 데이터를 사용하여 Web Vitals 측정

인공적 데이터라고도 불리는 [실험실 데이터](/user-centric-performance-metrics/#in-the-lab)는 실제 사용자가 아닌 통제된 환경에서 수집됩니다. 실험실 데이터는 RUM 데이터와 달리 사전 프로덕션 환경에서 수집할 수 있으므로 개발자 워크플로 및 지속적인 통합 프로세스에 통합할 수 있습니다. 인공적 데이터를 수집하는 도구의 예로는 Lighthouse 및 WebPageTest가 있습니다.

### 고려 사항

RUM 데이터와 실험실 데이터 사이에는 항상 불일치가 있습니다. 특히 네트워크 조건, 장치 유형 또는 실험실 환경의 위치가 사용자의 환경과 크게 다른 경우에는 더욱 그렇습니다. 그러나 Web Vitals 메트릭에 대한 실험실 데이터를 수집할 때는 특히 유의해야 할 특정 고려 사항이 몇 가지 있습니다.

- **Cumulative Layout Shift(누적 레이아웃 이동, CLS):** 실험실 환경에서 측정된 [누적 레이아웃 이동](/cls/)은 RUM 데이터에서 관찰된 CLS보다 인위적으로 낮을 수 있습니다. CLS는 *"페이지의 전체 수명 동안* 발생하는 예기치 않은 모든 레이아웃 전환에 대한 개별 레이아웃 전환 점수의 합계"로 정의됩니다. 그러나 페이지의 수명은 일반적으로 실제 사용자가 로드하는지, 인위적인 성능 측정 도구에 의해 로드되는지에 따라 크게 달라집니다. 대부분의 실험실 도구는 페이지만 로드하고 상호 작용하지 않으므로, 결과적으로 초기 페이지 로드 중에 발생하는 레이아웃 이동만 포착하게 됩니다. 그러나 RUM 도구로 측정한 CLS는 페이지의 전체 수명 동안 발생하는 [예기치 않은 레이아웃의 변화](/cls/#expected-vs.-unexpected-layout-shifts)를 모두 포착합니다.
- **First Input Delay(최초 입력 지연, FID):** [최초 입력 지연](/fid/) 은 페이지에 대한 사용자 상호 작용이 필요하기 때문에 실험실 환경에서 측정할 수 없습니다. 이로 인해 실험실에서는 FID를 대체해 [Total Blocking Time](/tbt/)(총 차단 시간, TBT)을 사용하도록 권장됩니다. TBT는 "First Contentful Paint(최초 콘텐츠풀 페인트, FCP)와 Time to Interactive(상호 작용까지의 시간, TTI) 사이에서 페이지가 사용자 입력에 응답하지 못하도록 차단되는 총 시간"을 측정합니다. FID와 TBT는 다르게 계산되지만 둘 다 부트스트랩 프로세스 동안 차단된 메인 스레드를 반영하며, 메인 스레드가 차단되는 경우 브라우저에서는 사용자 상호 작용에 대한 응답이 지연됩니다. FID는 가능한 경우 사용자가 페이지와 처음 상호작용을 시도할 때 발생하는 지연을 측정합니다.

### 도구

다음 도구를 사용하여 Web Vitals의 실험실 측정값을 수집할 수 있습니다.

- **Web Vitals Chrome 확장 프로그램:** Web Vitals Chrome [확장 프로그램](https://github.com/GoogleChrome/web-vitals-extension)은 주어진 페이지에 대한 Core Web Vitals(LCP, FID 및 CLS)를 측정하고 보고합니다. 이 도구는 개발자에게 코드 변경 시 실시간 성능 피드백을 제공하기 위해 제작되었습니다.
- **Lighthouse:** Lighthouse는 LCP, CLS 및 TBT를 보고하고 가능한 성능 개선 사항도 강조합니다. Lighthouse는 Chrome DevTools에서 Chrome 확장 프로그램 및 npm 패키지로 사용할 수 있습니다. Lighthouse는 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)를 통해 지속적인 통합 워크플로에 통합될 수도 있습니다.
- **WebPageTest:** [WebPageTest](https://webpagetest.org/)는 표준 보고의 일부로 Web Vitals를 포함합니다. WebPageTest는 특정 장치 및 네트워크 조건에서 Web Vitals에 대한 정보를 수집하는 데 유용합니다.
