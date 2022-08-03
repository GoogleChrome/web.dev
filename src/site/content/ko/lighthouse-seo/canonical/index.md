---
layout: post
title: 문서에 유효한 `rel=canonical`이 없음
description: '"문서에 유효한 rel=canonical이 없음" Lighthouse 감사에 대해 알아봅니다.'
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - canonical
---

여러 페이지에 유사한 콘텐츠가 있는 경우 검색 엔진은 이를 동일한 페이지의 중복 버전으로 간주합니다. 예를 들어, 제품 페이지의 데스크톱 및 모바일 버전은 종종 중복으로 간주됩니다.

검색 엔진은 페이지 중 하나를 *정식(canonical)* 또는 기본 버전으로 선택하고 해당 페이지를 더 **크롤링**합니다. 유효한 정식 링크를 사용하면 크롤링하여 검색 결과에서 사용자에게 표시할 페이지 버전을 검색 엔진에 알릴 수 있습니다.

{% Aside 'key-term' %} *크롤링*은 검색 엔진이 웹에서 콘텐츠 색인을 업데이트하는 방식입니다. {% endAside %}

정식 링크를 사용하면 다음과 같은 많은 이점이 있습니다.

- 검색 엔진이 여러 URL을 단일 선호 URL로 통합하는 데 도움이 됩니다. 예를 들어 다른 사이트에서 여러분의 페이지 링크 끝에 검색어 매개변수를 추가하면 검색 엔진이 해당 URL을 여러분이 선호하는 버전으로 통합합니다.
- 추적 방법을 단순화합니다. 하나의 URL을 추적하는 것이 여러 URL을 추적하는 것보다 쉽습니다.
- 여러분의 원본 콘텐츠에 대한 신디케이티드 링크를 여러분이 선호하는 URL로 다시 통합하여 신디케이티드 콘텐츠의 페이지 순위를 향상시킵니다.

## Lighthouse 정식 링크 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 잘못된 정식 링크가 있는 아무 페이지에나 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TLhOThFgDllifsEEeOH3.png", alt="유효하지 않은 정식 링크가 있는 문서를 표시하는 Lighthouse 감사", width="800", height="76" %}</figure>

다음 조건 중 하나라도 충족되면 페이지가 이 감사에 실패합니다.

- 하나 이상의 정식 링크가 있습니다.
- 정식 링크가 유효한 URL이 아닙니다.
- 정식 링크가 다른 지역 또는 언어의 페이지를 가리킵니다.
- 정식 링크가 다른 도메인을 가리킵니다.
- 정식 링크가 사이트 루트를 가리킵니다. 이 시나리오는 AMP 또는 모바일 페이지 변형과 같은 일부 시나리오에서 유효할 수 있지만 Lighthouse는 그럼에도 불구하고 이를 실패로 취급합니다.

{% include 'content/lighthouse-seo/scoring.njk' %}

## 페이지에 정식 링크를 추가하는 방법

정식 링크를 지정하기 위한 두 가지 옵션이 있습니다.

**옵션 1:** 페이지의 `<head>`에 `<link rel=canonical>` 요소를 추가

```html/4
<!doctype html>
<html lang="en">
  <head>
    …
    <link rel="canonical" href="https://example.com"/>
    …
  </head>
  <body>
    …
  </body>
</html>
```

**옵션 2:** HTTP 응답에 `Link` 헤더를 추가

```html
Link: https://example.com; rel=canonical
```

각 접근 방식의 장단점 목록은 Google의 [중복 URL 통합](https://support.google.com/webmasters/answer/139066) 페이지를 참조하세요.

### 일반 지침

- 정식 URL이 유효한지 확인합니다.
- 가능하면 HTTP 대신 안전한 [HTTPS](/why-https-matters/) 정식 URL을 사용합니다.
- [`hreflang` 링크](/hreflang)를 사용하여 사용자의 언어 또는 국가에 따라 다른 버전의 페이지를 제공하는 경우 정식 URL이 해당 언어 또는 국가에 대한 적절한 페이지를 가리키는지 확인합니다.
- 정식 URL을 다른 도메인으로 지정하지 않습니다. Yahoo와 Bing은 이를 허용하지 않습니다.
- 콘텐츠가 동일하지 않은 경우 하위 수준 페이지가 사이트의 루트 페이지를 가리키도록 하지 않습니다.

### Google 특정 가이드라인

- [구글 서치 콘솔](https://search.google.com/search-console/index)을 사용하여 여러분의 전체 사이트에서 Google이 정식 또는 중복 URL로 간주하는 URL을 확인합니다.
- 정식으로 만들기 위해 Google의 URL 제거 도구를 사용하지 않습니다. 이렇게 하면 검색에서 URL의 *모든* 버전을 제거합니다.

{% Aside 'note' %} 다른 검색 엔진의 추천을 환영합니다. [이 페이지를 편집하세요](https://github.com/GoogleChrome/web.dev/blob/master/src/site/content/en/lighthouse-seo/canonical/index.md). {% endAside %}

## 참고 자료

- [**문서에 유효한 `rel=canonical`**이 없음 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/canonical.js)
- [rel=canonical 관련 5가지 일반적인 실수](https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html)
- [중복 URL 통합](https://support.google.com/webmasters/answer/139066)
- [매개변수화된 중복 콘텐츠 크롤링 차단](https://support.google.com/webmasters/answer/6080548)
- [구글 서치 콘솔](https://search.google.com/search-console/index)
