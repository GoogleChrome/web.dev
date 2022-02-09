---
layout: post
title: 성능 예산에 Lighthouse 사용
authors:
  - katiehempenius
description: |2-

  Lighthouse는 이제 성능 예산을 지원합니다. LightWallet은 5분 이내에 설정할 수 있고 페이지 리소스 크기와 수량에 대한 피드백을 제공합니다.
date: 2019-06-14
updated: 2020-04-03
tags:
  - blog
  - performance
---

[Lighthouse](https://github.com/GoogleChrome/lighthouse)는 이제 성능 예산을 지원합니다. [LightWallet](https://developers.google.com/web/tools/lighthouse/audits/budgets)은 5분 이내에 설정할 수 있으며 성능 지표, 페이지 리소스의 크기 및 수량에 대한 피드백을 제공합니다.

## Lighthouse 설치

LightWallet은 Lighthouse v5+의 명령줄 버전에서 사용할 수 있습니다.

시작하려면 Lighthouse를 설치하세요.

```bash
npm install -g lighthouse
```

## 예산 만들기

`budget.json`이라는 파일을 만듭니다. 이 파일에 다음 JSON을 추가합니다.

```json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3000
      },
      {
        "metric": "first-meaningful-paint",
        "budget": 1000
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 125
      },
      {
        "resourceType": "total",
        "budget": 300
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ]
  }
]
```

이 예제 `budget.json` 파일은 5개의 개별 예산을 설정합니다.

- 상호작용까지의 시간: 3000ms.
- 첫 번째 의미 있는 페인트(FMP): 1000ms.
- 페이지의 총 JavaScript 양: 125KB.
- 페이지의 전체 크기: 300KB.
- 타사 출처에 대한 요청 수: 10개.

지원되는 성능 메트릭 및 리소스 유형의 전체 목록은 Lighthouse 문서의 [성능 예산](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md) 섹션을 참조하십시오.

## Lighthouse 실행

`--budget-path` 플래그를 사용하여 Lighthouse를 실행합니다. 이 플래그는 Lighthouse에 예산 파일의 위치를 알려줍니다.

```bash
lighthouse https://example.com --budget-path=./budget.json
```

{% Aside %} **참고**: 예산 파일의 이름은 `budget.json`일 필요가 없습니다. {% endAside %}

## 결과 보기

LightWallet이 올바르게 구성된 경우 Lighthouse 보고서에는 **성능** 범주 내에 **예산** 섹션이 포함됩니다.

{% Img src="image/admin/FdUeI8rKZtJB3Ol624S3.png", alt="Lighthouse 보고서의 '예산' 섹션", width="800", height="289" %}

Lighthouse 보고서의 JSON 버전에서 Lightwallet 결과는 `performance-budget` 감사 결과 내에서 찾을 수 있습니다.
