---
title: Core Web Vitals 측정 도구
subhead: 이제 즐겨 사용하는 개발자 도구로 Core Web Vitals를 측정할 수 있습니다.
authors:
  - addyosmani
  - egsweeny
date: 2020-05-28
description: Lighthouse, PageSpeed Insights, Chrome UX Report 등과 같은 인기 있는 웹 개발자 도구 전반에서 사용할 수 있는 최신 이니셔티브인 Core Web Vitals 측정 지원에 대해 알아보세요.
hero: image/admin/wNtXgv1OE2OETdiSzi8l.png
thumbnail: image/admin/KxBRBQe5CRZpCxNYyW2H.png
alt: Chrome User Experience 로고, PageSpeed Insights 로고, Lighthouse 로고, Search Console 로고, Chrome DevTools 로고, Web Vitals 확장 프로그램 로고.
tags:
  - blog
  - web-vitals
  - performance
---

최근에 발표된 [Web Vitals](/vitals/) 이니셔티브는 모든 사이트가 웹에서 뛰어난 사용자 경험을 제공하는 데 필수적인 품질 신호에 대한 통합적인 지침을 제공합니다. 이제 **웹 개발자가 즐 겨 사용하는 Google의 모든 인기 도구가 Core Web Vitals 측정을 지원**하여 사용자 경험 문제를 보다 쉽게 진단하고 수정할 수 있게 되었습니다. 이러한 도구에는 [Lighthouse](https://github.com/GoogleChrome/lighthouse) , [PageSpeed Insights](https://pagespeed.web.dev/) , [Chrome DevTools](https://developer.chrome.com/docs/devtools/) , [Search Console](https://search.google.com/search-console/about) , [web.dev의 측정 도구](/measure/) , [Web Vitals Chrome 확장 프로그램](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) 및 새로운 [Chrome UX Report](https://developer.chrome.com/docs/crux/) API가 포함됩니다.

이제 Google 검색에 Core Web Vitals가 [페이지 경험](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html) 평가의 기초로 포함되므로 이러한 메트릭을 가능한 한 사용 및 실행 가능하게 만드는 것이 중요합니다.

<figure>{% Img src="image/admin/V00vjrHmwzljYo04f3d3.png", alt="Core Web Vitals 메트릭을 지원하는 Chrome 및 Search Tools 요약", width="800", height="509" %}</figure>

{% Aside 'key-term' %} **실험실 도구**는 *잠재적인 사용자*가 웹사이트를 어떻게 경험할 것인지에 대한 통찰력을 제공하고 디버깅을 위한 재현 가능한 결과를 제공합니다. **필드** 도구는 *실제 사용자* 가 웹사이트를 경험하는 방식에 대한 통찰력을 제공합니다. 이러한 유형의 측정을 Real User Monitoring(실제 사용자 모니터링, RUM)이라고 합니다. 각 [실험실 또는 필드 도구](/how-to-measure-speed/#lab-data-vs-field-data)는 사용자 경험을 최적화하기 위한 고유한 가치를 제공합니다. {% endAside %}

Core Web Vitals로 사용자 경험을 최적화하는 여정을 시작하려면 다음 워크플로를 따라해보세요.

- Search Console의 새로운 Core Web Vitals Report를 사용해 주의가 필요한 페이지 그룹을 식별하세요(필드 데이터 기반).
- 작업이 필요한 페이지를 식별했으면 PageSpeed Insights(Lighthouse 및 Chrome UX Report 기반)를 사용하여 페이지의 실험실 및 필드 문제를 진단합니다. PageSpeed Insights(PSI)는 Search Console을 통해 사용하거나 PSI에 직접 URL을 입력할 수 있습니다.
- 실험실에서 로컬로 사이트를 최적화할 준비가 되었나요? Lighthouse 및 Chrome DevTools를 사용하여 Core Web Vitals를 측정하고 정확히 무엇을 수정해야 할지 실행 가능한 지침을 확보하세요. Web Vitals Chrome 확장 프로그램을 사용하면 데스크톱에서 실시간으로 메트릭을 볼 수 있습니다.
- Core Web Vitals의 맞춤형 대시보드가 필요하신가요? 업데이트된 CrUX Dashboard 또는 필드 데이터를 위한 새로운 Chrome UX Report API를 사용하거나 실험실 데이터를 위한 PageSpeed Insights API를 사용하세요.
- 지침을 찾고 계신가요? web.dev/measure는 PSI 데이터를 사용해 페이지를 측정하고 최적화를 위한 우선순위 가이드 및 Codelab 세트를 표시합니다.
- 마지막으로, 변경 사항을 프로덕션에 배포하기 전에 회귀가 없더록 Lighthouse CI를 사용하여 Core Web Vitals으로 요청을 풀링하세요.

여기까지는 간단한 소개였습니다. 이제 각 업데이트에 대해 좀 더 자세히 알아보죠!

### Lighthouse

Lighthouse는 개발자가 문제를 진단하고 사이트의 사용자 경험을 개선할 기회를 식별할 수 있도록 지원하는 자동화된 웹사이트 감사 도구입니다. 실험실 환경에서 성능 및 접근성을 포함한 여러 차원의 사용자 경험 품질을 측정합니다. 최신 버전의 Lighthouse( [6.0](/lighthouse-whats-new-6.0/) , 2020년 5월 중순 출시)에는 추가 감사, 새로운 메트릭 및 새로 구성된 성능 점수가 포함되어 있습니다.

<figure>{% Img src="image/admin/4j72CWywp2D88Xti8zBf.png", alt="최신 Core Web Vitals 메트릭을 표시하는 Lighthouse 6.0", width="800", height="527" %}</figure>

Lighthouse 6.0은 보고서에 세 가지 새로운 메트릭을 도입했습니다. 이러한 새로운 메트릭 중 [Large Contentful Paint](/lcp/)(최대 콘텐츠풀 페인트, LCP) 및 [Cumulative Layout Shift](/cls/)(누적 레이아웃 이동, CLS)는 Core Web Vitals의 실험실 구현이며 사용자 경험을 최적화하기 위한 중요한 진단 정보를 제공합니다. 사용자 경험 평가의 중요성을 감안할 때 새로운 메트릭은 측정되어 보고서에 포함될 뿐만 아니라 성능 점수 계산에도 고려됩니다.

Lighthouse에 포함된 세 번째 새로운 메트릭인 [Total Blocking Time](/tbt/)(총 차단 시간, TBT)은 또 다른 Core Web Vitals 메트릭인 [First Input Delay](/fid/)(최초 입력 지연, FID) 필드 메트릭과 관련성이 큽니다. Lighthouse 보고서에 제공된 권장 사항을 따르고 점수에 맞게 최적화하면 사용자에게 가능한 최고의 경험을 제공할 수 있습니다.

Lighthouse가 제공하는 모든 제품은 최신 버전을 반영하도록 업데이트됩니다. 여기에는 병합 및 배포 전에 풀링 요청에 대한 Core Web Vitals를 쉽게 측정할 수 있는 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)가 포함됩니다.

<figure>{% Img src="image/admin/aOm5ZAIUbspjcyRMIXbn.png", alt="최대 콘텐츠풀 페인트로 diff 보기를 표시하는 Lighthouse CI", width="800", height="498" %}</figure>

Lighthouse의 최신 업데이트에 대해 자세히 알아보려면 [Lighthouse 6.0의 새로운 기능](/lighthouse-whats-new-6.0/) 블로그 게시물을 확인하세요.

### PageSpeed Insights

[PageSpeed Insights](https://pagespeed.web.dev/)(PSI)는 모바일 및 데스크톱 장치 모두에서 페이지의 실험실 및 현장 성능에 대해 보고합니다. 이 도구는 실제 사용자가 페이지를 경험하는 방식에 대한 개요(Chrome UX Report로 제공)와 사이트 소유자가 페이지 경험을 개선하기 위해 실행 가능한 권장 사항(Lighthouse로 제공)을 제공합니다.

PageSpeed Insights 및 [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) 역시 내부에서 Lighthouse 6.0을 사용하도록 업그레이드되었으며 이제 보고서의 실험실 및 필드 섹션 모두에서 Core Web Vitals 측정을 지원합니다! Core Web Vitals에는 아래와 같이 파란색 리본이 표시됩니다.

<figure>{% Img src="image/admin/l1posckVsR7JeVGnk6Jv.png", alt="PageSpeed Insights에서 필드 및 실험실용으로 표시되는 Core Web Vitals 데이터", width="800", height="873" %}</figure>

[Search Console](https://search.google.com/search-console/)은 사이트 소유자에게 주의가 필요한 페이지 그룹에 대한 개요를 제공하는 반면, PSI는 페이지 경험을 개선할 수 있는 페이지당 기회를 식별하는 데 도움이 됩니다. PSI에서는 보고서 상단에 **Core Web Vitals 평가 합격** 또는 **Core Web Vitals 평가 불합격** 여부가 표시되므로 해당 페이지가 모든 Core Web Vitals 평가에서 우수한 경험을 위한 임계값을 충족하는지 여부를 명확하게 확인할 수 있습니다.

### CrUX

[Chrome UX Report](https://developer.chrome.com/docs/crux/)(CrUX)는 수백만 개의 웹사이트에 대한 실제 사용자 경험 데이터의 공개 데이터 세트로 모든 Core Web Vitals의 필드 버전을 측정합니다. 실험실 데이터와 달리 CrUX 데이터는 필드에서 [옵트인된 사용자](https://developer.chrome.com/docs/crux/methodology/#user-eligibility)가 제공합니다. 개발자는 이러한 데이터를 사용하여 자신 또는 경쟁업체의 웹사이트에서 실제 사용자 경험의 분포를 이해할 수 있습니다. 사이트에 대한 RUM이 없더라도 CrUX는 Core Web Vitals를 평가하기 위한 쉽고 빠른 방법을 제공해줍니다. [BigQuery의 CrUX 데이터 세트](https://developer.chrome.com/docs/crux/bigquery/)에는 모든 Core Web Vital에 대한 세분화된 성능 데이터가 포함되어 있으며 원본 수준의 월별 스냅샷에서 사용할 수 있습니다.

사이트가 사용자를 위해 어떻게 작동하는지 제대로 알 수 있는 유일한 방법은 해당 사용자가 사이트를 로드하고 상호 작용할 때 필드에서 사이트의 성능을 실제로 측정하는 것입니다. 이러한 측정 유형을 일반적으로 Real User Monitoring(실제 사용자 모니터링, RUM)이라고 합니다. 사이트에 대한 RUM이 없더라도 CrUX는 Core Web Vitals를 평가하기 위한 쉽고 빠른 방법을 제공해줍니다.

**CrUX API 소개**

개발 워크플로를 원본 및 URL 수준 품질 측정과 쉽고 빠르게 통합할 수 있게 해주는 무료 [CrUX API](http://developers.google.com/web/tools/chrome-user-experience-report/api/reference/)를 발표하게 되어 기쁩니다. 다음 필드 메트릭에 대해 사용할 수 있습니다.

- Largest Contentful Paint(최대 콘텐츠풀 페인트, LCP)
- Cumulative Layout Shift(누적 레이아웃 이동, CLS)
- First Input Delay(최초 입력 지연, FID)
- First Contentful Paint(최초 콘텐츠풀 페인트, FCP)

개발자는 원본 또는 URL을 쿼리하고 다양한 폼 팩터로 결과를 분류할 수 있습니다. API는 매일 업데이트되며 이전 28일 동안의 데이터를 요약합니다(월별로 집계되는 BigQuery 데이터세트와 다름). 또한 해당 API에는 다른 API인 PageSpeed Insights API(하루 25,000개 요청)에 적용하는 것과 동일한 완화된 공개 API 할당량을 적용합니다.

다음은 CrUX API를 사용하여 **양호(good)**, **개선 필요(needs improvement)** 또는 **나쁨(poor)** 상태의 분포를 통해 Core Web Vitals 메트릭을 시각화해주는 [데모](/chrome-ux-report-api/)입니다.

<figure>{% Img src="image/admin/ye3CMKfacSItYA2lqItP.png", alt="Core Web Vitals 메트릭을 보여주는 Chrome User Experience Report API 데모", width="800", height="523" %}</figure>

향후 릴리스에서는 추가 CrUX 데이터 세트 차원 및 메트릭에 액세스할 수 있도록 API를 확장할 계획입니다.

**개선된 CrUX Dashboard**

새롭게 재설계된 [CrUX Dashboard](http://g.co/chromeuxdash)를 사용하면 시간 경과에 따른 원본의 성능을 쉽게 추적하고, 이를 사용하여 모든 Core Web Vitals 메트릭의 분포를 모니터링할 수 있습니다. Dashboard를 시작하려면 web.dev에서 [튜토리얼](/chrome-ux-report-data-studio-dashboard/)을 확인하세요.

<figure>{% Img src="image/admin/OjbICyhI21RNfGXrFP1x.png", alt="새 랜딩 페이지에서 Core Web Vitals를 표시하는 Chrome UX Report Dashboard", width="800", height="497" %}</figure>

사이트 성능을 한눈에 훨씬 더 쉽게 파악할 수 있도록 새로운 Core Web Vitals 랜딩 페이지를 도입했습니다. CrUX 도구에 대한 피드백은 언제나 환영입니다. [@ChromeUXReport](https://twitter.com/chromeuxreport) Twitter 계정 또는 [Google 그룹](https://groups.google.com/a/chromium.org/g/chrome-ux-report)으로 다양한 생각과 질문을 공유해주세요.

### Chrome DevTools 성능 패널

**Experience 섹션의 레이아웃 이동 이벤트 디버그**

Chrome DevTools **Performance** 패널에는 예기치 않은 레이아웃 이동을 감지하는 데 도움이 되는 새로운 **[Experience 섹션](https://developers.google.com/web/updates/2020/05/devtools#cls)**이 있습니다. 이는 페이지에서 누적 레이아웃 이동을 야기하는 불안정한 시각적 문제를 찾고 수정하는 데 유용합니다.

<figure>{% Img src="image/admin/VMbZAgKCi5V6FiQyu631.png", alt="Performance 패널에서 빨간색으로 표시되는 누적 레이아웃 이동", width="800", height="517" %}</figure>

Layout Shift를 선택하여 **Summary** 탭에서 세부 정보를 볼 수 있습니다. 이동 자체가 발생한 위치를 시각화하려면 **Moved from** 및 **Moved to** 필드 위로 마우스를 가져가세요.

**바닥글의 총 차단 시간으로 상호 작용 준비 상태 디버그**

총 차단 시간(TBT) 메트릭은 실험실 도구에서 측정할 수 있으며 최초 입력 지연의 대체로 사용하기 좋습니다. TBT는 입력 응답을 방지할 수 있을 정도로 오래 메인 스레드가 차단된 경우 [First Contentful Paint](/fcp/)(최초 콘텐츠풀 페인트, FCP)와 [Time to Interactive](/tti/)(상호 작용까지의 시간, TTI) 사이의 총 시간을 측정합니다. 실험실에서 TBT를 개선하는 성능 최적화는 필드에서 FID를 개선할 수 있습니다.

<figure>{% Img src="image/admin/WufuLpvrZfgbRn70C74V.png", alt=" DevTools Performance 패널의 바닥글에 표시되는 총 차단 시간", width="800", height="517" %}</figure>

이제 페이지 성능을 측정할 때 Chrome DevTools **Performance** 패널의 바닥글에 TBT가 표시됩니다.

{% Instruction 'devtools-performance', 'ol' %}

1. **Record**를 클릭합니다.
2. 페이지를 수동으로 새로고침합니다.
3. 페이지가 로드될 때까지 기다렸다가 기록을 중지합니다.

자세한 내용은 [DevTools의 새로운 기능(Chrome 84)](https://developers.google.com/web/updates/2020/05/devtools#cls)을 참조하세요.

### Search Console

Search Console의 새로운 [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520) 는 CrUX의 실제(필드) 데이터를 기반으로 사이트에서 주의가 필요한 페이지 그룹을 식별할 수 있게 해줍니다. URL 성능은 상태, 메트릭 유형 및 URL 그룹(유사한 웹 페이지의 그룹)별로 나뉩니다.

<figure>{% Img src="image/admin/BjTUt0xdWXD9hrLsbhLK.png", alt="Search Console의 새로운 Core Web Vitals Report", width="800", height="1000" %}</figure>

이 보고서는 LCP, FID, CLS 등 세 가지 Core Web Vitals 메트릭을 기반으로 합니다. URL에 이러한 메트릭에 대한 최소량의 보고 데이터가 없다면 보고서에서 생략됩니다. 원본의 성능을 전체적으로 보려면 새로운 보고서를 사용해보세요.

Core Web Vitals 관련 문제가 있는 페이지 유형을 식별하면 PageSpeed Insights를 통해 해당 페이지에 특정한 최적화 방법을 제안받을 수 있습니다.

#### web.dev

[web.dev/measure](/measure/)를 사용하면 시간 경과에 따른 페이지 성능을 측정하고 개선을 위한 우선순위 가이드 및 Codelab 세트 목록을 표시합니다. 이러한 PageSpeed Insights에서 제공합니다. 측정 도구는 이제 아래와 같이 Core Web Vitals 메트릭도 지원합니다.

<figure>{% Img src="image/admin/ryoV1T1PhxUmo9zdCsDe.png", alt="web.dev 특정 도구로 시간 경과에 따른 Core Web Vitals 측정 및 우선순위 가이드 받기", width="800", height="459" %}</figure>

### Web Vitals 확장 프로그램

Web Vitals 확장 프로그램은 데스크톱 Google Chrome에 대한 3개의 핵심 Web Vitals 메트릭을 실시간으로 측정합니다. 이는 개발 워크플로 초기에 문제를 파악하고 웹을 탐색할 때 Core Web Vitals의 성능을 평가하기 위한 진단 도구로 유용합니다.

이제 이 확장 프로그램을 [Chrome Web Store](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)에서 설치할 수 있으므로 유용하게 활용하시기 바랍니다. 프로젝트의 [GitHub](https://github.com/GoogleChrome/web-vitals-extension/) 리포지토리에 대한 피드백과 개선 사항은 언제든 환영입니다.

<figure>{% Img src="image/admin/woROdEmNV4jlHDPryjBQ.png", alt="Web Vitals Chrome 확장 프로그램에 실시간으로 표시되는 Core Web Vitals", width="800", height="459" %}</figure>

#### 하이라이트

여기까지입니다! 이후 다음을 시도해보세요.

- DevTools에서 **Lighthouse**를 사용하여 사용자 경험을 최적화하고 필드에서 Core Web Vitals를 충족할 수 있도록 준비합니다.
- **PageSpeed Insights** 를 사용하여 실험실과 필드의 Core Web Vitals 성능을 비교해보세요.
- 새로운 **Chrome User Experience Report API** 를 사용해 원본 및 URL에서 지난 28일 동안 Core Web Vitals가 얼마나 잘 충족되었는지 쉽게 확인할 수 있습니다.
- **Experience** 섹션 및 DevTools **Performance** 패널의 바닥글을 통해 특정 Core Web Vitals에 대해 심층적으로 파악하고 디버그하세요.
- **Search Console의 Core Web Vitals Report**를 사용해 필드에서의 원본 성능에 대한 요약을 받으세요.
- **Web Vitals 확장 프로그램**을 사용하여 Core Web Vitals을 기반으로 한 페이지 성능을 실시간으로 추적하세요.

Core Web Vitals 도구에 대한 자세한 내용은 6월 [web.dev Live](/live/)에서 다룰 예정입니다. 이벤트에 대한 업데이트를 받으려면 등록해주세요!

~ WebPerf 관리인 Elizabeth와 Addy 씀
