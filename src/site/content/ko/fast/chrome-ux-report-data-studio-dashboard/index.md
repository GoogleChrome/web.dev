---
layout: post
title: Data Studio에서 CrUX 대시보드 사용
authors:
  - rviscomi
hero: image/admin/k3hWnnwqTvg7w7URsbIK.png
description: Data Studio는 Chrome UX Report와 같은 빅 데이터 소스를 기반으로 대시보드를 구축할 수 있는 강력한 데이터 시각화 도구입니다. 이 가이드에서는 출처의 사용자 환경을 추적하기 위해 고유한 사용자 지정 CrUX Dashboard를 만드는 방법에 대해 알아봅니다.
date: 2020-06-22
updated: 2022-07-18
tags:
  - performance
  - blog
  - chrome-ux-report
---

[Data Studio](https://marketingplatform.google.com/about/data-studio/)[는](https://developer.chrome.com/docs/crux/)[Chrome UX Report](https://developer.chrome.com/docs/crux/)(CrUX)와 같은 빅 데이터 소스를 기반으로 대시보드를 구축할 수 있는 강력한 데이터 시각화 도구입니다. 이 가이드에서는 출처의 사용자 환경을 추적하기 위해 고유한 사용자 지정 CrUX Dashboard를 만드는 방법에 대해 알아봅니다.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX Dashboard", width="800", height="598" %}

CrUX Dashboard는 [커뮤니티 커넥터(Community Connector)](https://developers.google.com/datastudio/connector/)라는 Data Studio 기능에 기반하여 구축되었습니다. 이 커넥터는 [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report)의 원시 CrUX 데이터와 Data Studio의 시각화 간에 미리 설정된 링크입니다. 대시보드 사용자가 쿼리를 작성하거나 어떠한 차트도 생성할 필요가 없습니다. 모든 것이 사용자를 위해 만들어졌습니다. 출처를 제공하기만 하면 사용자 지정 대시보드가 만들어집니다.

## 대시보드 만들기

시작하려면 [g.co/chromeuxdash](https://g.co/chromeuxdash)로 이동하세요. 그러면 대시보드가 생성될 출처를 제공할 수 있는 CrUX 커뮤니티 커넥터 페이지로 이동합니다. 처음에 사용자는 권한 또는 마케팅 기본 설정 프롬프트를 완료해야 할 수 있습니다.

{% Img src="image/admin/SSUqCau3HiN5qBbewX6h.png", alt="CrUX 대시보드 커넥터", width="800", height="484" %}

텍스트 입력 필드는 전체 URL이 아닌 출처만 허용합니다. 예:

{% Compare 'better', 'Origin (Supported)' %}

```text
https://web.dev
```

{% endCompare %}

{% Compare 'worse', 'URL (Not supported)' %}

```text
https://web.dev/chrome-ux-report-data-studio-dashboard/
```

{% endCompare %}

프로토콜을 생략하면 HTTPS가 가정됩니다. 하위 도메인은 중요합니다. 예를 들어 `https://developers.google.com` 및 `https://www.google.com`은 서로 다른 출처로 간주됩니다.

출처와 관련된 몇 가지 일반적인 문제는 `https://` 대신 `http://`와 같이 잘못된 프로토콜을 제공하고 필요할 때 하위 도메인을 생략하는 것입니다. 일부 웹 사이트에는 리디렉션이 포함되어 있으므로 `http://example.com`이 `https://www.example.com`으로 리디렉션되는 경우 출처의 정식 버전인 후자를 사용해야 합니다. 일반적으로 URL 표시줄에 표시되는 출처를 사용합니다.

출처가 CrUX 데이터 세트에 포함되어 있지 않은 경우 아래와 같은 오류 메시지가 표시될 수 있습니다. 데이터 세트에는 400만 개 이상의 출처가 있지만 원하는 출처에 포함될 데이터가 충분하지 않을 수 있습니다.

{% Img src="image/admin/qt0jWTgtdS93hDKW2SCm.png", alt="CrUX 대시보드 오류 메시지", width="800", height="409" %}

출처가 있는 경우 대시보드의 스키마 페이지로 이동합니다. 이 페이지에는 포함된 모든 필드가 표시됩니다. 각 유효 연결 유형, 각 폼 팩터, 데이터 세트 릴리스 월, 각 메트릭의 성능 분포, 물론 출처 이름 등이 표시됩니다. 이 페이지에서 작업을 수행하거나 변경할 필요가 없습니다. 계속하려면 **보고서 생성**을 클릭하기만 하면 됩니다.

{% Img src="image/admin/DTNigYO4gUwovCuCgyhH.png", alt="CrUX 대시보드 스키마", width="800", height="403" %}

## 대시보드 사용

각 대시보드에는 세 가지 유형의 페이지가 있습니다.

1. Core Web Vitals 개요
2. 메트릭 성능
3. 사용자 인구통계

각 페이지에는 사용 가능한 각 월별 릴리스에 대한 시간 경과에 따른 분포를 보여주는 차트가 포함되어 있습니다. 새로운 데이터 세트가 릴리스될 때 대시보드를 새로 고치기만 하면 최신 데이터를 얻을 수 있습니다.

월간 데이터 세트는 매월 두 번째 화요일에 릴리스됩니다. 예를 들어 5월의 사용자 경험 데이터로 구성된 데이터 세트는 6월 두 번째 화요일에 릴리스됩니다.

### Core Web Vitals 개요

첫 번째 페이지는 출처의 월간 [Core Web Vitals](/vitals/) 성능에 대한 개요입니다. 이것은 Google에서 집중할 것을 권장하는 가장 중요한 UX 측정 항목입니다.

{% Img src="image/admin/h8iCTgvmG4DS2zScvatc.png", alt="CrUX 대시보드 Core Web Vitals 개요", width="800", height="906" %}

데스크탑 및 전화 사용자가 출처를 어떻게 경험하는지 이해하려면 Core Web Vitals 페이지를 사용하십시오. 기본적으로 대시보드를 생성한 시점의 가장 최근 월이 선택됩니다. 이전 또는 최신 월간 릴리스를 변경하려면 페이지 상단의 **월** 필터를 사용하십시오.

기본적으로 태블릿은 이러한 차트에서 생략되지만 필요한 경우 아래에 표시된 바와 같이 막대 차트 구성에서 **태블릿 없음** 필터를 제거할 수 있습니다.

{% Img src="image/admin/lD3eZ3LipJmBGmmkrUvG.png", alt="핵심 Web Vitals 페이지를 표시하도록 CrUX 편집", width="800", height="288" %}

### 메트릭 성능

Core Web Vitals 페이지 다음에 CrUX 데이터 세트의 모든 [메트릭](https://developer.chrome.com/docs/crux/methodology/#metrics)에 대한 독립 실행형 페이지를 찾을 수 있습니다.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX 대시보드 LCP 페이지", width="800", height="598" %}

각 페이지 상단에는 경험 데이터에 포함된 폼 팩터를 제한하는 데 사용할 수 있는 **장치 필터**가 있습니다. 예를 들어 전화 경험을 구체적으로 드릴다운할 수 있습니다. 이 설정은 여러 페이지에 걸쳐 유지됩니다.

이 페이지의 기본 시각화는 "좋음", "개선 필요" 및 "나쁨"으로 분류된 경험의 월별 분포입니다. 차트 아래 색상으로 구분된 범례는 범주에 포함된 경험의 범위를 나타냅니다. 예를 들어 위의 스크린샷에서 "좋음" [Largest Contentful Paint](/lcp/#what-is-a-good-lcp-score)(LCP) 경험의 비율이 변동하고 최근 몇 개월 동안 약간 나빠지는 것을 볼 수 있습니다.

가장 최근 달의 "좋음" 및 "나쁨" 경험 비율이 이전달과의 백분율 차이 지표와 함께 차트 위에 표시됩니다. 이 출처의 경우 "좋음" LCP 경험은 전월 대비 3.2% 하락한 56.04%를 기록했습니다.

{% Aside 'caution' %} Data Studio의 특성으로 인해 종종 `No Data`가 여기에 표시될 수 있습니다. 이것은 정상이며 이전 달의 릴리스가 두 번째 화요일까지 제공되지 않기 때문입니다. {% endAside %}

또한 명백한 백분위수 권장 사항을 제공하는 LCP 및 기타 Core Web Vitals 같은 매트릭의 경우 "좋음"과 "나쁨" 비율 사이의 "P75" 매트릭을 찾을 수 있습니다. 이 값은 출처의 사용자 경험에 대한 75번째 백분위수에 해당합니다. 즉, 경험의 75%가 이 값보다 낫습니다. 한 가지 주의할 점은 이것이 출처에 있는 *모든 장치*의 전체 배포에 적용된다는 것입니다. **장치** 필터로 특정 장치를 전환하면 백분위수가 다시 계산되지 않습니다.

{% Details %} {% DetailsSummary %} 백분위수에 대한 지루한 기술적 주의사항 {% endDetailsSummary%}

백분위수 매트릭은 [BigQuery](/chrome-ux-report-bigquery/)의 히스토그램 데이터를 기반으로 하므로 LCP의 경우 1000ms, FID의 경우 100ms, CLS의 경우 0.05로 세분화됩니다. 즉, 3800ms의 P75 LCP는 실제 75번째 백분위수가 3800ms와 3900ms 사이에 있음을 나타냅니다.

또한 BigQuery 데이터 세트는 사용자 경험의 밀도가 감소하는 입도의 매우 거친 빈으로 본질적으로 그룹화되는 "빈 확산(bin spreading)"이라는 기술을 사용합니다. 이를 통해 4자리의 정밀도를 초과하지 않고도 분포의 꼬리 부분에 미세한 밀도를 포함할 수 있습니다. 예를 들어 3초 미만의 LCP 값은 200ms 너비의 빈으로 그룹화됩니다. 3초에서 10초 사이의 빈은 너비가 500ms입니다. 10초를 초과하면 빈의 너비는 5000ms입니다. 다양한 너비의 빈을 사용하는 대신 빈 확산(bin spreading)은 모든 빈의 너비가 일정한 100ms(최대 공약수)이고 분포가 각 빈에 걸쳐 선형으로 보간되도록 합니다.

PageSpeed Insights와 같은 도구의 해당 P75 값은 공개 BigQuery 데이터 세트를 기반으로 하지 않으며 밀리초 단위의 정밀도 값을 제공할 수 있습니다. {% endDetails %}

### 사용자 인구통계

사용자 인구통계 페이지에는 장치 및 ECT(유효 연결 유형)의 두 가지 [차원](https://developer.chrome.com/docs/crux/methodology/#dimensions)이 포함되어 있습니다. 이 페이지는 각 인구통계의 사용자에 대한 전체 출처의 페이지 화면 분포를 보여줍니다.

장치 배포 페이지는 시간 경과에 따른 전화, 데스크탑 및 태블릿 사용자의 분석 결과를 보여줍니다. 여러 출처에는 태블릿 데이터가 거의 또는 전혀 없는 경향이 있으므로 종종 차트 가장자리에 "0%"가 걸려 있는 것을 볼 수 있습니다.

{% Img src="image/admin/6PXh8MoQTWHnHXf8o1ZU.png", alt="CrUX 대시보드 장치 페이지", width="800", height="603" %}

마찬가지로 ECT 배포 페이지는 4G, 3G, 2G, 느린 2G 및 오프라인 경험에 대한 분석 결과를 보여줍니다.

{% Aside 'key-term' %} 유효 연결 유형은 사용자 기기의 대역폭 측정을 기반으로 하고 사용된 특정 기술을 의미하지 않기 때문에 *효과적인 것*으로 간주됩니다. 예를 들어 빠른 Wi-Fi를 사용하는 데스크탑 사용자는 4G로 레이블이 지정되고 느린 모바일 연결은 2G로 레이블이 지정될 수 있습니다. {% endAside %}

이러한 차원의 분포는 [First Contentful Paint](/fcp/)(FCP) 히스토그램 데이터의 세그먼트를 사용하여 계산됩니다.

## 자주 묻는 질문

### 다른 도구와 달리 CrUX 대시보드는 언제 사용합니까?

CrUX 대시보드는 BigQuery에서 사용 가능한 동일한 기본 데이터를 기반으로 하지만 데이터를 추출하기 위해 SQL 한 줄을 작성할 필요가 없으며 무료 할당량 초과에 대해 걱정할 필요가 없습니다. 대시보드는 빠르고 쉽게 설정할 수 있으며 모든 시각화가 생성되어 제어 상태에서 원하는 모든 사용자와 공유할 수 있습니다.

### CrUX 대시보드 사용에 제한이 있습니까?

BigQuery를 기반으로 한다는 것은 CrUX 대시보드의 모든 제한 사항도 상속한다는 것을 의미합니다. 매월 세분화된 출처 수준 데이터로 제한됩니다.

또한 CrUX 대시보드는 단순성과 편의성을 위해 BigQuery에 있는 원시 데이터의 다양성을 일부 대신합니다. 예를 들어 매트릭 분포는 전체 히스토그램과 달리 "좋음", "개선 필요" 및 "나쁨"으로만 제공됩니다. 또한 CrUX 대시보드는 글로벌 수준의 데이터를 제공하는 반면 BigQuery 데이터 세트를 사용하면 특정 국가를 확대할 수 있습니다.

### Data Studio에 대한 자세한 내용은 어디에서 확인할 수 있습니까?

자세한 내용은 [Data Studio 기능 페이지](https://marketingplatform.google.com/about/data-studio/features/)를 확인하세요.
